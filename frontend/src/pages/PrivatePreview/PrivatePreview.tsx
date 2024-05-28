import { Header } from '@components/common/Header'

import styles from './PrivatePreview.module.css'

export default function PrivatePreview() {
  return (
    <div className={styles.container} role="main">
      <Header
        hideViewPolicy={true}
        requestAccess={true}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
        <h1>This service is currently in Private Preview.</h1>
        <p>
          You do not have access to the private preview.
          <br /> <br />
          If you believe this is a mistake, please hit contact us to request access.
        </p>
      </div>
    </div>
  )
}
