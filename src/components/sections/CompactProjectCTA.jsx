import { Mail, MessageCircle, Phone } from 'lucide-react'
import { useId } from 'react'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { afterEnquiry, company, enquiryLabel } from '../../data/companyData.js'
import Button from '../ui/Button.jsx'
import SectionReveal from '../ui/SectionReveal.jsx'

const linkClass =
  'inline-flex items-center gap-1.5 rounded py-1.5 text-sm font-semibold text-heading underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary'

/**
 * Compact closing call to action: one heading, one sentence, the enquiry button, other ways to reach us and what
 * happens next. `topic` preselects the enquiry subject, `context` tells the business where it came from, and
 * `whatsapp` overrides the chat link. Pages use it through CTABanner.
 */
export default function CompactProjectCTA({ title, text, topic, context, whatsapp = company.whatsapp }) {
  const { openConsultation } = useConsultation()
  const titleId = useId()
  const contacts = [
    { href: whatsapp, label: 'WhatsApp', name: `WhatsApp ${company.phones[0].label}`, icon: MessageCircle, external: true },
    { href: company.phones[0].href, label: company.phones[0].label, name: `Call ${company.phones[0].label}`, icon: Phone },
    { href: `mailto:${company.email}`, label: 'Email', name: `Email ${company.email}`, icon: Mail },
  ]
  return (
    <section aria-labelledby={titleId} className="py-12 lg:py-14">
      <div className="container-page">
        <SectionReveal className="flex flex-col gap-5 rounded-panel border border-edge bg-surface p-5 shadow-card sm:p-6 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-10 lg:px-8 lg:py-10">
          <div className="min-w-0 lg:flex-1 lg:basis-[26rem]">
            <h2 id={titleId} className="heading-section text-balance text-[1.625rem] leading-tight lg:text-3xl">{title}</h2>
            <p className="mt-2 text-base leading-7">{text}</p>
            <p className="mt-3 max-w-xl text-sm leading-6">
              <span className="font-semibold text-heading">What happens next:</span> {afterEnquiry}
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:items-start lg:items-center">
            <Button size="lg" arrow onClick={() => openConsultation({ topic, context: context ?? (topic ? `Closing section: ${topic}` : 'Closing section') })}>
              {enquiryLabel}
            </Button>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 sm:justify-start">
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a href={contact.href} {...(contact.external && { target: '_blank', rel: 'noreferrer' })} aria-label={contact.name} className={linkClass}>
                    <contact.icon aria-hidden="true" className="h-4 w-4 text-primary" />
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
