import { Plus } from 'lucide-react'
import { useId } from 'react'
import { faqs } from '../../data/homeData.js'
import Button from '../ui/Button.jsx'
import SectionReveal from '../ui/SectionReveal.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

/**
 * Accordion built on <details>, so answers open without JavaScript and are always in the page. Items share a
 * `name`, so opening one closes the others. Pass `items` to reuse it on service, product and contact pages.
 */
export default function FAQAccordion({
  items = faqs,
  title = 'Questions about working with us',
  description = 'Something else on your mind? Ask us before you decide.',
  action = { label: 'Contact us', to: '/contact' },
  className = '',
}) {
  const uid = useId()

  return (
    <section id="faq" aria-labelledby={`${uid}-title`} className={`section ${className}`}>
      <div className="container-page grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <SectionHeader id={`${uid}-title`} align="left" eyebrow="FAQ" title={title} description={description}>
          <Button to={action.to} href={action.href} variant="secondary" arrow className="mt-6">{action.label}</Button>
        </SectionHeader>
        <SectionReveal className="divide-y divide-edge self-start border-y border-edge">
          {items.map((item) => (
            <details key={item.question} name={`faq${uid}`} className="faq relative">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pl-4 pr-2 transition-colors hover:bg-raised [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold">{item.question}</h3>
                <Plus aria-hidden="true" className="faq-sign h-4 w-4 shrink-0 text-primary" />
              </summary>
              <p className="faq-answer pb-5 pl-4 pr-8 text-[15px] leading-7">{item.answer}</p>
            </details>
          ))}
        </SectionReveal>
      </div>
    </section>
  )
}
