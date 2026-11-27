const tones = {
  brand: 'border-primary/30 bg-tint text-primary',
  accent: 'border-primary/30 bg-tint text-primary',
  neutral: 'border-edge bg-surface text-body',
}

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
