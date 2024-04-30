import React, { useState, FormEvent } from "react";
import { Checkbox, DefaultButton, Stack, TextField, Label, IconButton, Modal } from "@fluentui/react";
import { historyMessageFeedback, FeedbackRating, FeedbackOptions, Feedback } from "../../api";

import styles from "./AnswerFeedback.module.css"

export interface IAnswerFeedbackProps {
    message_id: string;
    isModalOpen: boolean;

    handleDislikeDismiss: () => void;
    handleDislikeSubmissionSuccess: () => void;
    handleDislikeSubmissionFail: () => void;
    children?: React.ReactNode;
}

interface IFeedbackContentProps {
    children?: React.ReactNode;
}

export const AnswerFeedback: React.FC<IAnswerFeedbackProps> = (props: IAnswerFeedbackProps) => {
    const {
        message_id,
        isModalOpen,
        handleDislikeDismiss,
        handleDislikeSubmissionSuccess,
        handleDislikeSubmissionFail,
    } = props;


    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackselection, setFeedbackselection] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showReportInappropriateFeedback, setShowReportInappropriateFeedback] = useState<boolean>(false);
    const [negativeFeedbackList, setNegativeFeedbackList] = useState<FeedbackOptions[]>([]);
    const [feedbackMessage, setFeedbackMessage] = useState<string>('');

    const updateFeedbackList = (ev?: FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        let selectedFeedback = (ev?.target as HTMLInputElement)?.id as FeedbackOptions;

        let feedbackList = negativeFeedbackList.slice();
        if (checked) {
            feedbackList.push(selectedFeedback);
        } else {
            feedbackList = feedbackList.filter((f) => f !== selectedFeedback);
        }

        setNegativeFeedbackList(feedbackList);
    };


    const handleSetFeedbackMessage = (ev?: FormEvent<HTMLElement | HTMLInputElement>, newValue?: string) => {
        setFeedbackMessage(newValue || '');
    };

    const UnhelpfulFeedbackContent = () => {
        return (
            <>
                <div>Why wasn't this response helpful?</div>
                <Stack tokens={{ childrenGap: 4 }}>
                    <Checkbox label="Citations are missing" id={FeedbackOptions.MissingCitation} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.MissingCitation)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Citations are wrong" id={FeedbackOptions.WrongCitation} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.WrongCitation)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="The response is not from my data" id={FeedbackOptions.OutOfScope} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.OutOfScope)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Inaccurate or irrelevant" id={FeedbackOptions.InaccurateOrIrrelevant} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.InaccurateOrIrrelevant)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Other" id={FeedbackOptions.OtherUnhelpful} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.OtherUnhelpful)} onChange={updateFeedbackList}></Checkbox>
                </Stack>
            </>);
    }

    const ReportInappropriateFeedbackContent = () => {
        return (
            <>
                <div>Why was this response inappropriate?</div>
                <Stack tokens={{ childrenGap: 4 }}>
                    <Checkbox label="Hate speech, stereotyping, demeaning" id={FeedbackOptions.HateSpeech} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.HateSpeech)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Violent: glorification of violence, self-harm" id={FeedbackOptions.Violent} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.Violent)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Sexual: explicit content, grooming" id={FeedbackOptions.Sexual} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.Sexual)} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Manipulative: devious, emotional, pushy, bullying" defaultChecked={negativeFeedbackList.includes(FeedbackOptions.Manipulative)} id={FeedbackOptions.Manipulative} onChange={updateFeedbackList}></Checkbox>
                    <Checkbox label="Other" id={FeedbackOptions.OtherHarmful} defaultChecked={negativeFeedbackList.includes(FeedbackOptions.OtherHarmful)} onChange={updateFeedbackList}></Checkbox>
                </Stack>
            </>
        );
    }

    const resetFeedbackDialog = () => {
        handleDislikeDismiss();
        setShowReportInappropriateFeedback(false);
        setNegativeFeedbackList([]);
        setFeedbackMessage('');
    }

    const onSubmitNegativeFeedback = async () => {
        if (message_id == undefined) return;
        const negative_feedback_body = {
            rating: FeedbackRating.Negative,
            sentiment: negativeFeedbackList,
            message: feedbackMessage
        }
        const response = await historyMessageFeedback(message_id, negative_feedback_body);

        if (response.ok) {
            handleDislikeSubmissionSuccess();
            console.log('Submitted Feedback successfully')
        } else {
            handleDislikeSubmissionFail();
            console.error(`Failed to submit feedback. Status: ${response.status}`);
        }

        resetFeedbackDialog();
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onDismiss={handleDislikeDismiss}
            styles={{
                main: {
                    width: '513px',
                },
                scrollableContent: {

                }
            }}
        >
            <div className={styles.feedbackContainer}>
                <div className={styles.firstRow}>
                    <Label style={{ font: 'Segoe UI', fontSize: '20px', fontWeight: '600' }}>Feedback & Bug Report</Label>
                    <IconButton iconProps={{ iconName: 'Cancel' }} className={styles.backbutton} style={{ color: '#424242' }} onClick={resetFeedbackDialog} />
                </div>
                <Stack tokens={{ childrenGap: 4 }}>
                    {!showReportInappropriateFeedback ? (
                        <>
                            <UnhelpfulFeedbackContent />
                            {negativeFeedbackList.includes(FeedbackOptions.OtherUnhelpful)
                                && !negativeFeedbackList.includes(FeedbackOptions.OtherHarmful) && (
                                    <TextField
                                        multiline
                                        value={feedbackMessage}
                                        rows={4}
                                        required
                                        autoAdjustHeight
                                        onChange={handleSetFeedbackMessage}
                                        placeholder="Enter additional feedback here..."
                                    />
                                )}
                            <div
                                onClick={() => { setShowReportInappropriateFeedback(true); setNegativeFeedbackList([]); setFeedbackMessage(''); }}
                                style={{ color: "#115EA3", cursor: "pointer" }}>
                                Report inappropriate content
                            </div>
                        </>
                    ) : <>
                        <ReportInappropriateFeedbackContent />
                        {negativeFeedbackList.includes(FeedbackOptions.OtherHarmful)
                            && !negativeFeedbackList.includes(FeedbackOptions.OtherUnhelpful) && (
                                <TextField
                                    multiline
                                    value={feedbackMessage}
                                    rows={4}
                                    required
                                    autoAdjustHeight
                                    onChange={handleSetFeedbackMessage}
                                    placeholder="Enter additional feedback here..."
                                />
                            )}
                        <div
                            onClick={() => { setShowReportInappropriateFeedback(false); setNegativeFeedbackList([]); setFeedbackMessage(''); }}
                            style={{ color: "#115EA3", cursor: "pointer" }}>
                            Report inaccurate content
                        </div>
                    </>}

                    <div>By pressing submit, your feedback will be visible to the application owner.</div>

                    <DefaultButton
                        disabled={negativeFeedbackList.length < 1 || ((negativeFeedbackList.includes(FeedbackOptions.OtherUnhelpful) || negativeFeedbackList.includes(FeedbackOptions.OtherHarmful)) && feedbackMessage.length < 1)}
                        onClick={onSubmitNegativeFeedback}>Submit</DefaultButton>
                </Stack>
            </div>
        </Modal>
    );
}

// export default AnswerFeedback;