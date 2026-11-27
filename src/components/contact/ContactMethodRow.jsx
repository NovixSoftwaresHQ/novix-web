/** One aligned row: small icon, label and its links. */
export default function ContactMethodRow({ icon: Icon, label, children }) {
  return (
    <li className="flex gap-3.5 py-4 first:pt-0">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-control bg-tint text-primary">
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-medium uppercase tracking-wider text-body">{label}</h3>
        <div className="mt-1 flex flex-col items-start gap-0.5">{children}</div>
      </div>
    </li>
  )
}
