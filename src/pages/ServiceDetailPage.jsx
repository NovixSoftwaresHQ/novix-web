import { use } from 'react'
import { CalendarClock, Layers, UsersRound } from 'lucide-react'
import CardGrid, { CheckList } from '../components/detail/CardGrid.jsx'
import DetailSection from '../components/detail/DetailSection.jsx'
import RelatedGrid from '../components/detail/RelatedGrid.jsx'
import ServiceHero, { serviceCrumbs } from '../components/detail/ServiceHero.jsx'
import FeatureVideo from '../components/media/FeatureVideo.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import FAQAccordion from '../components/sections/FAQAccordion.jsx'
import ProcessTimeline from '../components/sections/ProcessTimeline.jsx'
import { Stagger, StaggerItem } from '../components/ui/MotionWrapper.jsx'
import SectionReveal from '../components/ui/SectionReveal.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import { company } from '../data/companyData.js'
import { serviceBySlug } from '../data/serviceCatalog.js'
import { loadServiceGroup } from '../data/servicesData.js'
import { mergeContent } from '../lib/contentGroups.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { serviceNode } from '../seo/head.js'
import NotFoundPage from './NotFoundPage.jsx'
import InteractiveCard from '../components/ui/InteractiveCard.jsx'

function Focus({ focus }) {
  return (
    <DetailSection id="focus" eyebrow={focus.eyebrow} title={focus.title}>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {focus.items.map((item) => (
          <SectionReveal key={item.title}><InteractiveCard className="h-full p-7 sm:p-9">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">{item.tag}</p>
            <h3 className="heading-section mt-4 text-2xl">{item.title}</h3>
            <p className="mt-4 leading-7">{item.text}</p>
            <CheckList items={item.points} className="mt-5" />
          </InteractiveCard></SectionReveal>
        ))}
      </div>
    </DetailSection>
  )
}

function Audience({ audience }) {
  return (
    <section id="audience" aria-labelledby="audience-title" className="section surface-alt border-y border-edge">
      <div className="container-page grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <SectionHeader id="audience-title" align="left" eyebrow={audience.eyebrow} title={audience.title} description={audience.description} />
        <div>
          <Stagger as="ol" className="space-y-3">
            {audience.items.map((item, index) => (
              <StaggerItem as="li" key={item}>
                <InteractiveCard className="flex items-center gap-5 p-5">
                  <span aria-hidden="true" className="font-mono text-sm text-primary">0{index + 1}</span>
                  <span className="font-medium text-heading">{item}</span>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
          {audience.industries.length > 0 && (
            <SectionReveal className="mt-8">
              <h3 className="text-sm font-semibold">{audience.industriesLabel}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {audience.industries.map((industry) => (
                  <li key={industry} className="rounded-full border border-edge bg-surface px-3 py-1 text-xs font-medium">{industry}</li>
                ))}
              </ul>
            </SectionReveal>
          )}
        </div>
      </div>
    </section>
  )
}

// Some pages list tool chips per group; others describe one technology per card.
function TechStack({ tech }) {
  const four = tech.groups.length % 4 === 0
  return (
    <DetailSection id="tech" eyebrow={tech.eyebrow} title={tech.title} description={tech.description} alt>
      <Stagger className={`mt-12 grid gap-4 sm:grid-cols-2 ${four ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {tech.groups.map((group) => (
          <StaggerItem key={group.title}>
            <InteractiveCard className="h-full p-6">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              {group.text && <p className="mt-2 text-sm leading-6">{group.text}</p>}
              {group.tools && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.tools.map((tool) => (
                    <li key={tool} className="rounded-md border border-edge bg-subtle px-2 py-1 font-mono text-xs">{tool}</li>
                  ))}
                </ul>
              )}
            </InteractiveCard>
          </StaggerItem>
        ))}
      </Stagger>
    </DetailSection>
  )
}

const engagementIcons = [Layers, UsersRound, CalendarClock]

function Engagement({ engagement }) {
  return (
    <DetailSection id="engagement" eyebrow={engagement.eyebrow} title={engagement.title} description={engagement.description}>
      <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
        {engagement.items.map((item, index) => {
          const Icon = engagementIcons[index % engagementIcons.length]
          return (
            <StaggerItem key={item.title}>
              <InteractiveCard className="h-full p-6">
                <span className="icon-tile"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                {item.text && <p className="mt-2 text-sm leading-6">{item.text}</p>}
                {item.points && <CheckList items={item.points} className="mt-4" />}
              </InteractiveCard>
            </StaggerItem>
          )
        })}
      </Stagger>
      {engagement.note && <p className="mt-6 text-center text-sm">{engagement.note}</p>}
    </DetailSection>
  )
}

function ServiceContent({ service }) {
  const crumbs = serviceCrumbs(service)
  usePageMeta({
    title: service.meta.title, description: service.meta.description, path: service.path, exact: true,
    crumbs, faq: service.faq.items,
    nodes: [serviceNode({ path: service.path, name: service.hero.heading.map((segment) => segment.text).join(' '), serviceType: service.title, description: service.meta.description })],
  })
  const horizontal = service.theme === 'web'

  return (
    <>
      <ServiceHero service={service} />
      {service.video && <FeatureVideo video={service.video} topic={service.title} context={`Video on ${service.title}`} />}
      <DetailSection id="serviceCapabilities" {...service.capabilities} alt>
        <CardGrid items={service.capabilities.items} horizontal={horizontal} columns={horizontal ? 'lg:grid-cols-2' : undefined} />
      </DetailSection>
      {service.focus && <Focus focus={service.focus} />}
      <Audience audience={service.audience} />
      <ProcessTimeline {...service.process} />
      {service.tech && <TechStack tech={service.tech} />}
      <Engagement engagement={service.engagement} />
      <FAQAccordion
        items={service.faq.items}
        title={service.faq.title}
        description={service.faq.description}
        action={{ label: 'Ask us on WhatsApp', href: company.whatsapp }}
      />
      <RelatedGrid {...service.related} allLink={{ label: 'View all services', to: '/services' }} />
      <CTABanner title={service.cta.title} text={service.cta.text} whatsapp={service.cta.whatsapp} topic={service.title} />
    </>
  )
}

export default function ServiceDetailPage({ slug }) {
  const group = use(loadServiceGroup(serviceBySlug[slug].theme))
  const service = mergeContent(serviceBySlug, group, slug)
  return service ? <ServiceContent service={service} /> : <NotFoundPage />
}
