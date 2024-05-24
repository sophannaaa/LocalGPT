export type AskResponse = {
  answer: string
  citations: Citation[]
  error?: string
  message_id?: string
  feedback?: Feedback
}

export type Citation = {
  part_index?: number
  content: string
  id: string
  title: string
  filepath: string | null
  url: string
  metadata: string | null
  chunk_id: string | null
  reindex_id: string | null
}

export type ToolMessageContent = {
  citations: Citation[]
  intent: string
}

export type ChatMessage = {
  id: string
  role: string
  content: string
  end_turn?: boolean
  date: string
  feedback?: Feedback
  context?: string
  user_name?: string
  user_email?: string
}

export type Conversation = {
  id: string
  title: string
  messages: ChatMessage[]
  date: string
}

export enum ChatCompletionType {
  CHAT_COMPLETION = 'chat.completion',
  CHAT_COMPLETION_CHUNK = 'chat.completion.chunk'
}

export type ChatResponseChoice = {
  messages: ChatMessage[]
}

export type ChatResponse = {
  id: string
  model: string
  created: number
  object: ChatCompletionType
  choices: ChatResponseChoice[]
  history_metadata: {
    conversation_id: string
    title: string
    date: string
  }
  error?: any
}

export type ConversationRequest = {
  messages: ChatMessage[]
}

export type UserInfo = {
  access_token: string
  expires_on: string
  id_token: string
  provider_name: string
  user_claims: any[]
  user_id: string
}

export type UserNameEmail = {
  user_name: string
  user_email: string
}

export enum CosmosDBStatus {
  NOT_CONFIGURED = 'CosmosDB is not configured',
  NOT_WORKING = 'CosmosDB is not working',
  INVALID_CREDENTIALS = 'CosmosDB has invalid credentials',
  INVALID_DATABASE = 'Invalid CosmosDB database name',
  INVALID_CONTAINER = 'Invalid CosmosDB container name',
  WORKING = 'CosmosDB is configured and working'
}

export type CosmosDBHealth = {
  cosmosDB: boolean
  status: string
}

export enum ChatHistoryLoadingState {
  LOADING = 'loading',
  SUCCESS = 'success',
  FAIL = 'fail',
  NOT_STARTED = 'notStarted'
}

export type ErrorMessage = {
  title: string
  subtitle: string
}

export enum FeedbackRating {
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
  NEGATIVE = 'negative'
}

export enum FeedbackOptions {
  MISSING_CITATION = 'missing_citation',
  WRONG_CITATION = 'wrong_citation',
  OUT_OF_SCOPE = 'out_of_scope',
  INACCURATE_OR_IRRELEVANT = 'inaccurate_or_irrelevant',
  OTHER_UNHELPFUL = 'other_unhelpful',
  HATE_SPEECH = 'hate_speech',
  VIOLENT = 'violent',
  SEXUAL = 'sexual',
  MANIPULATIVE = 'manipulative',
  OTHER_HARMFUL = 'other_harmful'
}

export type Feedback = {
  rating: FeedbackRating
  sentiment: FeedbackOptions[]
  message: string
}

export const FeedbackBody = {
  POSITIVE: {
    rating: FeedbackRating.POSITIVE,
    sentiment: [],
    message: ''
  },
  NEUTRAL: {
    rating: FeedbackRating.NEUTRAL,
    sentiment: [],
    message: ''
  }
}
