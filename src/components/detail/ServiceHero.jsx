import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { enquiryLabel } from '../../data/companyData.js'
import LeadForm from '../forms/LeadForm.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'
import HeroHeading from './HeroHeading.jsx'
import { heroThemes } from './serviceThemes.js'

/** "Discuss your project" goes to the page's own form where there is one, and opens the popup where there is not. */
function HeroActions({ service }) {
  const { openConsultation } = useConsultation()
  const start = service.leadForm
    ? { href: '#heroQuoteCard' }
    : { onClick: () => openConsultation({ topic: service.title, context: `Service page: ${service.title}` }) }
  return (
    <>
      <Button size="lg" arrow {...start}>{enquiryLabel}</Button>
      <Button size="lg" variant="secondary" href="#serviceCapabilities">Explore capabilities</Button>
    </>
  )
}

function SummaryCard({ card, topic }) {
  const { openConsultation } = useConsultation()
  return (
    <div id="heroQuoteCard" className="card p-6 sm:p-8">
      <h2 className="heading-section text-xl">{card.title}</h2>
      <p className="mt-1 text-sm">{card.subtitle}</p>
      <ul className="mt-6 space-y-3 text-sm">
        {card.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
      <Button arrow className="mt-7 w-full" onClick={() => openConsultation({ topic, context: `Service page: ${topic}` })}>{enquiryLabel}</Button>
    </div>
  )
}

function FormCard({ form, theme, topic }) {
  return (
    <div id="heroQuoteCard" className={`relative ${theme.frame}`}>
      {theme.chrome === 'browser' && (
        <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-edge px-5 py-3">
          {[0, 1, 2].map((dot) => <span key={dot} className="h-2.5 w-2.5 rounded-full bg-edge" />)}
        </div>
      )}
      {theme.chrome === 'phone' && <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-edge" />}
      <div className="p-6 sm:p-7">
        <h2 className="heading-section text-xl">{form.title}</h2>
        {form.subtitle && <p className="mt-1 text-sm leading-6">{form.subtitle}</p>}
        <div className="mt-5">
          <LeadForm
            options={form.serviceOptions}
            defaultService={form.defaultService}
            messagePlaceholder={form.messagePlaceholder}
            context={form.title}
            topic={topic}
            wide={theme.layout === 'centered'}
          />
        </div>
      </div>
    </div>
  )
}

export const serviceCrumbs = (service) => [{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]

export default function ServiceHero({ service }) {
  const theme = heroThemes[service.theme]
  const { hero } = service
  const centered = theme.layout === 'centered'
  const reversed = theme.layout === 'reversed'

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute inset-0 ${theme.pattern}`} />
        <div className="absolute -top-32 left-[30%] h-80 w-[34rem] max-w-full rounded-full accent-glow blur-[120px]" />
      </div>
      <div className="container-page pb-20 pt-10 lg:pb-24">
        <Breadcrumbs items={serviceCrumbs(service)} />
        <div className={`mt-10 grid items-start gap-12 ${centered ? '' : reversed ? 'lg:grid-cols-[.9fr_1.1fr]' : 'lg:grid-cols-[1.1fr_.9fr]'}`}>
          {/* Text stays first in the DOM, so it leads on small screens even in the reversed layout. */}
          <Stagger immediate className={`${centered ? 'mx-auto max-w-3xl text-center' : 'lg:pt-6'} ${reversed ? 'lg:order-2' : ''}`}>
            <StaggerItem><Badge tone="brand">{hero.badge}</Badge></StaggerItem>
            <StaggerItem className="mt-6"><HeroHeading segments={hero.heading} /></StaggerItem>
            <StaggerItem as="p" className="mt-6 text-pretty text-lg leading-8">{hero.description}</StaggerItem>
            <StaggerItem className={`mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${centered ? 'sm:justify-center' : ''}`}>
              <HeroActions service={service} />
            </StaggerItem>
            <StaggerItem as="ul" className={`mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium ${centered ? 'justify-center' : ''}`}>
              {hero.trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </StaggerItem>
          </Stagger>
          <Stagger immediate delay={0.25} className={`${centered ? 'mx-auto w-full max-w-5xl' : ''} ${theme.panel} ${reversed ? 'lg:order-1' : ''}`}>
            <StaggerItem>
              {service.leadForm ? (
                <FormCard form={service.leadForm} theme={theme} topic={service.title} />
              ) : (
                <SummaryCard card={service.summaryCard} topic={service.title} />
              )}
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  )
}
