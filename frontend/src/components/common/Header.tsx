import { ITextProps, Stack, DefaultButton, Icon, Link } from '@fluentui/react'
import React from 'react'

import styles from './Header.module.css'

interface IHeaderProps extends ITextProps {
  onClick: () => void
  onViewPolicyClick: () => void
  title: string
  imgSrc: string
  disabled: boolean
}

const MR_PPC_EMAIL = 'MRPPCtooling@microsoft.com'
const PREDEFINED_EMAIL_BODY_FORMAT = 'Hello MR PPC Tooling Team,\n\n I am contacting you regarding...'
const PREDEFINED_EMAIL_SUBJECT = 'PPC Copilot Feedback';


export const Header: React.FC<IHeaderProps> = (p: IHeaderProps) => {
  const handleClick = () => {
    if (!p.disabled) {
      p.onClick()
    }
  }

  return (
    <Stack horizontal className={styles.header} role={'banner'}>
      <Stack horizontal verticalAlign="center" className={styles.titleStack} style={{ cursor: p.disabled ? 'default' : 'pointer' }}>
        <img src={p.imgSrc} className={styles.headerIcon} aria-hidden="true" onClick={handleClick} />
        <h1 className={styles.headerTitle} onClick={handleClick}>
          {p.title}
        </h1>
      </Stack>
      <Stack horizontal className={styles.extrasContainer}>
        <Link
          href={
            `mailto:${MR_PPC_EMAIL}` +
            `?subject=${encodeURIComponent(PREDEFINED_EMAIL_SUBJECT)}` +
            `&body=${encodeURIComponent(PREDEFINED_EMAIL_BODY_FORMAT)}`
          }
          className={styles.mailtoLink}
          style={{ fontSize: '14px', textDecoration: 'none' }}
          underline={false}
        >
          <Icon iconName="Mail" style={{ paddingTop: '2px', marginRight: '4px' }} />
          Contact Us
        </Link>

        <div className={styles.verticalLine}></div>

        <Stack horizontal className={styles.viewPolicyButtonStack} verticalAlign='center'>
          <DefaultButton className={styles.viewPolicyButton} onClick={p.onViewPolicyClick}>
            <Icon iconName="Info" style={{ paddingTop: '2px', marginRight: '4px' }} />
            View Policy
          </DefaultButton>
        </Stack>
      </Stack>
    </Stack>
  )
}
