import { Stack } from '@fluentui/react'
import styles from './Answer.module.css'
import GPT_AVATAR from '@assets/GPTAvatar.svg'
import loading from '@assets/loading.gif'

export const AnswerLoading = () => {
  return (
    <>
      <img src={GPT_AVATAR} style={{ width: '32px', height: '32px' }} />
      <Stack className={styles.answerLoadingContainer} verticalAlign="space-between">
        <Stack.Item grow className={styles.answerLoadingWrapper}>
          <img src={loading} style={{ width: '32px', height: '32px' }} />
        </Stack.Item>
      </Stack>
    </>
  )
}
