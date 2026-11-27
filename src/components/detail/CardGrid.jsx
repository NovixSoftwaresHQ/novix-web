import { Check } from 'lucide-react'
import ContentIcon from '../ui/ContentIcon.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import InteractiveCard from '../ui/InteractiveCard.jsx'

export function CheckList({ items, className = '' }) {
  return (
    <ul className={`space-y-2 text-sm ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Icon cards with optional checklist (`points`) or chips (`tags`). */
export default function CardGrid({ items, columns = 'sm:grid-cols-2 lg:grid-cols-3', horizontal = false }) {
  return (
    <Stagger className={`mt-12 grid gap-4 ${columns}`}>
      {items.map((item) => (
        <StaggerItem key={item.title}>
          <InteractiveCard as="article" className={`h-full p-6 ${horizontal ? 'flex flex-col gap-5 sm:flex-row' : ''}`}>
            {item.icon && <span className="icon-tile"><ContentIcon name={item.icon} /></span>}
            <div>
              <h3 className={`font-semibold leading-snug ${horizontal || !item.icon ? '' : 'mt-5'}`}>{item.title}</h3>
              {item.text && <p className="mt-2 text-sm leading-6">{item.text}</p>}
              {item.points?.length > 0 && <CheckList items={item.points} className="mt-4" />}
              {item.tags?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-edge px-2.5 py-0.5 text-xs font-medium">{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </InteractiveCard>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
