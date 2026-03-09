import { useEffect, useState, useCallback, useRef } from 'react'

const STORAGE_KEY = 'fire-calc-theme-override'
const POLL_INTERVAL = 1000

function osPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return osPrefersDark()
}

function hasManualOverride(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'dark' || stored === 'light'
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialDark)
  const [isManual, setIsManual] = useState(hasManualOverride)
  const lastOsPref = useRef(typeof window !== 'undefined' ? osPrefersDark() : false)

  // Clean up stale key from old implementation
  useEffect(() => {
    localStorage.removeItem('theme')
  }, [])

  // Apply .dark class to <html>
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  // Persist manual overrides only
  useEffect(() => {
    if (isManual) {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [isDark, isManual])

  // Track OS preference changes via both event listener AND polling fallback.
  // Some Linux DEs (GNOME/KDE) don't reliably fire the matchMedia change event.
  useEffect(() => {
    if (isManual) return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    // Event-based listener
    const handler = (e: MediaQueryListEvent) => {
      lastOsPref.current = e.matches
      setIsDark(e.matches)
    }
    mq.addEventListener('change', handler)

    // Polling fallback for environments where the event doesn't fire
    const interval = setInterval(() => {
      const current = osPrefersDark()
      if (current !== lastOsPref.current) {
        lastOsPref.current = current
        setIsDark(current)
      }
    }, POLL_INTERVAL)

    return () => {
      mq.removeEventListener('change', handler)
      clearInterval(interval)
    }
  }, [isManual])

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      // If toggling back to OS preference, clear the override
      if (next === osPrefersDark()) {
        setIsManual(false)
      } else {
        setIsManual(true)
      }
      return next
    })
  }, [])

  return { isDark, toggle }
}
