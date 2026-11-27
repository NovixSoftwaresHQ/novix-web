import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'

// Keep in sync with the pre-paint script in index.html.
const STORAGE_KEY = 'novix-theme'
const ThemeContext = createContext(null)

function readSaved() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null // storage can be blocked (private mode, site settings)
  }
}

// The <html> class is the source of truth: the pre-paint script sets it before React loads.
const listeners = new Set()
const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
// Prerendered HTML is always "light"; React switches to the real value right after hydration.
const getServerSnapshot = () => 'light'

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  // keep in sync with --page in index.css
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121212' : '#F7F5F0')
  listeners.forEach((listener) => listener())
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Follow the OS setting until the visitor picks a theme explicitly.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => !readSaved() && applyTheme(query.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = getSnapshot() === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* the toggle still works for this visit */
    }
    applyTheme(next)
  }, [])

  const value = useMemo(() => ({ theme, isDark: theme === 'dark', toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
