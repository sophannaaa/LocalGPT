import {
  UserInfo,
  ConversationRequest,
  Conversation,
  ChatMessage,
  CosmosDBHealth,
  CosmosDBStatus,
  Feedback,
  User
} from './models'

export async function conversationApi(options: ConversationRequest, abortSignal: AbortSignal): Promise<Response> {
  const response = await fetch('/conversation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages: options.messages
    }),
    signal: abortSignal
  })

  return response
}

export async function getUserInfo(): Promise<UserInfo[]> {
  try {
    const response = await fetch('/.auth/me')
    if (!response.ok) {
      throw new Error(`Authentication error! status: ${response.status}`)
    }
    const payload = await response.json()
    return payload
  } catch (error) {
    console.error(
      'A problem occurred when trying to authenticate the user. Default user profile will be used to provide limited access.',
      error
    )
    // In case of an error during authentication, we return a default user object which cannot access the Chat.
    return [
      {
        access_token: '',
        expires_on: '',
        id_token:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZW1haWwuY29tIiwibmFtZSI6IlVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ1c2VyQGVtYWlsLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.nlIqCQbVVnnxcSQqLE-gQHpTD7Feo1gfnKO1KAaTAfbrDmRIuv3F1CMgUAo3vZhLDrYmCzIwpLMY-CUpc7xLAQs2RuYdW2HsrTHe7wu2jg0MbrMvuTl4hHexUMezbXw-l40l8-1RjLhVKiQ4NtA8mDSCi2VxKAQL1lKXLgmOngVfbP02r6tiDo65HMz4EroGdo1D2Ax6uE5OdfJEfKY6NzpDz0DzLtxCqnadSzQF-9sgctXh8I2FP7kAtiOk_hpa0LEjKKqDdWLGn1FQMXX66REKRAN2lIhjec_4hGEd6J7RcKUl51BJhfxaOijFhg3Cov7ytWT3M7nb0EzaJfAq4g',
        provider_name: '',
        user_claims: [
          {
            typ: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
            val: 'sample_user_email_schema@email.com'
          },
          { typ: 'name', val: 'User' },
          { typ: 'preferred_username', val: 'sample_user_email_preferred@email.com' }
        ],
        user_id: ''
      }
    ]
  }
}

export async function defineUser(): Promise<User | null> {
  let user: User = {
    fullname: '',
    firstname: '',
    email: '',
    preferred_username: '',
    allowed_to_chat: false
  }

  try {
    const res = await getUserInfo()
    let id_token = res[0].id_token

    let fullName = res[0].user_claims?.find((e: { typ: string }) => e.typ === 'name')?.val || 'User'
    let firstName = fullName.split(' ')[0] || 'User'
    let email =
      res[0]?.user_claims?.find(
        (e: { typ: string }) => e.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      )?.val || 'user@email.com'
    let preferredUsername =
      res[0]?.user_claims?.find((e: { typ: string }) => e.typ === 'preferred_username')?.val || 'user@email.com'

    user.fullname = fullName
    user.firstname = firstName
    user.email = email
    user.preferred_username = preferredUsername

    // Call the /decode endpoint with the id_token
    const response = await fetch('/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user,
        token: id_token
      })
    })

    if (response.ok) {
      user.allowed_to_chat = true
    } else {
      console.error('Error decoding id_token. Cannot authorize user for chat.')
      user.allowed_to_chat = false
    }
  } catch (error) {
    console.error('An error occurred while defining the user:', error)
    // Handle error or return a default user object
  }

  return user
}

export const historyList = async (offset = 0): Promise<Conversation[] | null> => {
  const response = await fetch(`/history/list?offset=${offset}`, {
    method: 'GET'
  })
    .then(async res => {
      const payload = await res.json()
      if (!Array.isArray(payload)) {
        console.error('There was an issue fetching your data.')
        return null
      }
      const conversations: Conversation[] = await Promise.all(
        payload.map(async (conv: any) => {
          let convMessages: ChatMessage[] = []
          convMessages = await historyRead(conv.id)
            .then(res => {
              return res
            })
            .catch(err => {
              console.error('error fetching messages: ', err)
              return []
            })
          const conversation: Conversation = {
            id: conv.id,
            title: conv.title,
            date: conv.createdAt,
            messages: convMessages
          }
          return conversation
        })
      )
      return conversations
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      return null
    })

  return response
}

export const historyRead = async (convId: string): Promise<ChatMessage[]> => {
  const response = await fetch('/history/read', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: convId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(async res => {
      if (!res) {
        return []
      }
      const payload = await res.json()
      let messages: ChatMessage[] = []
      if (payload?.messages) {
        payload.messages.forEach((msg: any) => {
          const message: ChatMessage = {
            id: msg.id,
            role: msg.role,
            date: msg.createdAt,
            content: msg.content,
            feedback: msg.feedback ?? undefined
          }
          messages.push(message)
        })
      }
      return messages
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      return []
    })
  return response
}

export const historyGenerate = async (
  options: ConversationRequest,
  abortSignal: AbortSignal,
  convId?: string
): Promise<Response> => {
  let body
  if (convId) {
    body = JSON.stringify({
      conversation_id: convId,
      messages: options.messages
    })
  } else {
    body = JSON.stringify({
      messages: options.messages
    })
  }
  const response = await fetch('/history/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body,
    signal: abortSignal
  })
    .then(res => {
      return res
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      return new Response()
    })
  return response
}

export const historyUpdate = async (messages: ChatMessage[], convId: string): Promise<Response> => {
  const response = await fetch('/history/update', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: convId,
      messages: messages
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(async res => {
      return res
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      let errRes: Response = {
        ...new Response(),
        ok: false,
        status: 500
      }
      return errRes
    })
  return response
}

export const historyClear = async (convId: string): Promise<Response> => {
  const response = await fetch('/history/clear', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: convId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      return res
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      let errRes: Response = {
        ...new Response(),
        ok: false,
        status: 500
      }
      return errRes
    })
  return response
}

export const historyRename = async (convId: string, title: string): Promise<Response> => {
  const response = await fetch('/history/rename', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: convId,
      title: title
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      return res
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      let errRes: Response = {
        ...new Response(),
        ok: false,
        status: 500
      }
      return errRes
    })
  return response
}

export const historyEnsure = async (): Promise<CosmosDBHealth> => {
  const response = await fetch('/history/ensure', {
    method: 'GET'
  })
    .then(async res => {
      let respJson = await res.json()
      let formattedResponse
      if (respJson.message) {
        formattedResponse = CosmosDBStatus.WORKING
      } else {
        if (res.status === 500) {
          formattedResponse = CosmosDBStatus.NOT_WORKING
        } else if (res.status === 401) {
          formattedResponse = CosmosDBStatus.INVALID_CREDENTIALS
        } else if (res.status === 422) {
          formattedResponse = respJson.error
        } else {
          formattedResponse = CosmosDBStatus.NOT_CONFIGURED
        }
      }
      if (!res.ok) {
        return {
          cosmosDB: false,
          status: formattedResponse
        }
      } else {
        return {
          cosmosDB: true,
          status: formattedResponse
        }
      }
    })
    .catch(err => {
      console.error('There was an issue fetching your data.')
      return {
        cosmosDB: false,
        status: err
      }
    })
  return response
}

export const historyMessageFeedback = async (messageId: string, feedback: Feedback): Promise<Response> => {
  const response = await fetch('/history/message_feedback', {
    method: 'POST',
    body: JSON.stringify({
      message_id: messageId,
      message_feedback: feedback
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      return res
    })
    .catch(err => {
      console.error('There was an issue logging feedback.')
      let errRes: Response = {
        ...new Response(),
        ok: false,
        status: 500
      }
      return errRes
    })
  return response
}
