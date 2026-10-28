import { useCallback, useEffect, useState } from 'react'
import { getCurrentUser, logOut } from './api/client.js'
import AuthPage from './components/AuthPage.jsx'
import BoardPage from './components/BoardPage.jsx'
import Toast from './components/Toast.jsx'
import { navigate, useHashRoute } from './hooks/useHashRoute.js'

export default function App() {
  const route = useHashRoute()
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  // NFR8 / NFR9: one toast at a time, for successes and errors
  const [toast, setToast] = useState(null)
  const notify = useCallback((message, tone = 'success') => setToast({ id: Date.now(), message, tone }), [])
  const clearToast = useCallback(() => setToast(null), [])

  // Stay logged in across refreshes (NFR5)
  useEffect(() => {
    getCurrentUser().then((current) => {
      setUser(current)
      setCheckingSession(false)
    })
  }, [])

  // Send people to the right page for whether they're logged in
  useEffect(() => {
    if (checkingSession) return
    if (!user && route !== '/login' && route !== '/signup') navigate('/login')
    if (user && route !== '/') navigate('/')
  }, [user, route, checkingSession])

  function handleAuthenticated(newUser, isNewAccount) {
    setUser(newUser)
    navigate('/')
    notify(isNewAccount ? `Welcome to Vibe Board, ${newUser.name}.` : `Welcome back, ${newUser.name}.`)
  }

  // FR28: log out and go back to the login page
  async function handleLogOut() {
    await logOut().catch(() => {})
    setUser(null)
    navigate('/login')
    notify("You're logged out.")
  }

  // The session ran out or was removed while the board was open
  const handleSessionExpired = useCallback(() => {
    setUser(null)
    navigate('/login')
    notify('Your session ended. Log in again to keep going.', 'error')
  }, [notify])

  let page = null
  if (!checkingSession) {
    page = user ? (
      <BoardPage
        key={user.id}
        user={user}
        notify={notify}
        onLogOut={handleLogOut}
        onSessionExpired={handleSessionExpired}
      />
    ) : (
      <AuthPage mode={route === '/signup' ? 'signup' : 'login'} onAuthenticated={handleAuthenticated} />
    )
  }

  return (
    <>
      {page}

      {/* Screen readers announce whatever appears here */}
      <div role="status" aria-live="polite">
        {toast && <Toast key={toast.id} message={toast.message} tone={toast.tone} onDone={clearToast} />}
      </div>
    </>
  )
}
