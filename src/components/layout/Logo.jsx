import { Link } from 'react-router-dom'
import { company } from '../../data/companyData.js'
import BrandMark from '../brand/BrandMark.jsx'

/** Full brand link: symbol plus wordmark. Only the header passes `animate`. */
export default function Logo({ onClick, animate = false }) {
  return (
    <Link to="/" onClick={onClick} className="flex min-w-0 items-center gap-2.5 py-2" aria-label={`${company.name} home`}>
      <BrandMark animate={animate} className="h-[32px] w-[32px] shrink-0" />
      {/* Capped on narrow screens, and free to wrap, so that large browser text cannot push the header apart. */}
      <span className="min-w-0 text-[length:min(1.125rem,5.2vw)] font-semibold leading-tight tracking-tight text-heading sm:whitespace-nowrap">{company.name}</span>
    </Link>
  )
}
