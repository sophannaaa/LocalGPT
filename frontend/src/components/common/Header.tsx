import { ITextProps, Stack, DefaultButton, Icon, Link, on } from '@fluentui/react'
import React from 'react'
import MR_LOGO from '@assets/MRLogo.png'

import styles from './Header.module.css'

interface IHeaderProps extends ITextProps {
  onClick?: () => void
  onViewPolicyClick?: () => void
  titleClickDisabled?: boolean
  hideViewPolicy?: boolean
  hideContactUs?: boolean
  requestAccess?: boolean
}

const MR_PPC_EMAIL = 'MRPPCtooling@microsoft.com'
const FEEDBACK_EMAIL_BODY = 'Hello MR PPC Tooling Team,\n\n I am contacting you regarding...'
const FEEDBACK_EMAIL_SUBJECT = 'PPC Copilot Feedback'

const ACCESS_EMAIL_BODY =
  'Hello MR PPC Tooling Team,\n\n I am contacting you regarding acquiring access to the Program Protection and Compliance Copilot. \n\nI would like to request access for: \n\n \tName(s): \n\tEmail(s): '
const ACCESS_EMAIL_SUBJECT = 'PPC Copilot Access Request'

const HEADER_TITLE = 'Program Protection and Compliance Copilot'

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const {
    onClick = () => { },
    onViewPolicyClick = () => { },
    titleClickDisabled = true,
    hideViewPolicy = false,
    hideContactUs = false,
    requestAccess = false
  } = props

  const handleClick = () => {
    if (!titleClickDisabled) {
      onClick()
    }
  }

  const emailSubject = requestAccess ? ACCESS_EMAIL_SUBJECT : FEEDBACK_EMAIL_SUBJECT
  const emailBody = requestAccess ? ACCESS_EMAIL_BODY : FEEDBACK_EMAIL_BODY

  return (
    <Stack horizontal className={styles.header} role={'banner'}>
      <Stack
        horizontal
        verticalAlign="center"
        className={styles.titleStack}
        style={{ cursor: titleClickDisabled ? 'default' : 'pointer' }}>
        <img src={MR_LOGO} className={styles.headerIcon} aria-hidden="true" onClick={handleClick} />
        <h1 className={styles.headerTitle} onClick={handleClick}>
          {HEADER_TITLE}
        </h1>
      </Stack>
      <Stack horizontal className={styles.extrasContainer}>
        {!hideContactUs && (
          <Stack horizontal className={styles.contactUsStack}>
            <Link
              href={
                `mailto:${MR_PPC_EMAIL}` +
                `?subject=${encodeURIComponent(emailSubject)}` +
                `&body=${encodeURIComponent(emailBody)}`
              }
              className={styles.mailtoLink}
              style={{ fontSize: '14px', textDecoration: 'none' }}
              underline={false}>
              <Icon iconName="Mail" style={{ paddingTop: '2px', marginRight: '4px' }} />
              Contact Us
            </Link>
          </Stack>
        )}

        {!hideViewPolicy && (
          <>
            <div className={styles.verticalLine}></div>

            <Stack horizontal className={styles.viewPolicyButtonStack} verticalAlign="center">
              <DefaultButton className={styles.viewPolicyButton} onClick={onViewPolicyClick}>
                <Icon iconName="Info" style={{ paddingTop: '2px', marginRight: '4px' }} />
                View Policy
              </DefaultButton>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  )
}
