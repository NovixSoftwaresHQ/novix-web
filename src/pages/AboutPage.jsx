import { ArrowRight, Check, Mail, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import AboutValues from '../components/about/AboutValues.jsx'
import SoftwareBuildIllustration from '../components/about/SoftwareBuildIllustration.jsx'
import AboutCharacter from '../components/mascot/AboutCharacter.jsx'
import CTABanner from '../components/sections/CTABanner.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { Stagger, StaggerItem } from '../components/ui/MotionWrapper.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Inline } from '../components/ui/RichText.jsx'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import SectionReveal from '../components/ui/SectionReveal.jsx'
import { useConsultation } from '../context/ConsultationContext.jsx'
import { about } from '../data/aboutData.js'
import { company, enquiryLabel } from '../data/companyData.js'
import { stages } from '../data/processData.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'About us' }]
const textLink = 'inline-flex items-center gap-1.5 py-1 font-semibold text-primary underline-offset-4 hover:underline'

function Intro() {
  const { openConsultation } = useConsultation()
  const { hero, glance } = about
  return (
    <PageHero compact crumbs={crumbs}>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] lg:gap-14">
        <div>
          {/* On phones the character sits beside the label; on wider screens, beside the label and headline. */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-5 sm:items-center">
            <div className="contents sm:col-start-1 sm:row-start-1 sm:block">
              <div className="col-start-1 row-start-1"><Badge tone="brand">{hero.eyebrow}</Badge></div>
              <h1 className="heading-display col-span-2 row-start-2 mt-4 text-balance text-4xl leading-[1.1] sm:text-5xl">
                <Inline nodes={hero.heading} />
              </h1>
            </div>
            {/* On phones it rises into the space beside the breadcrumbs, so that it adds less height. */}
            <div className="col-start-2 row-start-1"><AboutCharacter className="-mt-14 sm:mt-0" /></div>
          </div>
          <Stagger immediate>
            <StaggerItem as="p" className="mt-5 max-w-xl text-xl leading-8 text-heading">{hero.lead}</StaggerItem>
            <StaggerItem className="mt-5 max-w-xl space-y-4 leading-7">
              <p>{hero.story}</p>
              <p>{hero.services}</p>
            </StaggerItem>
            <StaggerItem className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" arrow onClick={() => openConsultation({ context: 'About introduction' })}>{enquiryLabel}</Button>
              <Button size="lg" variant="secondary" to={hero.link.to}>{hero.link.label}</Button>
            </StaggerItem>
          </Stagger>
        </div>
        <div className="card p-6 lg:mt-16">
          <h2 className="text-base font-semibold">{glance.title}</h2>
          <dl className="mt-3 divide-y divide-edge text-sm leading-6">
            {glance.items.map((item) => (
              <div key={item.term} className="py-3">
                <dt className="font-semibold text-heading">{item.term}</dt>
                <dd className="mt-0.5">{item.text}</dd>
              </div>
            ))}
            <div className="pt-3">
              <dt className="font-semibold text-heading">{glance.work.term}</dt>
              <dd>
                <Link to={glance.work.to} className={`${textLink} group`}>
                  {glance.work.label}
                  <ArrowRight aria-hidden="true" className="nudge h-4 w-4 shrink-0" />
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PageHero>
  )
}

function Approach() {
  const { approach } = about
  return (
    <section id="approach" aria-labelledby="approach-title" className="section surface-alt border-y border-edge">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14 [&>*]:min-w-0">
        <div>
          <SectionHeader id="approach-title" align="left" eyebrow={approach.eyebrow} title={approach.title} />
          <div className="mt-7"><AboutValues values={approach.principles} /></div>
        </div>
        <SoftwareBuildIllustration caption={approach.captions} />
      </div>
    </section>
  )
}

function People() {
  const { people } = about
  const contacts = [
    ...company.phones.map((phone) => ({ href: phone.href, label: phone.label, icon: Phone })),
    { href: company.whatsapp, label: 'Message us on WhatsApp', icon: MessageCircle, external: true },
    { href: `mailto:${company.email}`, label: company.email, icon: Mail },
  ]
  return (
    <section id="people" aria-labelledby="people-title" className="section">
      <div className="container-page grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start lg:gap-14">
        <SectionHeader id="people-title" align="left" eyebrow={people.eyebrow} title={people.title}>
          {people.paragraphs.map((text) => <p key={text} className="mt-4 leading-7">{text}</p>)}
          <p className="mt-4 leading-7"><Inline nodes={people.tech} /></p>
        </SectionHeader>
        <SectionReveal className="card p-6">
          <h3 className="font-semibold">{people.reach}</h3>
          <ul className="mt-3 text-sm">
            {contacts.map((contact) => (
              <li key={contact.href}>
                <a href={contact.href} {...(contact.external && { target: '_blank', rel: 'noreferrer' })} className="flex items-center gap-2.5 py-2 font-medium text-heading underline-offset-4 hover:text-primary hover:underline">
                  <contact.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{contact.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-edge pt-4 text-sm leading-6"><Inline nodes={people.hire} /></p>
        </SectionReveal>
      </div>
    </section>
  )
}

function WorkingWithUs() {
  const { working } = about
  const { engagement } = working
  return (
    <section id="working-with-us" aria-labelledby="working-title" className="section surface-alt border-y border-edge">
      <div className="container-page">
        <SectionHeader id="working-title" align="left" eyebrow={working.eyebrow} title={working.title} description={working.description} />
        <Stagger as="ol" className="mt-9 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {stages.map((stage, index) => (
            <StaggerItem as="li" key={stage.title} className="flex gap-4">
              <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge bg-surface font-mono text-xs font-medium text-primary">
                0{index + 1}
              </span>
              <div>
                <h3 className="pt-2 font-semibold">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6">{stage.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-start lg:gap-14">
          <SectionReveal>
            <h3 className="text-lg font-semibold">{working.expectTitle}</h3>
            <ul className="mt-4 space-y-3">
              {working.expectations.map((item) => (
                <li key={item.title} className="flex gap-3 text-sm leading-6">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <p>
                    <strong className="font-semibold text-heading">{item.title}.</strong> {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </SectionReveal>
          <SectionReveal className="card p-6">
            <h3 className="text-lg font-semibold">{engagement.title}</h3>
            <dl className="mt-2 divide-y divide-edge">
              {engagement.options.map((option) => (
                <div key={option.title} className="py-3">
                  <dt className="text-sm font-semibold text-heading">{option.title}</dt>
                  <dd className="mt-1 text-sm leading-6">{option.text}</dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-edge pt-3 text-sm leading-6">{engagement.note}</p>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  usePageMeta({ title: about.meta.title, description: about.meta.description, path: '/about', exact: true, type: 'AboutPage', crumbs })
  return (
    <>
      <Intro />
      <Approach />
      <People />
      <WorkingWithUs />
      {/* The same closing call to action as on the home page. */}
      <CTABanner context="About closing section" />
    </>
  )
}
