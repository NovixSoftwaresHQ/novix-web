import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown, Play, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { enquiryLabel } from '../../data/companyData.js'
import { primaryNav } from '../../data/navigation.js'
import { useDialog } from '../../hooks/useDialog.js'
import { currentIn } from '../../lib/navState.js'
import Button from '../ui/Button.jsx'
import HotBadge from '../ui/HotBadge.jsx'
import { EASE } from '../ui/MotionWrapper.jsx'
import Logo from './Logo.jsx'

const items = [{ label: 'Home', to: '/' }, ...primaryNav]

// The current section has a bar beside it as well as the accent colour.
const rowLink = (current) =>
  `flex min-h-11 flex-1 items-center border-l-2 pl-3 text-base font-semibold transition-colors ${
    current ? 'border-primary text-primary' : 'border-transparent text-heading hover:text-primary'
  }`
const subLink = (current) =>
  `block rounded-control px-2 py-2.5 text-sm transition-colors hover:bg-raised ${current ? 'font-semibold text-primary underline underline-offset-4' : 'hover:text-heading'}`

function DrawerBody({ onClose, onEnquire }) {
  const ref = useDialog(true, onClose)
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(null) // only one nested menu open at a time
  const still = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.28, ease: EASE }}
      className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col border-l border-edge bg-surface"
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-edge px-5">
        <Logo onClick={onClose} />
        <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 shrink-0 place-items-center rounded-control text-heading transition-colors hover:bg-raised">
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-4 py-2">
        <ul>
          {items.map((item) => {
            const current = currentIn(pathname, item.to)
            const open = expanded === item.label
            const panelId = `drawer-${item.label.toLowerCase()}`
            return (
              <li key={item.to}>
                <div className="flex items-center gap-1">
                  <Link to={item.to} onClick={onClose} aria-current={current} className={`${rowLink(current)} gap-2`}>
                    {item.label}
                    {item.badge && <HotBadge label={item.badge} />}
                  </Link>
                  {item.menu && (
                    <button
                      type="button"
                      aria-label={`${item.label} menu`}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setExpanded(open ? null : item.label)}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-edge text-heading"
                    >
                      <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
                {item.menu && (
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: still ? 0 : 0.25, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="mb-2 ml-3 border-l border-edge pl-3">
                          <Link to={item.to} onClick={onClose} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold text-primary">
                            {item.footer.overview}
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                          </Link>
                          {item.video && (
                            <Link to={item.video.to} onClick={onClose} className="mb-1 flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-heading">
                              <Play aria-hidden="true" className="h-4 w-4 fill-current text-primary" />
                              {item.video.title}
                            </Link>
                          )}
                          {item.menu.map((group) => (
                            <div key={group.title} className="pt-2">
                              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-heading">{group.title}</p>
                              <ul>
                                {group.links.map((link) => {
                                  const here = pathname === link.to ? 'page' : undefined
                                  return (
                                    <li key={link.to}>
                                      <Link to={link.to} onClick={onClose} aria-current={here} className={subLink(here)}>{link.label}</Link>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="shrink-0 border-t border-edge p-5">
        <Button onClick={onEnquire} arrow className="w-full">{enquiryLabel}</Button>
      </div>
    </motion.div>
  )
}

export default function MobileDrawer({ open, onClose, onEnquire }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/70"
          />
          <DrawerBody onClose={onClose} onEnquire={onEnquire} />
        </div>
      )}
    </AnimatePresence>
  )
}
