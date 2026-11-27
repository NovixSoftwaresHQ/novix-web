import { ArrowUp, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { company, enquiryLabel } from '../../data/companyData.js'
import { footerColumns } from '../../data/navigation.js'
import { focusMain } from '../../lib/focusMain.js'
import Button from '../ui/Button.jsx'
import Logo from './Logo.jsx'

const creditLink = 'font-semibold text-heading underline underline-offset-4 hover:text-primary'
const linkClass = 'underline-offset-4 transition-colors hover:text-heading hover:underline focus-visible:text-heading'
const columnLink = `inline-block py-1 ${linkClass}`
const contactLink = `flex items-start gap-2.5 py-1 ${linkClass}`
const icon = 'mt-0.5 h-4 w-4 shrink-0'
const groupRow = 'sm:grid sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-start sm:gap-x-6 sm:py-3'
const linkList = 'mt-3 space-y-1 text-sm sm:mt-0 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-1 sm:space-y-0'

const backToTop = () => {
  window.scrollTo({ top: 0 })
  focusMain() // so the next Tab starts from the top of the page too
}

export default function Footer() {
  const { openConsultation } = useConsultation()
  const socials = company.socials.filter((social) => social.href)

  return (
    <footer className="border-t border-edge bg-subtle">
      <div className="container-page py-10">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-2xl">
            <Logo />
            <p className="mt-2 text-sm leading-6">{company.tagline}</p>
            {socials.length > 0 && (
              <ul className="mt-3 flex gap-4 text-sm font-semibold">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer" className={columnLink}>{social.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button variant="secondary" arrow className="shrink-0" onClick={() => openConsultation({ context: 'Footer' })}>
            {enquiryLabel}
          </Button>
        </div>

        {/* Phones: each group is a vertical list, two side by side. Wider screens: one row per group, links across. */}
        <div className="mt-8 grid gap-x-4 gap-y-8 fit-sm:max-sm:grid-cols-2 sm:gap-0 sm:divide-y sm:divide-edge sm:border-t sm:border-edge">
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className={groupRow}>
              <h2 className="text-sm font-semibold sm:py-1">{column.title}</h2>
              <ul className={linkList}>
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={columnLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className={`min-w-0 ${groupRow}`}>
            <h2 className="text-sm font-semibold sm:py-1">Contact</h2>
            <address className={`not-italic ${linkList}`}>
              <p className="flex items-start gap-2.5 py-1">
                <MapPin aria-hidden="true" className={icon} />
                {company.address}
              </p>
              {company.phones.map((phone) => (
                <a key={phone.href} href={phone.href} className={contactLink}>
                  <Phone aria-hidden="true" className={icon} />
                  {phone.label}
                </a>
              ))}
              <a href={company.whatsapp} target="_blank" rel="noreferrer" className={contactLink}>
                <MessageCircle aria-hidden="true" className={icon} />
                WhatsApp
              </a>
              <a href={`mailto:${company.email}`} className={contactLink}>
                <Mail aria-hidden="true" className={icon} />
                {/* wraps only after the @, never in the middle of a word */}
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {company.email.split('@')[0]}@<wbr />
                  {company.email.split('@')[1]}
                </span>
              </a>
              <p className="flex items-start gap-2.5 py-1">
                <Clock aria-hidden="true" className={icon} />
                {company.hours}
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-edge">
        <div className="container-page flex flex-col gap-3 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li><Link to="/privacy-policy" className={columnLink}>Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className={columnLink}>Terms & Conditions</Link></li>
            <li><a href="/sitemap.xml" target="_blank" rel="noreferrer" className={columnLink}>XML Sitemap</a></li>
            <li>
              <button type="button" onClick={backToTop} className={`inline-flex items-center gap-1 py-1 ${linkClass}`}>
                Back to top <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </li>
          </ul>
        </div>
        <details className="container-page -mt-2 pb-6 text-sm">
          <summary className={`inline-block cursor-pointer py-1 ${linkClass}`}>Credits</summary>
          <p className="mt-2 max-w-2xl leading-6">
            About page character:{' '}
            <a href="https://rive.app/marketplace/28334-53514-interactive-character-follow/" target="_blank" rel="noreferrer" className={creditLink}>
              Interactive Character Follow
            </a>{' '}
            by{' '}
            <a href="https://rive.app/@alinazari/" target="_blank" rel="noreferrer" className={creditLink}>alinazari</a>, licensed under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noreferrer" className={creditLink}>CC BY 4.0</a>.
            Changes: recoloured green, blink plays once, quicker head turn, and shown without its background panel.
          </p>
        </details>
      </div>
    </footer>
  )
}
