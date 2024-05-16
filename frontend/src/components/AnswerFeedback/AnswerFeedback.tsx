import React, { useState, FormEvent, useContext } from 'react'
import { Checkbox, DefaultButton, Stack, TextField, Label, IconButton, Modal } from '@fluentui/react'
import { historyMessageFeedback, FeedbackRating, FeedbackOptions, Feedback, FeedbackBody } from '@api/index'
import { AppStateContext, ActionType } from '@state/AppProvider'

import styles from './AnswerFeedback.module.css'

export interface IAnswerFeedbackProps {
  children?: React.ReactNode
}

export const AnswerFeedback: React.FC<IAnswerFeedbackProps> = (props: IAnswerFeedbackProps) => {
  const { } = props

  const appStateContext = useContext(AppStateContext)

  const [showReportInappropriateFeedback, setShowReportInappropriateFeedback] = useState<boolean>(false)
  const [negativeFeedbackList, setNegativeFeedbackList] = useState<FeedbackOptions[]>([])
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const messageId = appStateContext?.state.currentMessageIdFeedback || ''

  const updateFeedbackList = (ev?: FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    let selectedFeedback = (ev?.target as HTMLInputElement)?.id as FeedbackOptions

    let feedbackList = negativeFeedbackList.slice()
    if (checked) {
      feedbackList.push(selectedFeedback)
    } else {
      feedbackList = feedbackList.filter(f => f !== selectedFeedback)
    }

    setNegativeFeedbackList(feedbackList)
  }

  const handleSetFeedbackMessage = (ev?: FormEvent<HTMLElement | HTMLInputElement>, newValue?: string) => {
    setFeedbackMessage(newValue || '')
  }

  const UnhelpfulFeedbackContent = () => {
    return (
      <>
        <div>Why wasn't this response helpful?</div>
        <Stack tokens={{ childrenGap: 4 }}>
          <Checkbox
            label="Citations are missing"
            id={FeedbackOptions.MISSING_CITATION}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.MISSING_CITATION)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Citations are wrong"
            id={FeedbackOptions.WRONG_CITATION}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.WRONG_CITATION)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="The response is not from my data"
            id={FeedbackOptions.OUT_OF_SCOPE}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.OUT_OF_SCOPE)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Inaccurate or irrelevant"
            id={FeedbackOptions.INACCURATE_OR_IRRELEVANT}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.INACCURATE_OR_IRRELEVANT)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Other"
            id={FeedbackOptions.OTHER_UNHELPFUL}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.OTHER_UNHELPFUL)}
            onChange={updateFeedbackList}></Checkbox>
        </Stack>
      </>
    )
  }

  const ReportInappropriateFeedbackContent = () => {
    return (
      <>
        <div>Why was this response inappropriate?</div>
        <Stack tokens={{ childrenGap: 4 }}>
          <Checkbox
            label="Hate speech, stereotyping, demeaning"
            id={FeedbackOptions.HATE_SPEECH}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.HATE_SPEECH)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Violent: glorification of violence, self-harm"
            id={FeedbackOptions.VIOLENT}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.VIOLENT)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Sexual: explicit content, grooming"
            id={FeedbackOptions.SEXUAL}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.SEXUAL)}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Manipulative: devious, emotional, pushy, bullying"
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.MANIPULATIVE)}
            id={FeedbackOptions.MANIPULATIVE}
            onChange={updateFeedbackList}></Checkbox>
          <Checkbox
            label="Other"
            id={FeedbackOptions.OTHER_HARMFUL}
            defaultChecked={negativeFeedbackList.includes(FeedbackOptions.OTHER_HARMFUL)}
            onChange={updateFeedbackList}></Checkbox>
        </Stack>
      </>
    )
  }

  const handleDislikeDismiss = () => {
    appStateContext?.dispatch({ type: ActionType.SET_SHOW_FEEDBACK, payload: false })
  }

  const resetFeedbackDialog = () => {
    handleDislikeDismiss()
    setShowReportInappropriateFeedback(false)
    setNegativeFeedbackList([])
    setFeedbackMessage('')
  }

  const onSubmitNegativeFeedback = async () => {
    try {
      const negative_feedback_body: Feedback = {
        rating: FeedbackRating.NEGATIVE,
        sentiment: negativeFeedbackList,
        message: feedbackMessage
      }

      const response = await historyMessageFeedback(messageId, negative_feedback_body)

      if (response.ok) {
        appStateContext?.dispatch({
          type: ActionType.SET_MESSAGE_FEEDBACK,
          payload: { messageId: messageId, feedback: negative_feedback_body }
        })
      } else {
        console.error(`Failed to submit feedback. Resetting state to neutral. Status: ${response.status}`)
        appStateContext?.dispatch({
          type: ActionType.SET_MESSAGE_FEEDBACK,
          payload: { messageId: messageId, feedback: FeedbackBody.NEUTRAL }
        })
      }
    } catch (e) {
      console.error(e)
      appStateContext?.dispatch({
        type: ActionType.SET_MESSAGE_FEEDBACK,
        payload: { messageId: messageId, feedback: FeedbackBody.NEUTRAL }
      })
    }

    resetFeedbackDialog()
  }

  return (
    <Modal
      isOpen={appStateContext?.state.showFeedback}
      onDismiss={handleDislikeDismiss}
      styles={{
        main: {
          width: '513px'
        },
        scrollableContent: {}
      }}>
      <div className={styles.feedbackContainer}>
        <div className={styles.firstRow}>
          <Label style={{ font: 'Segoe UI', fontSize: '20px', fontWeight: '600' }}>Feedback & Bug Report</Label>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            className={styles.backbutton}
            style={{ color: '#424242' }}
            onClick={resetFeedbackDialog}
          />
        </div>
        <Stack tokens={{ childrenGap: 4 }}>
          {!showReportInappropriateFeedback ? (
            <>
              <UnhelpfulFeedbackContent />
              {negativeFeedbackList.includes(FeedbackOptions.OTHER_UNHELPFUL) && (
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
                onClick={() => {
                  setShowReportInappropriateFeedback(true)
                }}
                style={{ color: '#115EA3', cursor: 'pointer' }}>
                Report inappropriate content
              </div>
            </>
          ) : (
            <>
              <ReportInappropriateFeedbackContent />
              {negativeFeedbackList.includes(FeedbackOptions.OTHER_HARMFUL) && (
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
                onClick={() => {
                  setShowReportInappropriateFeedback(false)
                }}
                style={{ color: '#115EA3', cursor: 'pointer' }}>
                Report inaccurate content
              </div>
            </>
          )}

          <div>By pressing submit, your feedback will be visible to the application owner.</div>

          <DefaultButton
            disabled={
              negativeFeedbackList.length < 1 ||
              ((negativeFeedbackList.includes(FeedbackOptions.OTHER_UNHELPFUL) ||
                negativeFeedbackList.includes(FeedbackOptions.OTHER_HARMFUL)) &&
                feedbackMessage.length < 1)
            }
            onClick={onSubmitNegativeFeedback}>
            Submit
          </DefaultButton>
        </Stack>
      </div>
    </Modal>
  )
}
