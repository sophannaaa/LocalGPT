import { FAQButton } from "./FAQButton";
import { faqList } from "../../constants/faqList"
import { Stack } from "@fluentui/react";

import styles from "./FAQGrid.module.css";

interface IFAQGridProps {
    onSend: (question: string, id?: string) => void;
    conversationId?: string;
}

export const FAQGrid: React.FC<IFAQGridProps> = ({ onSend, conversationId }) => {
    return (
        <Stack horizontalAlign="center" className={styles.FAQGrid}>
            {faqList.map((question) => {
                return <FAQButton
                    question={question}
                    onSend={(question, conversationId) => onSend(question, conversationId)}
                    conversationId={conversationId}
                />
            })}
        </Stack>
    );
};