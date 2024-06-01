import { Action, AppState, ActionType } from './AppProvider'

// Define the reducer function
export const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'UPDATE_CURRENT_CHAT':
      return { ...state, currentChat: action.payload }
    case 'UPDATE_CHAT_HISTORY_LOADING_STATE':
      return { ...state, chatHistoryLoadingState: action.payload }
    case 'UPDATE_CHAT_HISTORY':
      if (!state.chatHistory || !state.currentChat) {
        return state
      }
      let conversationIndex = state.chatHistory.findIndex(conv => conv.id === action.payload.id)
      if (conversationIndex !== -1) {
        let updatedChatHistory = [...state.chatHistory]
        updatedChatHistory[conversationIndex] = state.currentChat
        return { ...state, chatHistory: updatedChatHistory }
      } else {
        return { ...state, chatHistory: [...state.chatHistory, action.payload] }
      }
    case 'FETCH_CHAT_HISTORY':
      return { ...state, chatHistory: action.payload }
    case 'SET_COSMOSDB_STATUS':
      return { ...state, isCosmosDBAvailable: action.payload }
    case ActionType.SET_MESSAGE_FEEDBACK:
      return {
        ...state,
        messageIdFeedback: {
          ...state.messageIdFeedback,
          [action.payload.messageId]: action.payload.feedback
        }
      }
    case ActionType.REMOVE_MESSAGE_FEEDBACK:
      const { [action.payload]: _, ...newMessageIdFeedback } = state.messageIdFeedback
      return {
        ...state,
        messageIdFeedback: newMessageIdFeedback
      }
    case ActionType.SET_SHOW_FEEDBACK:
      return {
        ...state,
        showFeedback: action.payload
      }
    case ActionType.SET_CURRENT_MESSAGE_ID_FEEDBACK:
      return {
        ...state,
        currentMessageIdFeedback: action.payload
      }
    case ActionType.SET_USER:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }
}
