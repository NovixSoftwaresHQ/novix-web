import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../../data/homeData.js'
import Button from '../ui/Button.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

const chipClass =
  'inline-block rounded-full border border-edge bg-surface px-3.5 py-2 text-sm font-medium text-heading transition-colors hover:border-primary/50 hover:text-primary focus-visible:text-primary'

export default function ServicesOverview() {
  const { cards, more, all, readyMade } = services
  return (
    <section id="services" aria-labelledby="services-title" className="section surface-alt border-y border-edge">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="services-title" align="left" eyebrow={services.eyebrow} title={services.title} description={services.description} />
          <Button to={all.to} variant="secondary" arrow className="self-start lg:self-auto">{all.label}</Button>
        </div>

        <Stagger as="ul" className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <StaggerItem as="li" key={card.to} className="min-w-0">
              {/* The link's ::after covers the card, so the whole card opens it. */}
              <div className="card card-interactive group relative flex h-full flex-col p-5">
                <div className="flex flex-wrap items-center gap-3 lg:block">
                  <span className="icon-tile"><card.icon aria-hidden="true" className="h-5 w-5" /></span>
                  <h3 className="text-lg font-semibold lg:mt-4">{card.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6">{card.text}</p>
                <Link to={card.to} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary after:absolute after:inset-0 after:rounded-card">
                  {card.link}
                  <ArrowRight aria-hidden="true" className="nudge h-4 w-4 shrink-0" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-1 text-sm font-semibold text-heading">{services.moreLabel}</p>
            <ul className="contents">
              {more.map((item) => (
                <li key={item.to}><Link to={item.to} className={chipClass}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <p className="text-sm">
            {readyMade.text}{' '}
            <Link to={readyMade.to} className="inline-block py-1 font-semibold text-primary underline underline-offset-4">{readyMade.label}</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
