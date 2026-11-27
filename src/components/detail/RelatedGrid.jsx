import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import DetailSection from './DetailSection.jsx'
import InteractiveCard from '../ui/InteractiveCard.jsx'

export default function RelatedGrid({ eyebrow, title, description, items, allLink }) {
  return (
    <DetailSection id="related" eyebrow={eyebrow} title={title} description={description} alt>
      <Stagger className={`mt-12 grid gap-4 sm:grid-cols-2 ${items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {items.map((item) => (
          <StaggerItem key={item.to}>
            <InteractiveCard as={Link} to={item.to} className="group flex h-full flex-col p-6">
              <span className="font-semibold text-heading">{item.title}</span>
              <span className="mt-2 text-sm leading-6">{item.text}</span>
              <ArrowRight aria-hidden="true" className="mt-auto h-5 w-9 pt-1 text-primary nudge" />
            </InteractiveCard>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-10 text-center">
        <Button to={allLink.to} variant="secondary" arrow>{allLink.label}</Button>
      </div>
    </DetailSection>
  )
}
