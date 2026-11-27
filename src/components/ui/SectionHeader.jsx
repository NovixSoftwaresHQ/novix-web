import SectionReveal from './SectionReveal.jsx'

/** `aside` puts a small illustration beside the label (phones) or beside the label and heading (wider screens). */
export default function SectionHeader({ eyebrow, title, description, align = 'center', id, aside, children, className = '' }) {
  const centered = align === 'center'
  const label = eyebrow && (
    <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
  )
  const heading = <h2 id={id} className="mt-3 text-balance heading-section text-3xl sm:text-4xl">{title}</h2>
  return (
    <SectionReveal className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'} ${className}`}>
      {aside ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-5 sm:items-center">
          <div className="contents sm:col-start-1 sm:row-start-1 sm:block">
            <div className="col-start-1 row-start-1">{label}</div>
            <div className="col-span-2 row-start-2">{heading}</div>
          </div>
          <div className="col-start-2 row-start-1">{aside}</div>
        </div>
      ) : (
        <>
          {label}
          {heading}
        </>
      )}
      {description && <p className="mt-4 text-pretty text-base leading-7 sm:text-lg sm:leading-8">{description}</p>}
      {children}
    </SectionReveal>
  )
}
