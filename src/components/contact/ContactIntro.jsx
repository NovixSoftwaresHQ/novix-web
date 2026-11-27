export default function ContactIntro({ eyebrow, title, lead }) {
  return (
    <div>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="heading-display mt-3 text-balance text-[2rem] leading-[1.15] lg:text-[2.75rem]">{title}</h1>
      <p className="mt-4 max-w-lg text-base leading-7">{lead}</p>
    </div>
  )
}
