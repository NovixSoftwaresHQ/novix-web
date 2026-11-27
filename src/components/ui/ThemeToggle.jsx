import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  const Icon = isDark ? Moon : Sun
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative grid h-[44px] w-[44px] shrink-0 place-items-center overflow-hidden rounded-control border border-edge text-heading transition hover:border-primary/40 hover:text-primary ${className}`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
