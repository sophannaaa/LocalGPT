import { Header } from '@components/common/Header'
import MR_LOGO from '@assets/MRLogo.png'

import styles from './Loading.module.css'

export default function Loading() {
  return (
    <div className={styles.container} role="main">
      <Header
        hideViewPolicy={true}
        hideContactUs={true}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
        <h1>Authorizing for Private Preview...</h1>
      </div>
    </div>
  )
}
