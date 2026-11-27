import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MascotProvider } from '../mascot/MascotProvider.jsx'
import SiteRobot from '../mascot/SiteRobot.jsx'
import ConsultationModal from './ConsultationModal.jsx'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

function RouteEffects() {
  const { pathname, hash } = useLocation()
  const firstPath = useRef(pathname)
  const navigated = useRef(false)
  useEffect(() => {
    if (pathname !== firstPath.current) {
      navigated.current = true
    }
    if (!hash) {
      // On first load the browser (or the visitor) already controls the scroll position.
      if (navigated.current) window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }
    const id = decodeURIComponent(hash.slice(1))
    let attempts = 0
    let timer
    const scroll = () => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView()
      else if (attempts++ < 20) timer = setTimeout(scroll, 100)
    }
    scroll()
    return () => clearTimeout(timer)
  }, [pathname, hash])
  return null
}

export default function SiteLayout() {
  return (
    <MascotProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-control focus:bg-action focus:px-4 focus:py-2 focus:text-on-action">
        Skip to content
      </a>
      <SiteRobot />
      <RouteEffects />
      <Navbar />
      <main id="main">
        <Suspense fallback={<div role="status" className="grid min-h-[70vh] place-items-center text-sm">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ConsultationModal />
    </MascotProvider>
  )
}
