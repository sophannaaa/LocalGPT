import { useEffect, useMemo, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import { FontIcon, Stack, Text } from '@fluentui/react'
import DOMPurify from 'dompurify'
import { FeedbackButton } from '@components/AnswerFeedback/FeedbackButton'

import styles from './Answer.module.css'
import GPT_AVATAR from '@assets/GPTAvatar.svg'

import { AskResponse, Citation } from '@api/index'
import { parseAnswer } from './AnswerParser'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import supersub from 'remark-supersub'
import { XSSAllowTags } from '@constants/xssAllowTags'

interface Props {
  answer: AskResponse
  onCitationClicked: (citedDocument: Citation) => void
  isAnswerGenerating: boolean
}

export const Answer = ({ answer, onCitationClicked, isAnswerGenerating }: Props) => {
  const [isRefAccordionOpen, { toggle: toggleIsRefAccordionOpen }] = useBoolean(false)
  const filePathTruncationLimit = 50

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

  const createCitationFilepath = (citation: Citation, index: number, truncate: boolean = false) => {
    let citationFilename = ''

    if (citation.filepath) {
      const part_i = citation.part_index ?? (citation.chunk_id ? parseInt(citation.chunk_id) + 1 : '')
      if (truncate && citation.filepath.length > filePathTruncationLimit) {
        const citationLength = citation.filepath.length
        citationFilename = `${citation.filepath.substring(0, 20)}...${citation.filepath.substring(citationLength - 20)} - Part ${part_i}`
      } else {
        citationFilename = `${citation.filepath} - Part ${part_i}`
      }
    } else if (citation.filepath && citation.reindex_id) {
      citationFilename = `${citation.filepath} - Part ${citation.reindex_id}`
    } else {
      citationFilename = `Citation ${index}`
    }
    return citationFilename
  }

  return (
    <>
      <div className={styles.copilotAvatar}>
        <img src={GPT_AVATAR} style={{ width: '32px', height: '32px' }} />
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
          {!!parsedAnswer.citations.length && (
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
                      {parsedAnswer.citations.length > 1
                        ? parsedAnswer.citations.length + ' references'
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
          <div style={{ marginTop: 8, display: 'flex', flexFlow: 'wrap column', maxHeight: '150px', gap: '4px' }}>
            {parsedAnswer.citations.map((citation, idx) => {
              return (
                <span
                  title={createCitationFilepath(citation, ++idx)}
                  tabIndex={0}
                  role="link"
                  key={idx}
                  onClick={() => onCitationClicked(citation)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? onCitationClicked(citation) : null)}
                  className={styles.citationContainer}
                  aria-label={createCitationFilepath(citation, idx)}>
                  <div className={styles.citation}>{idx}</div>
                  {createCitationFilepath(citation, idx, true)}
                </span>
              )
            })}
          </div>
        )}
        <Stack className={styles.feedback}>
          {!isAnswerGenerating && <FeedbackButton messageId={answer.message_id!} />}
        </Stack>
      </Stack>
    </>
  )
}
