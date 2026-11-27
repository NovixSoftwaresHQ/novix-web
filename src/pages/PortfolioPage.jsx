import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Code2, ClipboardCheck, Gauge, PenTool } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import CTABanner from '../components/sections/CTABanner.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { Stagger, StaggerItem } from '../components/ui/MotionWrapper.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Inline } from '../components/ui/RichText.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import { useConsultation } from '../context/ConsultationContext.jsx'
import { enquiryLabel } from '../data/companyData.js'
import { portfolio } from '../data/portfolioData.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import InteractiveCard from '../components/ui/InteractiveCard.jsx'

const deliveryIcons = [ClipboardCheck, PenTool, Gauge, Code2]
const ALL = portfolio.categories[0].name

function ProjectCard({ project }) {
  return (
    <InteractiveCard as="article" className="group flex h-full flex-col overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden border-b border-edge bg-subtle">
        <img src={project.image} alt={project.imageAlt} width="800" height="600" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Badge tone="accent" className="self-start">{project.category}</Badge>
        <h3 className="mt-4 text-lg font-semibold">{project.name}</h3>
        <p className="mt-1 text-sm font-medium text-heading">{project.summary}</p>
        <p className="mt-3 text-sm leading-6">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => <li key={tag} className="rounded-full border border-edge px-2.5 py-0.5 text-xs font-medium">{tag}</li>)}
        </ul>
        {/* Client sites are external, never internal routes. */}
        <a href={project.url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-primary">
          {project.domain}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </InteractiveCard>
  )
}

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Portfolio' }]

export default function PortfolioPage() {
  const { openConsultation } = useConsultation()
  usePageMeta({ title: portfolio.meta.title, description: portfolio.meta.description, path: '/portfolio', exact: true, type: 'CollectionPage', crumbs })
  const [filter, setFilter] = useState(ALL)
  const { hero, categories, projects, delivery, cta } = portfolio
  const visible = filter === ALL ? projects : projects.filter((project) => project.category === filter)

  return (
    <>
      <PageHero crumbs={crumbs}>
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <Stagger immediate>
            <StaggerItem><Badge tone="brand">{hero.kicker}</Badge></StaggerItem>
            <StaggerItem as="h1" className="heading-display mt-6 text-balance text-4xl leading-[1.1] sm:text-5xl"><Inline nodes={hero.heading} /></StaggerItem>
            <StaggerItem as="p" className="mt-6 max-w-xl text-lg leading-8">{hero.description}</StaggerItem>
            <StaggerItem className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" arrow href="#work">{hero.browseLabel}</Button>
              <Button size="lg" variant="secondary" onClick={() => openConsultation({ context: 'Portfolio page' })}>{enquiryLabel}</Button>
            </StaggerItem>
          </Stagger>
          <aside className="card p-7">
            <p className="flex items-center gap-4">
              <strong className="text-6xl font-semibold text-primary">{projects.length}</strong>
              <span className="max-w-[12rem] text-sm font-medium">{hero.countLabel}</span>
            </p>
            <h2 className="mt-6 text-sm font-semibold">{hero.industriesLabel}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.slice(1).map((category) => <li key={category.name}><Badge>{category.name}</Badge></li>)}
            </ul>
          </aside>
        </div>
      </PageHero>

      <section id="work" aria-labelledby="work-title" className="section surface-alt border-y border-edge">
        <div className="container-page">
          <h2 id="work-title" className="heading-section text-3xl">{portfolio.workTitle}</h2>
          <div role="group" aria-label="Filter projects by industry" className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = filter === category.name
              return (
                <button
                  key={category.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(category.name)}
                  className={`relative rounded-control border px-4 py-2 text-sm font-semibold transition-colors ${active ? 'border-action-edge text-on-action' : 'border-edge bg-surface hover:border-primary/40'}`}
                >
                  {active && <motion.span layoutId="portfolio-pill" transition={{ type: 'spring', stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-control bg-action" />}
                  <span className="relative">{category.name} <span className="ml-1 font-mono text-xs">{category.count}</span></span>
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="sr-only">{visible.length} projects shown</p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((project) => (
                <motion.li key={project.url} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
                  <ProjectCard project={project} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {visible.length === 0 && <p className="mt-10 text-center">{portfolio.emptyText}</p>}
        </div>
      </section>

      <section aria-labelledby="delivery-title" className="section">
        <div className="container-page">
          <SectionHeader id="delivery-title" eyebrow={delivery.kicker} title={delivery.title} />
          <Stagger as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {delivery.items.map((item, index) => {
              const Icon = deliveryIcons[index % deliveryIcons.length]
              return (
                <StaggerItem as="li" key={item.title}>
                  <InteractiveCard className="h-full p-6">
                    <span className="icon-tile"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                    <h3 className="mt-5 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6">{item.text}</p>
                  </InteractiveCard>
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </section>

      <CTABanner title={cta.title} text={cta.text} context="Portfolio page closing section" />
      <p className="-mt-6 px-5 pb-14 text-center text-sm lg:-mt-8">
        <Inline nodes={cta.more} />
      </p>
    </>
  )
}
