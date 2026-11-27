/**
 * Card that lifts 3px and brightens its border on hover, and does the same for keyboard focus,
 * whether the card itself is focused (a link) or something inside it. Styles: .card-interactive.
 */
export default function InteractiveCard({ as: Component = 'div', className = '', ...props }) {
  return <Component className={`card card-interactive ${className}`} {...props} />
}
