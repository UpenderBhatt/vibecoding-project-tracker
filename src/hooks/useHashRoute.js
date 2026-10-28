import { useEffect, useState } from 'react'

// Tiny router: '#/login', '#/signup' and '#/' (the board).
// Using the URL hash means each page has its own address and the back button works.
function currentRoute() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export function navigate(route) {
  if (currentRoute() !== route) window.location.hash = route
}

export function useHashRoute() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onChange = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
