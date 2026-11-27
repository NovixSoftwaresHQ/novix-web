import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" className="h-3 w-3 text-body" />}
            {item.to ? (
              <Link to={item.to} className="inline-block py-1 hover:text-primary">{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-heading">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
