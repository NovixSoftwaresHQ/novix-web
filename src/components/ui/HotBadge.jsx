import { Flame } from 'lucide-react'

/** The "Hot" tag on a menu item. It glows a few times when the page loads, then rests (see .hot-badge). */
export default function HotBadge({ label }) {
  return (
    <span className="hot-badge">
      <Flame aria-hidden="true" className="h-3 w-3" />
      {label}
    </span>
  )
}
