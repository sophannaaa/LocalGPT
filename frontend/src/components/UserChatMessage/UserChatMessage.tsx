import styles from "./UserChatMessage.module.css";
import UserAvatar from '@assets/squidward.svg';

interface IUserChatMessageProps {
    message: string;
}

export const UserChatMessage: React.FC<IUserChatMessageProps> = ({ message }) => {
    return (
        <div className={styles.chatMessageUser} tabIndex={0}>
            <div className={styles.chatMessageUserMessage}>{message}</div>
            <img src={UserAvatar} style={{ width: '32px', height: '32px' }} />
        </div>
    );
};
