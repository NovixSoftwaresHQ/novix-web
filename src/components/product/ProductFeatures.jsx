import { motion } from 'framer-motion'
import { useId, useRef, useState } from 'react'
import { CheckList } from '../detail/CardGrid.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import InteractiveCard from '../ui/InteractiveCard.jsx'

const number = (index) => `0${index + 1}`
const Tag = ({ children }) => (
  <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">{children}</p>
)

// Operations products: tabs
function Tabs({ items }) {
  const [active, setActive] = useState(0)
  const tabs = useRef([])
  const uid = useId()

  const onKeyDown = (event) => {
    const last = items.length - 1
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="mt-10">
      <div role="tablist" aria-label="Product features" onKeyDown={onKeyDown} className="grid gap-1 rounded-card border border-edge bg-surface p-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.tag}
            ref={(element) => (tabs.current[index] = element)}
            type="button"
            role="tab"
            id={`${uid}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${uid}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={`relative rounded-control px-3 py-3 text-sm font-semibold transition-colors ${index === active ? 'text-on-action' : 'hover:text-heading'}`}
          >
            {index === active && (
              <motion.span layoutId={`${uid}-pill`} transition={{ type: 'spring', stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-control bg-action" />
            )}
            <span className="relative">{item.tag}</span>
          </button>
        ))}
      </div>
      {/* Every panel stays in the DOM for search engines; only the active one is shown. */}
      {items.map((item, index) => (
        <div key={item.tag} role="tabpanel" id={`${uid}-panel-${index}`} aria-labelledby={`${uid}-tab-${index}`} tabIndex={0} hidden={index !== active} className="mt-4 rounded-card">
          {/* The CSS animation starts again each time the panel is shown, and can never leave it invisible. */}
          <div className="rise card grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <h3 className="heading-section text-2xl">{item.title}</h3>
              <p className="mt-4 leading-7">{item.text}</p>
            </div>
            <CheckList items={item.points} className="self-center !space-y-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Education: large numbered cards. Care: horizontal rows. Portals: four columns.
const layouts = {
  edu: { grid: 'lg:grid-cols-2', card: 'p-7', body: '' },
  care: { grid: '', card: 'p-7 lg:grid lg:grid-cols-[5rem_1.2fr_1fr] lg:gap-8', body: 'lg:contents' },
  portal: { grid: 'sm:grid-cols-2 lg:grid-cols-4', card: 'p-6 border-t-2 !border-t-primary/60', body: '' },
}

function Cards({ items, variant }) {
  const layout = layouts[variant]
  const row = variant === 'care'
  return (
    <Stagger className={`mt-12 grid gap-4 ${layout.grid}`}>
      {items.map((item, index) => (
        <StaggerItem key={item.tag}>
          <InteractiveCard as="article" className={`h-full ${layout.card}`}>
            <span aria-hidden="true" className="font-mono text-3xl font-medium text-primary/70">{number(index)}</span>
            <div className={row ? 'mt-4 lg:mt-0' : 'mt-4'}>
              <Tag>{item.tag}</Tag>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{item.title}</h3>
              <p className="mt-3 text-sm leading-6">{item.text}</p>
            </div>
            <CheckList items={item.points} className={row ? 'mt-5 self-center lg:mt-0' : 'mt-5'} />
          </InteractiveCard>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

export default function ProductFeatures({ variant, items }) {
  return variant === 'ops' ? <Tabs items={items} /> : <Cards items={items} variant={variant} />
}
