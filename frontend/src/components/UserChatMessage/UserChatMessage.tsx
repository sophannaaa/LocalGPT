import styles from './UserChatMessage.module.css'
import DEFAULT_AVATAR from '@assets/UserAvatar.svg'

interface IUserChatMessageProps {
  message: string
}

export const UserChatMessage: React.FC<IUserChatMessageProps> = ({ message }) => {
  return (
    <div className={styles.chatMessageUser} tabIndex={0}>
      <div className={styles.chatMessageUserMessage}>{message}</div>
      <img src={DEFAULT_AVATAR} style={{ width: '32px', height: '32px', border: '2px solid rgb(161 159 157)', borderRadius: '16px' }} />
    </div>
  )
}
