import SectionHeader from '../ui/SectionHeader.jsx'

/** Standard titled section; `alt` switches to the alternate surface. */
export default function DetailSection({ id, eyebrow, title, description, alt = false, className = '', children }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`section ${alt ? 'surface-alt border-y border-edge' : ''} ${className}`}
    >
      <div className="container-page">
        <SectionHeader id={`${id}-title`} eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </section>
  )
}
