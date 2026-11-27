import ContactDetails from '../components/contact/ContactDetails.jsx'
import ContactIntro from '../components/contact/ContactIntro.jsx'
import Breadcrumbs from '../components/detail/Breadcrumbs.jsx'
import LeadForm from '../components/forms/LeadForm.jsx'
import FAQAccordion from '../components/sections/FAQAccordion.jsx'
import { Stagger, StaggerItem } from '../components/ui/MotionWrapper.jsx'
import SectionReveal from '../components/ui/SectionReveal.jsx'
import { company } from '../data/companyData.js'
import { contact } from '../data/contactData.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import InteractiveCard from '../components/ui/InteractiveCard.jsx'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Contact us' }]

export default function ContactPage() {
  usePageMeta({
    title: contact.meta.title, description: contact.meta.description, path: '/contact', exact: true,
    type: 'ContactPage', crumbs, faq: contact.faq.items,
  })
  const { form, next, faq } = contact

  return (
    <>
      {/* Plain page background: no grid behind the contact details. */}
      <div className="container-page pb-12 pt-10 lg:pb-16">
        <Breadcrumbs items={crumbs} />
        {/*
          Reading and keyboard order follow what is on screen. On small screens: introduction, form, details.
          On large screens the details sit under the introduction. The copy that is not shown is
          display:none, so it is also skipped by keyboards and screen readers.
        */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-12">
          <div className="min-w-0">
            <ContactIntro eyebrow={contact.eyebrow} title={contact.title} lead={contact.lead} />
            <ContactDetails className="mt-6 hidden lg:block" />
          </div>
          <div className="card min-w-0 p-5 sm:p-7">
            <h2 className="heading-section text-2xl">{form.title}</h2>
            <p className="mb-6 mt-2 text-sm">{form.note}</p>
            <LeadForm
              options={form.serviceOptions}
              messagePlaceholder={form.messagePlaceholder || undefined}
              context="Contact page enquiry"
            />
          </div>
          <ContactDetails className="min-w-0 lg:hidden" />
        </div>
      </div>

      <section aria-labelledby="next-title" className="section surface-alt border-y border-edge">
        <div className="container-page">
          <SectionReveal as="h2" id="next-title" className="heading-section text-center text-3xl">{next.title}</SectionReveal>
          <Stagger as="ol" className="mt-10 grid gap-4 md:grid-cols-3">
            {next.steps.map((step, index) => (
              <StaggerItem as="li" key={step.title}>
                <InteractiveCard className="h-full p-6">
                  <span aria-hidden="true" className="font-mono text-2xl font-medium text-primary">0{index + 1}</span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6">{step.text}</p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FAQAccordion items={faq.items} title={faq.title} description={faq.intro} action={{ label: 'Ask us on WhatsApp', href: company.whatsapp }} />
    </>
  )
}
