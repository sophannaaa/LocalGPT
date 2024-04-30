import * as React from "react";
import { Stack, IIconProps, Callout, DelayedRender, Text } from "@fluentui/react";
import { DefaultButton, IButtonStyles } from "@fluentui/react/lib/Button";

import { historyMessageFeedback, Feedback, FeedbackOptions, FeedbackRating } from "../../api";
import { useBoolean, useId } from '@fluentui/react-hooks';
import { useState, useEffect } from "react";

import styles from "./FeedbackButton.module.css";

export interface IFeedbackButtonProps {
    message_id: string;
    disabled?: boolean;
    dislike_status: boolean;
    onDislikeClick: () => void;
    handleSetSelectedMessageId: (value: string) => void;
    handleDislikeSubmissionFailed: () => void;
}

const LikeIcon: IIconProps = { iconName: "Like" };
const DislikeIcon: IIconProps = { iconName: "Dislike" };

const buttonStyles: IButtonStyles = {
    root: {
        backgroundColor: 'white',
        color: 'black',
        width: '100px',
        border: '1px solid rgb(138, 136, 134)',
        borderRadius: '3px',
    },
    rootPressed: {
        backgroundColor: 'white',
        transform: 'scale(1)',
    },
    rootChecked: {
        backgroundColor: '#2B88D8',
        color: 'white',
        borderColor: '#2B88D8'
    },
    rootCheckedHovered: {
        backgroundColor: '#2B88D8',
        color: 'white',
    },
    rootCheckedPressed: {
        backgroundColor: '#2B88D8',
    },
    rootDisabled: {
        backgroundColor: 'white',
        color: 'black',
    },
};

export const FeedbackButton: React.FC<IFeedbackButtonProps> = (props: IFeedbackButtonProps) => {
    const {
        message_id,
        disabled,
        dislike_status,
        onDislikeClick,
        handleSetSelectedMessageId,
        handleDislikeSubmissionFailed
    } = props;

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    // const [isPositiveFeedbackCalloutVisible, { toggle: toggleIsFeedbackCalloutVisible }] = useBoolean(false);
    // const [isFeedbackRescindedCalloutVisible, { toggle: toggleIsFeedbackRescindedCalloutVisible }] = useBoolean(false);
    const [isPositiveFeedbackCalloutVisible, setIsPositiveFeedbackCalloutVisible] = useState(false);
    const [isFeedbackRescindedCalloutVisible, setIsFeedbackRescindedCalloutVisible] = useState(false);
    const [isLikeSubmitted, setIsLikeSubmitted] = useState<boolean>(false);
    const [isDislikeSubmitted, setIsDislikeSubmitted] = useState<boolean>(false);

    const buttonId = useId('callout-button');
    const buttonIdLike = useId('callout-button-like');

    let timeoutId = null;

    useEffect(() => {
        if (dislike_status) {
          setIsLikeSubmitted(false); 
        }
      }, [dislike_status]);

    const handleLikeClick = () => {
        isLikeSubmitted ? handleSendNeutralFeedback(message_id) : handleSendPositiveFeedback(message_id);

        if (dislike_status && !isLikeSubmitted) {
            handleDislikeSubmissionFailed();
        }
    }

    const handleSendPositiveFeedback = async (answer_id: string) => {
        const positive_feedback_body: Feedback = {
            rating: FeedbackRating.Positive,
            sentiment: [],
            message: ''
        }

        setIsRefreshing(true);
        const response = await historyMessageFeedback(answer_id, positive_feedback_body);
        if (response.ok) {
            setIsPositiveFeedbackCalloutVisible(true);
            setTimeout(() => setIsPositiveFeedbackCalloutVisible(false), 1000);
            setIsLikeSubmitted(true);
        } else {
            console.error(`Failed to submit feedback. Status: ${response.status}`);
        }
        setIsRefreshing(false);
    }

    const handleSendNeutralFeedback = async (answer_id: string) => {
        const neutral_feedback_body: Feedback = {
            rating: FeedbackRating.Neutral,
            sentiment: [],
            message: ''
        }

        setIsRefreshing(true);
        const response = await historyMessageFeedback(answer_id, neutral_feedback_body);
        if (response.ok) {
            setIsFeedbackRescindedCalloutVisible(true);
            setTimeout(() => setIsFeedbackRescindedCalloutVisible(false), 1000);
            setIsLikeSubmitted(false);
        } else {
            console.error(`Failed to submit feedback. Status: ${response.status}`);
        }
        setIsRefreshing(false);
    }



    const handleDislikeClick = (rate: string) => {
        onDislikeClick();
        handleSetSelectedMessageId(message_id);
    };

    return (
        <Stack horizontal className={styles.buttonContainer}>
            <>
                <DefaultButton
                    toggle
                    text={"Helpful"}
                    id={buttonIdLike}
                    iconProps={LikeIcon}
                    styles={buttonStyles}
                    checked={isLikeSubmitted}
                    onClick={() => !isRefreshing && handleLikeClick()}
                    allowDisabledFocus
                    disabled={isRefreshing}
                />
                {isPositiveFeedbackCalloutVisible && !isFeedbackRescindedCalloutVisible && (
                    <Callout className={styles.callout} target={`#${buttonIdLike}`} onDismiss={() => setIsPositiveFeedbackCalloutVisible(false)} role="alert">
                        <DelayedRender>
                            <Text variant="small">
                                The submission was successful
                            </Text>
                        </DelayedRender>
                    </Callout>
                )}
                {isFeedbackRescindedCalloutVisible && !isPositiveFeedbackCalloutVisible && (
                    <Callout className={styles.callout} target={`#${buttonIdLike}`} onDismiss={() => setIsFeedbackRescindedCalloutVisible(false)} role="alert">
                        <DelayedRender>
                            <Text variant="small">
                                Feedback was rescinded successfully
                            </Text>
                        </DelayedRender>
                    </Callout>
                )}
            </>
            <DefaultButton
                toggle
                text={"Unhelpful"}
                iconProps={DislikeIcon}
                onClick={() => handleDislikeClick("dislike")}
                allowDisabledFocus
                checked={dislike_status}
                disabled={disabled}
                styles={buttonStyles}
            />

        </Stack>
    );
};
