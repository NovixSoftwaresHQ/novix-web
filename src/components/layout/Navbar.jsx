import { AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { enquiryLabel } from '../../data/companyData.js'
import { primaryNav } from '../../data/navigation.js'
import { currentIn } from '../../lib/navState.js'
import { useMascotBlocker } from '../mascot/MascotProvider.jsx'
import Button from '../ui/Button.jsx'
import HotBadge from '../ui/HotBadge.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import Logo from './Logo.jsx'
import MegaMenu from './MegaMenu.jsx'
import MobileDrawer from './MobileDrawer.jsx'

export default function Navbar() {
  const { pathname } = useLocation()
  const { openConsultation } = useConsultation()
  const [openMenu, setOpenMenu] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const nav = useRef(null)
  const drawerButton = useRef(null)
  useMascotBlocker('navigation', Boolean(openMenu) || drawerOpen)

  const closeMenu = () => setOpenMenu(null)
  const toggleButton = (label) => nav.current?.querySelector(`[data-menu-toggle="${label}"]`)

  useEffect(() => {
    closeMenu()
    setDrawerOpen(false)
  }, [pathname])

  // An open menu closes on Escape, which returns focus to its button, and on a click or tap anywhere else.
  useEffect(() => {
    if (!openMenu) return undefined
    const item = () => nav.current?.querySelector(`[data-menu="${openMenu}"]`)
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      const held = item()?.contains(document.activeElement) || document.activeElement === document.body
      closeMenu()
      if (held) toggleButton(openMenu)?.focus()
    }
    const onPointerDown = (event) => {
      if (!item()?.contains(event.target)) closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openMenu])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer if the viewport grows wider than a phone, so the scroll lock is released.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)') // Tailwind's `sm`
    const onChange = (event) => event.matches && setDrawerOpen(false)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Before opening the popup from a menu that is about to close, focus the button that opened that menu,
  // so that closing the popup has somewhere sensible to return to.
  const enquireFromMenu = (label) => {
    toggleButton(label)?.focus()
    closeMenu()
    openConsultation({ context: `${label} menu` })
  }
  const enquireFromDrawer = () => {
    drawerButton.current?.focus()
    setDrawerOpen(false)
    openConsultation({ context: 'Mobile menu' })
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
          scrolled || openMenu ? 'border-edge bg-page/90' : 'border-transparent bg-page/60'
        }`}
      >
        {/*
          Only phones (under 640px) get a menu button. Anything wider shows the links at the top: on their own
          row until everything fits on one row (the `wide` breakpoint).
        */}
        <div className="container-page flex flex-wrap items-center justify-between gap-x-3 wide:h-[72px] wide:flex-nowrap">
          <Logo animate />

          <nav
            ref={nav}
            aria-label="Primary"
            className="order-last hidden w-full border-t border-edge/70 sm:block wide:order-none wide:h-full wide:w-auto wide:border-t-0"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-0 py-0.5 md:max-lg:gap-x-1 wide:h-full wide:flex-nowrap wide:py-0">
              {primaryNav.map((item) => {
                const menuId = `menu-${item.label.toLowerCase()}`
                const expanded = openMenu === item.label
                const current = currentIn(pathname, item.to)
                return (
                  <li
                    key={item.to}
                    data-menu={item.menu ? item.label : undefined}
                    className="flex items-center wide:h-full"
                    onBlur={(event) => {
                      // Tabbing out of the menu closes it. Clicks are handled by the pointerdown listener.
                      if (expanded && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeMenu()
                    }}
                  >
                    <div className={`relative flex items-center rounded-control transition-colors hover:bg-raised ${expanded ? 'bg-raised' : ''}`}>
                      <Link
                        to={item.to}
                        aria-current={current}
                        onClick={closeMenu}
                        className={`flex h-11 items-center gap-1.5 rounded-control pl-1.5 text-sm font-medium transition-colors md:max-lg:pl-2.5 xl:pl-3.5 ${
                          item.menu ? 'pr-0.5' : 'pr-1.5 md:max-lg:pr-2.5 xl:pr-3.5'
                        } ${current ? 'text-primary' : 'text-heading'}`}
                      >
                        {item.label}
                        {item.badge && <HotBadge label={item.badge} />}
                      </Link>
                      {item.menu && (
                        <button
                          type="button"
                          data-menu-toggle={item.label}
                          aria-label={`${item.label} menu`}
                          aria-expanded={expanded}
                          aria-controls={menuId}
                          onClick={() => setOpenMenu(expanded ? null : item.label)}
                          className="grid h-11 w-6 place-items-center rounded-control text-body hover:text-heading md:max-lg:w-8 xl:w-8"
                        >
                          <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                      {/* The current section is underlined, not only coloured. */}
                      {current && <span aria-hidden="true" className="absolute inset-x-1.5 bottom-1.5 h-0.5 rounded-full bg-primary md:max-lg:inset-x-2.5 xl:inset-x-3.5" />}
                    </div>
                    <AnimatePresence>
                      {expanded && <MegaMenu id={menuId} item={item} onNavigate={closeMenu} onCta={() => enquireFromMenu(item.label)} />}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex h-[72px] shrink-0 items-center gap-2 sm:max-lg:h-16">
            <ThemeToggle />
            <Button size="sm" onClick={() => openConsultation({ context: 'Header button' })} arrow className="!hidden !h-11 sm:!inline-flex">
              {enquiryLabel}
            </Button>
            <button
              ref={drawerButton}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav"
              className="grid h-[44px] w-[44px] place-items-center rounded-control border border-edge text-heading sm:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onEnquire={enquireFromDrawer} />
    </>
  )
}
