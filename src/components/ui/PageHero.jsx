import Breadcrumbs from '../detail/Breadcrumbs.jsx'

/** Grid-and-glow backdrop with breadcrumbs, shared by the non-template pages. */
/** `compact` trims the bottom padding where the content is short. */
export default function PageHero({ crumbs, children, className = '', compact = false }) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-lines opacity-70 bg-grid [mask-image:linear-gradient(#000_40%,transparent)]" />
        <div className="absolute -top-32 left-[30%] h-80 w-[34rem] max-w-full rounded-full accent-glow blur-[120px]" />
      </div>
      <div className={`container-page pt-10 ${compact ? 'pb-11 lg:pb-14' : 'pb-20 lg:pb-24'}`}>
        <Breadcrumbs items={crumbs} />
        {children}
      </div>
    </section>
  )
}
