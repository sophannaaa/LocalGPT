import * as React from 'react'
import { useState } from 'react'
import {
  Modal,
  getTheme,
  mergeStyleSets,
  FontWeights,
  IDragOptions,
  PrimaryButton,
  Stack,
  IconButton,
  IIconProps,
  Link,
  ContextualMenu
} from '@fluentui/react'

import styles from './PolicyNotice.module.css'

interface IPolicyNotice {
  hidden: boolean
  onDismiss: () => void
  onAgree: () => void
}

const dragOptions: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child'
}
const linkToCUIPolicy = 'https://microsoft.service-now.com/grc?id=kb_article&sys_id=fd98968f90288a50f0c5687750344e31'
const cancelIcon: IIconProps = { iconName: 'Cancel' }

export const PolicyNotice: React.FC<IPolicyNotice> = (props: IPolicyNotice) => {
  const { hidden, onDismiss, onAgree } = props

  const [linkClicked, setLinkClicked] = useState<boolean>(false)
  const [agreed, setAgreed] = useState<boolean>(false)

  const handleLinkClick = () => {
    setLinkClicked(true)
  }

  const handleAgree = () => {
    setAgreed(true)
    onAgree()
  }

  return (
    <Modal
      titleAriaId="titleId"
      isOpen={hidden}
      isBlocking={true}
      isDarkOverlay={true}
      isClickableOutsideFocusTrap={false}
      onDismiss={onDismiss}
      scrollableContentClassName={styles.scrollableContent}
      dragOptions={dragOptions}
      styles={{
        main: {
          width: '513px',
          height: 'auto',
          borderRadius: '8px'
        }
      }}>
      <div className={styles.header}>
        <span id="titleId">Notice</span>
        {agreed && (
          <IconButton className={styles.iconButton} iconProps={cancelIcon} ariaLabel="Close" onClick={onDismiss} />
        )}
      </div>

      <div className={styles.body}>
        <p>
          This is not an approved environment to transmit ITAR/CUI data.
          <br />
          <br />
          By clicking accept you acknowledge that you have read and understood the
          <Link
            onClick={handleLinkClick}
            style={{ textDecoration: 'underline' }}
            href={linkToCUIPolicy}
            target={linkToCUIPolicy}>
            Mixed Reality CUI Policy.
          </Link>
          {/* Please review the
                    <Link
                        onClick={handleLinkClick}
                        style={{ textDecoration: 'underline' }}
                        href={linkToCUIPolicy}
                        target={linkToCUIPolicy}>
                        CUI Policy.
                    </Link>

                    <br />
                    This is not an approved environment to transmit CUI data.
                    Come back to this webpage after having reviewed the policy.
                    <br />
                    You will not be able to proceed forward or input any questions until you agree.
                    <br /> */}
        </p>

        <Stack horizontalAlign="stretch">
          <PrimaryButton onClick={handleAgree} style={{ margin: '10px 30%' }}>
            I Accept
          </PrimaryButton>
        </Stack>
      </div>
    </Modal>
  )
}
