/**
 * Compact geometric "N" symbol. With `animate`, the N is drawn once (about 600ms) when it first
 * appears; reduced-motion visitors and visitors without JavaScript see the finished mark.
 */
export default function BrandMark({ animate = false, className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" strokeWidth="1" className="fill-action stroke-action-edge" />
      <path
        d="M10 23V9l12 14V9"
        pathLength="1"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`stroke-on-action ${animate ? 'brand-stroke' : ''}`}
      />
    </svg>
  )
}
