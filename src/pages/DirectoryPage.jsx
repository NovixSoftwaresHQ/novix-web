import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CheckList } from '../components/detail/CardGrid.jsx'
import DetailSection from '../components/detail/DetailSection.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import ProcessTimeline from '../components/sections/ProcessTimeline.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { Stagger, StaggerItem } from '../components/ui/MotionWrapper.jsx'
import SectionReveal from '../components/ui/SectionReveal.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Inline } from '../components/ui/RichText.jsx'
import { useConsultation } from '../context/ConsultationContext.jsx'
import { enquiryLabel } from '../data/companyData.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import InteractiveCard from '../components/ui/InteractiveCard.jsx'

const number = (index) => String(index + 1).padStart(2, '0')
// Long, descriptive button labels wrap instead of pushing the layout wider than the screen.
const wraps = '!h-auto min-h-9 !whitespace-normal py-1.5 text-left'

function Category({ category, index, pageName }) {
  const { openConsultation } = useConsultation()
  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`} className="grid gap-8 border-t border-edge py-12 first:border-t-0 lg:grid-cols-[.8fr_1.6fr] lg:gap-14 [&>*]:min-w-0">
      <SectionReveal className="lg:sticky lg:top-28 lg:self-start">
        <p aria-hidden="true" className="font-mono text-sm text-primary">{number(index)}</p>
        <h2 id={`${category.id}-title`} className="heading-section mt-3 text-2xl sm:text-3xl">{category.title}</h2>
        <p className="mt-3 leading-7">{category.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="sm" variant="secondary" to={category.main.to} arrow className={wraps}>{category.main.label}</Button>
          <Button size="sm" variant="ghost" className={wraps} onClick={() => openConsultation({ topic: category.title, context: `${pageName} page: ${category.title}` })}>
            {enquiryLabel}
            <span className="sr-only"> about {category.title}</span>
          </Button>
        </div>
      </SectionReveal>
      <Stagger as="ul" className="grid content-start gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        {category.links.map((link) => (
          <StaggerItem as="li" key={link.to}>
            <InteractiveCard as={Link} to={link.to} className="group flex h-full items-start justify-between gap-3 p-5">
              <span>
                <span className="block font-semibold text-heading">{link.name}</span>
                <span className="mt-1 block text-sm leading-6">{link.text}</span>
                {link.tag && <Badge tone="accent" className="mt-2">{link.tag}</Badge>}
              </span>
              <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-body nudge group-hover:text-primary" />
            </InteractiveCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

/** Layout shared by /services and /products. */
export default function DirectoryPage({ data, path, crumb }) {
  const { openConsultation } = useConsultation()
  const crumbs = [{ label: 'Home', to: '/' }, { label: crumb }]
  usePageMeta({ title: data.meta.title, description: data.meta.description, path, exact: true, type: 'CollectionPage', crumbs })
  const { hero, categories, promo, process, engagement, industries, tech, cta } = data

  return (
    <>
      <PageHero crumbs={crumbs}>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <Stagger immediate className="lg:pt-6">
            <StaggerItem><Badge tone="brand">{hero.eyebrow}</Badge></StaggerItem>
            <StaggerItem as="h1" className="heading-display mt-6 text-balance text-4xl leading-[1.1] sm:text-5xl"><Inline nodes={hero.heading} /></StaggerItem>
            <StaggerItem as="p" className="mt-6 max-w-xl text-lg leading-8">{hero.description}</StaggerItem>
            <StaggerItem className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button size="lg" arrow onClick={() => openConsultation({ context: `${crumb} page` })}>{enquiryLabel}</Button>
              <Button variant="ghost" to={hero.link.to} className={`${wraps} !min-h-11`}>{hero.link.label}</Button>
            </StaggerItem>
          </Stagger>
          <SectionReveal className="card p-5 sm:p-6">
            <p className="text-sm font-semibold text-heading">{hero.jumpLabel}</p>
            <ul className="mt-3 divide-y divide-edge">
              {categories.map((category) => (
                <li key={category.id}>
                  <a href={`#${category.id}`} className="group flex items-center justify-between gap-3 py-3 text-sm font-medium transition-colors hover:text-primary">
                    {category.title}
                    <span className="flex items-center gap-3">
                      <span className="rounded-full border border-edge px-2 py-0.5 font-mono text-xs">{category.links.length}<span className="sr-only"> pages</span></span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4 nudge" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {hero.jumpMore && (
              <ul className="mt-3 flex flex-wrap gap-x-5 border-t border-edge pt-2 text-sm font-semibold">
                {hero.jumpMore.map((item) => (
                  <li key={item.href}><a href={item.href} className="inline-block py-1.5 text-primary underline underline-offset-4">{item.label}</a></li>
                ))}
              </ul>
            )}
          </SectionReveal>
        </div>
      </PageHero>

      <div className="surface-alt border-y border-edge">
        <div className="container-page py-6">
          {categories.map((category, index) => <Category key={category.id} category={category} index={index} pageName={crumb} />)}
          <SectionReveal className="card mb-8 flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="heading-section text-xl">{promo.title}</h2>
              <p className="mt-2 text-sm leading-6">{promo.text}</p>
            </div>
            <ul className="flex flex-wrap gap-2 lg:justify-end">
              {promo.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="inline-block rounded-full border border-edge px-3.5 py-1.5 text-sm font-medium transition hover:border-primary/50 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      </div>

      {industries && (
        <DetailSection id={industries.id} eyebrow={industries.eyebrow} title={industries.title} description={industries.description}>
          <Stagger as="ul" className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {industries.links.map((item) => (
              <StaggerItem as="li" key={item.to} className="border-t border-edge">
                <Link to={item.to} className="group flex h-full items-start justify-between gap-3 py-4">
                  <span>
                    <span className="block font-semibold text-heading transition-colors group-hover:text-primary">{item.industry}</span>
                    <span className="mt-1 block text-sm leading-6">{item.label}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="nudge mt-1 h-4 w-4 shrink-0 text-primary" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </DetailSection>
      )}

      <ProcessTimeline {...process} />

      <DetailSection id="engagement" eyebrow={engagement.eyebrow} title={engagement.title} description={engagement.description} alt>
        <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
          {engagement.items.map((item) => (
            <StaggerItem key={item.title}>
              <InteractiveCard className="flex h-full flex-col p-6">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{item.bestFor}</p>
                <CheckList items={item.points} className="mt-5" />
                {item.link && <Button variant="ghost" to={item.link.to} arrow className={`${wraps} mt-auto self-start !px-0 !pt-4`}>{item.link.label}</Button>}
              </InteractiveCard>
            </StaggerItem>
          ))}
        </Stagger>
        {engagement.note && <p className="mt-6 text-center text-sm">{engagement.note}</p>}
      </DetailSection>

      {tech && (
        <DetailSection id="tech" eyebrow={tech.eyebrow} title={tech.title} description={tech.description}>
          <SectionReveal as="dl" className="card mx-auto mt-10 max-w-4xl divide-y divide-edge">
            {tech.rows.map((row) => (
              <div key={row.label} className="grid gap-3 p-5 sm:grid-cols-[11rem_1fr]">
                <dt className="text-sm font-semibold text-heading">{row.label}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {row.items.map((item) => <span key={item} className="rounded-md border border-edge bg-subtle px-2 py-1 font-mono text-xs">{item}</span>)}
                </dd>
              </div>
            ))}
          </SectionReveal>
        </DetailSection>
      )}

      <CTABanner title={cta.title} text={cta.text} context={`${crumb} page closing section`} />
    </>
  )
}
