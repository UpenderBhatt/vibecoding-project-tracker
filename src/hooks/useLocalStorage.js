import { useEffect, useState } from 'react'

// useState that is saved to localStorage and reloaded on page open.
// `initialValue` can be a value or a function returning one (used when nothing is saved yet).
// `parse` lets callers clean up whatever was loaded.
export function useLocalStorage(key, initialValue, parse = (v) => v) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) return parse(JSON.parse(saved))
    } catch (err) {
      console.warn(`Could not read "${key}" from localStorage, starting fresh.`, err)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Could not save "${key}" to localStorage.`, err)
    }
  }, [key, value])

  return [value, setValue]
}
