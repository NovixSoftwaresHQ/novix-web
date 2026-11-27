import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const variants = {
  primary:
    'border border-action-edge bg-action text-on-action hover:border-action-edge-hover hover:bg-action-hover focus-visible:border-action-edge-hover focus-visible:bg-action-hover disabled:hover:border-action-edge disabled:hover:bg-action',
  secondary:
    'border border-edge bg-surface text-heading hover:border-edge-hover hover:text-primary focus-visible:border-primary focus-visible:text-primary disabled:hover:border-edge disabled:hover:text-heading',
  ghost: 'text-primary hover:text-primary-hover focus-visible:text-primary-hover',
}

// Minimum heights, so that a long label (or large browser text) can wrap on a narrow screen instead of overflowing.
const sizes = {
  sm: 'min-h-9 px-4 py-1.5 text-sm',
  md: 'min-h-11 px-5 py-2 text-sm',
  lg: 'min-h-12 px-6 py-2.5 text-[15px]',
}

/** Renders a router <Link> (`to`), an anchor (`href`) or a <button>. `arrow` adds the sliding → on hover. */
export default function Button({ to, href, variant = 'primary', size = 'md', arrow = false, className = '', children, ...props }) {
  const classes = `group inline-flex items-center justify-center gap-2 text-center sm:whitespace-nowrap rounded-control font-semibold transition duration-200 active:scale-[0.98] motion-reduce:active:scale-100 disabled:cursor-wait disabled:opacity-70 ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {children}
      {arrow && <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />}
    </>
  )
  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>
  if (href) {
    const external = href.startsWith('http')
    return (
      <a href={href} className={classes} {...(external && { target: '_blank', rel: 'noreferrer' })} {...props}>
        {content}
      </a>
    )
  }
  return <button type="button" className={classes} {...props}>{content}</button>
}
