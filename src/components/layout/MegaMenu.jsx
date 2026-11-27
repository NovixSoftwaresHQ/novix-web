import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { enquiryLabel } from '../../data/companyData.js'
import Button from '../ui/Button.jsx'
import { EASE } from '../ui/MotionWrapper.jsx'

// A picture of the film, loaded only when the menu is open, that takes the visitor to it.
function MenuVideo({ video, onNavigate }) {
  return (
    <Link to={video.to} onClick={onNavigate} className="group block self-start overflow-hidden rounded-card border border-edge transition-colors hover:border-primary/60">
      <span className="relative block overflow-hidden">
        <img src={video.thumb} alt="" width="480" height="206" className="block aspect-[480/206] w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none" />
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white transition-transform group-hover:scale-110 motion-reduce:transform-none">
            <Play className="h-4 w-4 translate-x-px fill-current" />
          </span>
        </span>
      </span>
      <span className="block p-3">
        <span className="block text-sm font-semibold leading-snug text-heading">{video.title}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          {video.text}
          <ArrowRight aria-hidden="true" className="nudge h-3.5 w-3.5" />
        </span>
      </span>
    </Link>
  )
}

export default function MegaMenu({ id, item, onNavigate, onCta }) {
  // Fewer columns on narrower screens; five or four from the sizes where they fit.
  const columns = item.menu.length === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 md:grid-cols-4' // four groups, or three and a video
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: EASE }}
      // Only the panel takes clicks, so a click in the empty space beside it closes the menu.
      className="pointer-events-none absolute inset-x-0 top-full px-4 pt-2"
    >
      <div className="pointer-events-auto mx-auto max-h-[calc(100vh-8.5rem)] max-w-page overflow-y-auto overscroll-contain rounded-card border border-edge bg-surface shadow-lift wide:max-h-[calc(100vh-6rem)]">
        <div className={`grid gap-x-3 gap-y-6 p-5 xl:gap-x-6 xl:p-7 ${columns}`}>
          {item.menu.map((group) => (
            <div key={group.title}>
              <p className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-heading">
                <group.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                {group.title}
              </p>
              <ul className="mt-3 space-y-0.5">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `group flex items-center justify-between gap-1 rounded-control px-2 py-1.5 text-[13px] leading-5 transition hover:bg-raised hover:text-heading ${isActive ? 'font-semibold text-primary ' : ''}`
                      }
                    >
                      {link.label}
                      <ArrowRight aria-hidden="true" className="nudge h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {item.video && <MenuVideo video={item.video} onNavigate={onNavigate} />}
        </div>
        {/* Pinned to the bottom of the panel, so "All services/products" shows even when the list scrolls. */}
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-edge bg-subtle px-5 py-4 xl:px-7">
          <p className="text-sm">{item.footer.text}</p>
          <div className="flex shrink-0 items-center gap-3">
            <Button to={item.to} onClick={onNavigate} variant="secondary" size="sm" arrow>{item.footer.overview}</Button>
            <Button size="sm" onClick={onCta}>{enquiryLabel}</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
