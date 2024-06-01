import { useEffect, useMemo, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import { FontIcon, Stack, Text } from '@fluentui/react'
import DOMPurify from 'dompurify'
import { FeedbackButton } from '@components/AnswerFeedback/FeedbackButton'

import styles from './Answer.module.css'
import GPT_AVATAR from '@assets/MR-GPTAvatar.svg'

import { AskResponse, Citation } from '@api/index'
import { parseAnswer } from './AnswerParser'
import ReferenceButton from './ReferenceButton'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import { XSSAllowTags } from '@constants/xssAllowTags'

interface Props {
  answer: AskResponse
}

export const Answer = ({ answer }: Props) => {
  const [isRefAccordionOpen, { toggle: toggleIsRefAccordionOpen }] = useBoolean(false)

  const parsedAnswer = useMemo(() => parseAnswer(answer), [answer])
  const [chevronIsExpanded, setChevronIsExpanded] = useState(isRefAccordionOpen)
  const SANITIZE_ANSWER = false

  const handleChevronClick = () => {
    setChevronIsExpanded(!chevronIsExpanded)
    toggleIsRefAccordionOpen()
  }

  useEffect(() => {
    setChevronIsExpanded(isRefAccordionOpen)
  }, [isRefAccordionOpen])

  return (
    <>
      <div className={styles.copilotAvatar}>
        <img
          src={GPT_AVATAR}
          style={{ width: '32px', height: '32px', border: '2px solid rgb(116 116 116)', borderRadius: '16px' }}
        />
      </div>
      <Stack className={styles.answerContainer} tabIndex={0}>
        <Stack.Item>
          <Stack horizontal grow>
            <Stack.Item grow>
              <ReactMarkdown
                linkTarget="_blank"
                remarkPlugins={[remarkGfm, supersub]}
                children={
                  SANITIZE_ANSWER
                    ? DOMPurify.sanitize(parsedAnswer.markdownFormatText, { ALLOWED_TAGS: XSSAllowTags })
                    : parsedAnswer.markdownFormatText
                }
                className={styles.answerText}
              />
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack horizontal className={styles.answerFooter}>
          {!!Object.keys(parsedAnswer.citations).length && (
            <Stack.Item onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? toggleIsRefAccordionOpen() : null)}>
              <Stack style={{ width: '100%' }}>
                <Stack horizontal horizontalAlign="start" verticalAlign="center">
                  <Text
                    className={styles.accordionTitle}
                    onClick={toggleIsRefAccordionOpen}
                    aria-label="Open references"
                    tabIndex={0}
                    role="button">
                    <span>
                      {Object.keys(parsedAnswer.citations).length > 1
                        ? Object.keys(parsedAnswer.citations).length + ' references'
                        : '1 reference'}
                    </span>
                  </Text>
                  <FontIcon
                    className={styles.accordionIcon}
                    onClick={handleChevronClick}
                    iconName={chevronIsExpanded ? 'ChevronDown' : 'ChevronRight'}
                  />
                </Stack>
              </Stack>
            </Stack.Item>
          )}
          <Stack.Item className={styles.answerDisclaimerContainer}>
            <span className={styles.answerDisclaimer}>
              The information provided was AI-generated and may include mistakes or inaccuracies.
            </span>
          </Stack.Item>
        </Stack>
        {chevronIsExpanded && (
          <div style={{ marginTop: 8, display: 'flex', flexFlow: 'wrap column', gap: '4px' }}>
            {Object.entries(parsedAnswer.citations).map(([url, citationsContainer]) => {
              const referenceNumber = citationsContainer.referenceNumber
              const citation = citationsContainer.citations[0]
              return (
                <ReferenceButton key={citation.id} citation={citation} referenceNumber={referenceNumber} />
              )
            })}
          </div>
        )}
        <Stack className={styles.feedback}>
          <FeedbackButton messageId={answer.message_id!} />
        </Stack>
      </Stack>
    </>
  )
}
