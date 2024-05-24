import React, { createContext, useReducer, ReactNode, useEffect } from 'react'
import { appStateReducer } from './AppReducer'
import {
  Conversation,
  ChatHistoryLoadingState,
  CosmosDBHealth,
  historyList,
  historyEnsure,
  CosmosDBStatus,
  Feedback,
  FeedbackRating,
  UserNameEmail,
  getUserInfo
} from '@api/index'
import { ALLOWED_EMAILS } from '@constants/allowedEmails'

export interface AppState {
  isChatHistoryOpen: boolean
  chatHistoryLoadingState: ChatHistoryLoadingState
  isCosmosDBAvailable: CosmosDBHealth
  chatHistory: Conversation[] | null
  filteredChatHistory: Conversation[] | null
  currentChat: Conversation | null
  feedbackState: { [answerId: string]: FeedbackRating }
  messageIdFeedback: { [messageId: string]: Feedback }
  showFeedback: boolean
  currentMessageIdFeedback: string
  userNameEmail: UserNameEmail
  isUserInPrivatePreview: boolean
}

export enum ActionType {
  TOGGLE_CHAT_HISTORY = 'TOGGLE_CHAT_HISTORY',
  SET_COSMOSDB_STATUS = 'SET_COSMOSDB_STATUS',
  UPDATE_CHAT_HISTORY_LOADING_STATE = 'UPDATE_CHAT_HISTORY_LOADING_STATE',
  UPDATE_CURRENT_CHAT = 'UPDATE_CURRENT_CHAT',
  UPDATE_FILTERED_CHAT_HISTORY = 'UPDATE_FILTERED_CHAT_HISTORY',
  UPDATE_CHAT_HISTORY = 'UPDATE_CHAT_HISTORY',
  UPDATE_CHAT_TITLE = 'UPDATE_CHAT_TITLE',
  DELETE_CHAT_ENTRY = 'DELETE_CHAT_ENTRY',
  DELETE_CHAT_HISTORY = 'DELETE_CHAT_HISTORY',
  DELETE_CURRENT_CHAT_MESSAGES = 'DELETE_CURRENT_CHAT_MESSAGES',
  FETCH_CHAT_HISTORY = 'FETCH_CHAT_HISTORY',
  SET_FEEDBACK_STATE = 'SET_FEEDBACK_STATE',
  GET_FEEDBACK_STATE = 'GET_FEEDBACK_STATE',
  SET_MESSAGE_FEEDBACK = 'SET_MESSAGE_FEEDBACK',
  REMOVE_MESSAGE_FEEDBACK = 'REMOVE_MESSAGE_FEEDBACK',
  SET_MESSAGE_FEEDBACK_ERROR = 'SET_MESSAGE_FEEDBACK_ERROR',
  SET_SHOW_FEEDBACK = 'SET_SHOW_FEEDBACK',
  SET_CURRENT_MESSAGE_ID_FEEDBACK = 'SET_CURRENT_MESSAGE_ID_FEEDBACK',
  SET_USER_NAME_EMAIL = 'SET_USER_NAME_EMAIL',
  SET_USER_IN_PRIVATE_PREVIEW = 'SET_USER_IN_PRIVATE_PREVIEW'
}

export type Action =
  | { type: 'TOGGLE_CHAT_HISTORY' }
  | { type: 'SET_COSMOSDB_STATUS'; payload: CosmosDBHealth }
  | { type: 'UPDATE_CHAT_HISTORY_LOADING_STATE'; payload: ChatHistoryLoadingState }
  | { type: 'UPDATE_CURRENT_CHAT'; payload: Conversation | null }
  | { type: 'UPDATE_FILTERED_CHAT_HISTORY'; payload: Conversation[] | null }
  | { type: 'UPDATE_CHAT_HISTORY'; payload: Conversation } // API Call
  | { type: 'UPDATE_CHAT_TITLE'; payload: Conversation } // API Call
  | { type: 'DELETE_CHAT_ENTRY'; payload: string } // API Call
  | { type: 'DELETE_CHAT_HISTORY' } // API Call
  | { type: 'DELETE_CURRENT_CHAT_MESSAGES'; payload: string } // API Call
  | { type: 'FETCH_CHAT_HISTORY'; payload: Conversation[] | null } // API Call
  | { type: 'SET_FEEDBACK_STATE'; payload: { answerId: string; feedback: FeedbackRating } }
  | { type: 'GET_FEEDBACK_STATE'; payload: string }
  | { type: ActionType.SET_MESSAGE_FEEDBACK; payload: { messageId: string; feedback: Feedback } }
  | { type: ActionType.REMOVE_MESSAGE_FEEDBACK; payload: string }
  | { type: ActionType.SET_SHOW_FEEDBACK; payload: boolean }
  | { type: ActionType.SET_CURRENT_MESSAGE_ID_FEEDBACK; payload: string }
  | { type: ActionType.SET_USER_NAME_EMAIL; payload: UserNameEmail }
  | { type: ActionType.SET_USER_IN_PRIVATE_PREVIEW; payload: boolean }

const initialState: AppState = {
  isChatHistoryOpen: false,
  chatHistoryLoadingState: ChatHistoryLoadingState.LOADING,
  chatHistory: null,
  filteredChatHistory: null,
  currentChat: null,
  isCosmosDBAvailable: {
    cosmosDB: false,
    status: CosmosDBStatus.NOT_CONFIGURED
  },
  feedbackState: {},
  messageIdFeedback: {},
  showFeedback: false,
  currentMessageIdFeedback: '',
  userNameEmail: { user_name: 'dummy', user_email: 'dummy' },
  isUserInPrivatePreview: false
}

export const AppStateContext = createContext<
  | {
    state: AppState
    dispatch: React.Dispatch<Action>
  }
  | undefined
>(undefined)

type AppStateProviderProps = {
  children: ReactNode
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState)

  useEffect(() => {
    // authenticate user
    getUserInfo().then(response => {
      const user_email = response[0]?.user_claims?.find((e: { typ: string }) => e.typ === 'preferred_username')?.val
      const fullName = response[0]?.user_claims?.find((e: { typ: string }) => e.typ === 'name')?.val
      const firstName = fullName.split(' ')[0]

      const userNameEmail: UserNameEmail = { user_name: firstName, user_email: user_email }

      dispatch({ type: ActionType.SET_USER_NAME_EMAIL, payload: userNameEmail })

      if (ALLOWED_EMAILS.has(user_email))
        dispatch({ type: ActionType.SET_USER_IN_PRIVATE_PREVIEW, payload: true })
      else
        dispatch({ type: ActionType.SET_USER_IN_PRIVATE_PREVIEW, payload: false })
    })


    // Check for cosmosdb config and fetch initial data here
    const fetchChatHistory = async (offset = 0): Promise<Conversation[] | null> => {
      const result = await historyList(offset)
        .then(response => {
          if (response) {
            dispatch({ type: 'FETCH_CHAT_HISTORY', payload: response })
          } else {
            dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null })
          }
          return response
        })
        .catch(err => {
          dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.FAIL })
          dispatch({ type: 'FETCH_CHAT_HISTORY', payload: null })
          console.error('There was an issue fetching your data.')
          return null
        })
      return result
    }

    const getHistoryEnsure = async () => {
      dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.LOADING })
      historyEnsure()
        .then(response => {
          if (response?.cosmosDB) {
            fetchChatHistory()
              .then(res => {
                if (res) {
                  dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.SUCCESS })
                  dispatch({ type: 'SET_COSMOSDB_STATUS', payload: response })
                } else {
                  dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.FAIL })
                  dispatch({
                    type: 'SET_COSMOSDB_STATUS',
                    payload: { cosmosDB: false, status: CosmosDBStatus.NOT_WORKING }
                  })
                }
              })
              .catch(err => {
                dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.FAIL })
                dispatch({
                  type: 'SET_COSMOSDB_STATUS',
                  payload: { cosmosDB: false, status: CosmosDBStatus.NOT_WORKING }
                })
              })
          } else {
            dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.FAIL })
            dispatch({ type: 'SET_COSMOSDB_STATUS', payload: response })
          }
        })
        .catch(err => {
          dispatch({ type: 'UPDATE_CHAT_HISTORY_LOADING_STATE', payload: ChatHistoryLoadingState.FAIL })
          dispatch({ type: 'SET_COSMOSDB_STATUS', payload: { cosmosDB: false, status: CosmosDBStatus.NOT_CONFIGURED } })
        })
    }
    getHistoryEnsure()
  }, [])

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}
