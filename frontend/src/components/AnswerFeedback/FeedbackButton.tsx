import * as React from 'react'
import { Stack, IIconProps, Callout, DelayedRender, Text, DirectionalHint } from '@fluentui/react'
import { DefaultButton, IButtonStyles } from '@fluentui/react/lib/Button'

import { historyMessageFeedback, Feedback, FeedbackBody, FeedbackRating } from '@api/index'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { useState, useEffect, useContext } from 'react'
import { AppStateContext, ActionType } from '@state/AppProvider'

import styles from './FeedbackButton.module.css'

export interface IFeedbackButtonProps {
  messageId: string
  disabled?: boolean
}

const LikeIcon: IIconProps = { iconName: 'Like' }
const DislikeIcon: IIconProps = { iconName: 'Dislike' }

const buttonStyles: IButtonStyles = {
  root: {
    backgroundColor: 'white',
    color: 'black',
    width: '100px',
    border: '1px solid rgb(138, 136, 134)',
    borderRadius: '3px'
  },
  rootPressed: {
    backgroundColor: 'white',
    transform: 'scale(1)'
  },
  rootChecked: {
    backgroundColor: '#2B88D8',
    color: 'white',
    borderColor: '#2B88D8'
  },
  rootCheckedHovered: {
    backgroundColor: '#2B88D8',
    color: 'white'
  },
  rootCheckedPressed: {
    backgroundColor: '#2B88D8'
  },
  rootDisabled: {
    backgroundColor: 'white',
    color: 'black'
  }
}

export const FeedbackButton: React.FC<IFeedbackButtonProps> = (props: IFeedbackButtonProps) => {
  const { messageId: message_id, disabled } = props

  const appStateContext = useContext(AppStateContext)
  const feedback = appStateContext?.state.messageIdFeedback[message_id]

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [isPositiveFeedbackCalloutVisible, setIsPositiveFeedbackCalloutVisible] = useState<boolean>(false)
  const [isPositiveFeedbackRescindedCalloutVisible, setIsPositiveFeedbackRescindedCalloutVisible] =
    useState<boolean>(false)
  const [isNegativeFeedbackCalloutVisible, setIsNegativeFeedbackCalloutVisible] = useState<boolean>(false)
  const [isNegativeFeedbackRescindedCalloutVisible, setIsNegativeFeedbackRescindedCalloutVisible] =
    useState<boolean>(false)
  const [isLikeSubmitted, setIsLikeSubmitted] = useState<boolean>(false)
  const [isDislikeSubmitted, setIsDislikeSubmitted] = useState<boolean>(false)

  const buttonIdLike = useId('callout-button-like')
  const buttonIdDislike = useId('callout-button-dislike')

  useEffect(() => {
    setIsLikeSubmitted(feedback?.rating === FeedbackRating.POSITIVE)
    setIsDislikeSubmitted(feedback?.rating === FeedbackRating.NEGATIVE)
    setIsNegativeFeedbackCalloutVisible(feedback?.rating === FeedbackRating.NEGATIVE)
  }, [feedback])

  useEffect(() => {
    setTimeout(() => setIsNegativeFeedbackCalloutVisible(false), 1000)
  }, [isNegativeFeedbackCalloutVisible])

  const handleLikeClick = () => {
    isLikeSubmitted ? handleSendNeutralFeedback(true) : handleSendPositiveFeedback()

    // user clicks like after having submitted dislike
    if (isDislikeSubmitted && !isLikeSubmitted) {
      handleSendPositiveFeedback()
    }
  }

  const handleSendPositiveFeedback = async () => {
    setIsRefreshing(true)
    const response = await historyMessageFeedback(message_id, FeedbackBody.POSITIVE)
    if (response.ok) {
      setIsPositiveFeedbackCalloutVisible(true)
      setTimeout(() => setIsPositiveFeedbackCalloutVisible(false), 1000)
      setIsLikeSubmitted(true)
      appStateContext?.dispatch({
        type: ActionType.SET_MESSAGE_FEEDBACK,
        payload: { messageId: message_id, feedback: FeedbackBody.POSITIVE }
      })
    } else {
      console.error(`Failed to submit feedback. Status: ${response.status}`)
    }
    setIsRefreshing(false)
  }

  const handleSendNeutralFeedback = async (positiveToNeutral: boolean) => {
    setIsRefreshing(true)
    const response = await historyMessageFeedback(message_id, FeedbackBody.NEUTRAL)
    if (response.ok) {
      if (positiveToNeutral) {
        setIsPositiveFeedbackRescindedCalloutVisible(true)
        setTimeout(() => setIsPositiveFeedbackRescindedCalloutVisible(false), 1000)
        setIsLikeSubmitted(false)
      } else {
        setIsNegativeFeedbackRescindedCalloutVisible(true)
        setTimeout(() => setIsNegativeFeedbackRescindedCalloutVisible(false), 1000)
      }

      appStateContext?.dispatch({
        type: ActionType.SET_MESSAGE_FEEDBACK,
        payload: { messageId: message_id, feedback: FeedbackBody.NEUTRAL }
      })
    } else {
      console.error(`Failed to submit feedback. Status: ${response.status}`)
    }
    setIsRefreshing(false)
  }

  const handleDislikeClick = () => {
    appStateContext?.dispatch({ type: ActionType.SET_CURRENT_MESSAGE_ID_FEEDBACK, payload: message_id })

    isDislikeSubmitted
      ? handleSendNeutralFeedback(false)
      : appStateContext?.dispatch({ type: ActionType.SET_SHOW_FEEDBACK, payload: true })
  }

  return (
    <Stack horizontal className={styles.buttonContainer}>
      <>
        <DefaultButton
          toggle
          text={'Helpful'}
          id={buttonIdLike}
          iconProps={LikeIcon}
          styles={buttonStyles}
          style={{ cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
          checked={isLikeSubmitted}
          onClick={() => !isRefreshing && handleLikeClick()}
          allowDisabledFocus
          disabled={isRefreshing}
        />
        {isPositiveFeedbackCalloutVisible &&
          !isPositiveFeedbackRescindedCalloutVisible &&
          !isNegativeFeedbackCalloutVisible &&
          !isNegativeFeedbackRescindedCalloutVisible && (
            <Callout
              className={styles.callout}
              target={`#${buttonIdLike}`}
              onDismiss={() => setIsPositiveFeedbackCalloutVisible(false)}
              role="alert"
              directionalHint={DirectionalHint.bottomCenter}>
              <DelayedRender>
                <Text variant="small">Thank you! Your feedback will help us improve our system.</Text>
              </DelayedRender>
            </Callout>
          )}
        {isPositiveFeedbackRescindedCalloutVisible &&
          !isPositiveFeedbackCalloutVisible &&
          !isNegativeFeedbackCalloutVisible &&
          !isNegativeFeedbackRescindedCalloutVisible && (
            <Callout
              className={styles.callout}
              target={`#${buttonIdLike}`}
              onDismiss={() => setIsPositiveFeedbackRescindedCalloutVisible(false)}
              role="alert"
              directionalHint={DirectionalHint.bottomCenter}>
              <DelayedRender>
                <Text variant="small">Feedback was rescinded.</Text>
              </DelayedRender>
            </Callout>
          )}
      </>
      <>
        <DefaultButton
          toggle
          text={'Unhelpful'}
          iconProps={DislikeIcon}
          onClick={() => !isRefreshing && handleDislikeClick()}
          id={buttonIdDislike}
          allowDisabledFocus
          checked={isDislikeSubmitted}
          disabled={disabled}
          styles={buttonStyles}
          style={{ cursor: isRefreshing ? 'not-allowed' : 'pointer' }}
        />
        {isNegativeFeedbackCalloutVisible &&
          !isNegativeFeedbackRescindedCalloutVisible &&
          !isPositiveFeedbackCalloutVisible &&
          !isPositiveFeedbackRescindedCalloutVisible && (
            <Callout
              className={styles.callout}
              target={`#${buttonIdDislike}`}
              onDismiss={() => setIsNegativeFeedbackCalloutVisible(false)}
              role="alert"
              directionalHint={DirectionalHint.bottomCenter}>
              <DelayedRender>
                <Text variant="small">Thank you! Your feedback will help us improve our system.</Text>
              </DelayedRender>
            </Callout>
          )}
        {isNegativeFeedbackRescindedCalloutVisible &&
          !isNegativeFeedbackCalloutVisible &&
          !isPositiveFeedbackCalloutVisible &&
          !isPositiveFeedbackRescindedCalloutVisible && (
            <Callout
              className={styles.callout}
              target={`#${buttonIdDislike}`}
              onDismiss={() => setIsNegativeFeedbackRescindedCalloutVisible(false)}
              role="alert"
              directionalHint={DirectionalHint.bottomCenter}>
              <DelayedRender>
                <Text variant="small">Feedback was rescinded.</Text>
              </DelayedRender>
            </Callout>
          )}
      </>
    </Stack>
  )
}
