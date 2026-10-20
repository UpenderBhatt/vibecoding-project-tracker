import { useEffect, useState } from 'react'

// The current time, refreshed every minute, so due-date colours
// update on their own while the board is open (M8: "user does nothing").
export function useNow(intervalMs = 60 * 1000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
