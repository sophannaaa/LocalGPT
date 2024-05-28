import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react'

import './index.css'

import Layout from './pages/layout/Layout'
import NoPage from './pages/NoPage'
import Chat from './pages/chat/Chat'
import PrivatePreview from '@pages/PrivatePreview/PrivatePreview'
import Loading from '@pages/Loading/Loading'
import { AppStateProvider, AppStateContext, ActionType } from './state/AppProvider'
import { defineUser } from '@api/api'
        
initializeIcons()

export default function App() {
  const appStateContext = useContext(AppStateContext)
  const [loading, setLoading] = useState(true)
  let user = appStateContext?.state.user

  let ScreenComponent

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading || !user) {
    ScreenComponent = Loading
  } else if (user.allowed_to_chat) {
    ScreenComponent = Chat
  } else {
    ScreenComponent = PrivatePreview
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ScreenComponent />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>
)
