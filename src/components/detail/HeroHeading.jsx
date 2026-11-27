/** Renders heading segments; the highlighted one uses the accent colour. */
export default function HeroHeading({ segments, className = '' }) {
  return (
    <h1 className={`heading-display text-balance text-4xl leading-[1.1] sm:text-5xl ${className}`}>
      {segments.map((segment, index) => (
        <span key={segment.text}>
          {index > 0 && ' '}
          <span className={segment.highlight ? 'text-primary' : undefined}>
            {segment.text}
          </span>
        </span>
      ))}
    </h1>
  )
}
