import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { initializeIcons } from '@fluentui/react'

import './index.css'

import Layout from './pages/layout/Layout'
import NoPage from './pages/NoPage'
import Chat from './pages/chat/Chat'
import PrivatePreview from './pages/PrivatePreview/PrivatePreview'
import Loading from './pages/Loading/Loading'
import { AppStateContext, AppStateProvider } from './state/AppProvider'

initializeIcons()

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAllowed, setIsAllowed] = useState<boolean>(false)


  const appStateContext = useContext(AppStateContext)

  useEffect(() => {
    if (appStateContext?.state.isUserInPrivatePreview) {
      setIsAllowed(true)
      setIsLoading(false)
    } else {
      setIsAllowed(false)
      setIsLoading(false)
    }


  }, [appStateContext?.state.isUserInPrivatePreview])

  if (isLoading) {
    return <Loading />
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {isAllowed ? (
            <Route index element={<Chat />} />
          ) : (
            <Route index element={<PrivatePreview />} />
          )}
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
