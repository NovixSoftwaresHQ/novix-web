import CTABanner from '../components/sections/CTABanner.jsx'
import FAQAccordion from '../components/sections/FAQAccordion.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import ProcessTimeline from '../components/sections/ProcessTimeline.jsx'
import ReadyMadeProducts from '../components/sections/ReadyMadeProducts.jsx'
import SelectedWork from '../components/sections/SelectedWork.jsx'
import ServicesOverview from '../components/sections/ServicesOverview.jsx'
import TestimonialsSection from '../components/sections/TestimonialsSection.jsx'
import Button from '../components/ui/Button.jsx'
import { faqs, homeMeta, processSection } from '../data/homeData.js'
import { summarySteps } from '../data/processData.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

export default function HomePage() {
  usePageMeta({ ...homeMeta, path: '/', exact: true, faq: faqs })
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <SelectedWork />
      <ReadyMadeProducts />
      <ProcessTimeline eyebrow={processSection.eyebrow} title={processSection.title} steps={summarySteps}>
        <p className="mt-8 text-center">
          <Button variant="ghost" to={processSection.link.to} arrow className="!h-auto !whitespace-normal py-2 text-center">
            {processSection.link.label}
          </Button>
        </p>
      </ProcessTimeline>
      {/* Renders nothing until testimonials are approved (see README). */}
      <TestimonialsSection />
      <FAQAccordion className="surface-alt border-t border-edge" />
      <CTABanner context="Home closing section" />
    </>
  )
}
