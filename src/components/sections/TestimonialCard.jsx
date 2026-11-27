const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

/** Quote first, then who said it. Optional fields simply don't render. */
export default function TestimonialCard({ item }) {
  const { quote, clientName, role, company, avatar, projectUrl } = item
  const detail = [role, company].filter(Boolean).join(', ')
  return (
    <figure className="flex h-full flex-col rounded-panel border border-edge bg-surface p-6">
      <span aria-hidden="true" className="font-serif text-3xl leading-none text-primary">“</span>
      <blockquote className="mt-1 whitespace-pre-line text-[15px] leading-7 text-heading [overflow-wrap:anywhere]">
        <p>{quote}</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        {avatar ? (
          <img src={avatar} alt="" width="40" height="40" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge bg-tint text-xs font-semibold text-primary">
            {initials(clientName)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-heading">{clientName}</span>
          {detail && <span className="block text-sm">{detail}</span>}
          {projectUrl && (
            <a href={projectUrl} target="_blank" rel="noreferrer" className="mt-0.5 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
              View project<span className="sr-only"> for {clientName} (opens in a new tab)</span>
            </a>
          )}
        </span>
      </figcaption>
    </figure>
  )
}
