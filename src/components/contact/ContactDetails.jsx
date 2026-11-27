import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useId } from 'react'
import { company } from '../../data/companyData.js'
import ContactMethodRow from './ContactMethodRow.jsx'

const linkClass =
  'rounded py-0.5 font-semibold text-heading underline-offset-4 transition-colors [overflow-wrap:anywhere] hover:text-primary hover:underline focus-visible:text-primary'
const chat = (phone) => `https://wa.me/${phone.href.replace(/\D/g, '')}`
const external = { target: '_blank', rel: 'noreferrer' }

/** All direct contact details in one panel, with office and hours as quieter footnotes. */
export default function ContactDetails({ className = '' }) {
  const id = useId()
  const [primary, secondary] = company.phones

  return (
    <section aria-labelledby={id} className={`rounded-card border border-edge bg-surface p-6 shadow-card ${className}`}>
      <h2 id={id} className="sr-only">Contact details</h2>
      <ul className="divide-y divide-edge">
        <ContactMethodRow icon={Mail} label="Email">
          <a href={`mailto:${company.email}`} className={linkClass}>
            {/* prefers to wrap after the @ */}
            {company.email.split('@')[0]}@<wbr />
            {company.email.split('@')[1]}
          </a>
        </ContactMethodRow>
        <ContactMethodRow icon={Phone} label="Call">
          {company.phones.map((phone) => (
            <a key={phone.href} href={phone.href} aria-label={`Call ${phone.label}`} className={linkClass}>{phone.label}</a>
          ))}
        </ContactMethodRow>
        <ContactMethodRow icon={MessageCircle} label="WhatsApp">
          <a href={chat(primary)} {...external} aria-label={`Chat on WhatsApp at ${primary.label}`} className={linkClass}>
            Chat on WhatsApp
          </a>
          {/* Each number opens its own chat. */}
          <a href={chat(secondary)} {...external} aria-label={`Second number: ${secondary.label} on WhatsApp`} className={`${linkClass} !font-medium !text-body text-sm`}>
            Second number: <span className="sm:whitespace-nowrap">{secondary.label}</span>
          </a>
        </ContactMethodRow>
      </ul>
      {/* A <dl> row may hold only <dt> and <dd>, so each icon sits inside its term. */}
      <dl className="space-y-3 border-t border-edge pt-4 text-sm">
        {[
          { icon: MapPin, term: 'Office', value: company.address },
          { icon: Clock, term: 'Hours', value: company.hours },
        ].map(({ icon: Icon, term, value }) => (
          <div key={term} className="relative pl-[30px]">
            <dt className="inline font-semibold text-heading">
              <Icon aria-hidden="true" className="absolute left-0 top-0.5 h-[18px] w-[18px] text-primary" />
              {term}:{' '}
            </dt>
            <dd className="inline">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
