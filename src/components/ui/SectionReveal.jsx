import { useReveal } from '../../hooks/useReveal.js'

/** Single fade-up the first time it is scrolled to (see useReveal). `delay` is in seconds. */
export default function SectionReveal({ as: Element = 'div', delay = 0, style, children, ...props }) {
  const ref = useReveal()
  return (
    <Element ref={ref} data-reveal="" style={delay ? { ...style, '--reveal-delay': `${delay}s` } : style} {...props}>
      {children}
    </Element>
  )
}
