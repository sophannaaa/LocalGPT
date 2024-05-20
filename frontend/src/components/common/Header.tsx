import { ITextProps, Stack, DefaultButton, Icon } from '@fluentui/react'
import React from 'react'

import styles from './Header.module.css'

interface IHeaderProps extends ITextProps {
  onClick: () => void
  onViewPolicyClick: () => void
  title: string
  imgSrc: string
  disabled: boolean
}

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
      <Stack horizontal className={styles.viewPolicyButtonContainerStack}>
        <Stack horizontal className={styles.viewPolicyButtonStack} verticalAlign='center'>
          <Icon iconName="Info" style={{ paddingTop: '2px' }} />
          <DefaultButton className={styles.viewPolicyButton} onClick={p.onViewPolicyClick}>
            View Policy
          </DefaultButton>
        </Stack>
      </Stack>
    </Stack>
  )
}
