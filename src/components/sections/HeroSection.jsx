import { Link } from 'react-router-dom'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { enquiryLabel } from '../../data/companyData.js'
import { hero, heroShots, trustPoints } from '../../data/homeData.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -top-[72px] overflow-hidden sm:max-lg:-top-[113px]">
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-70 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_20%,#000_30%,transparent_80%)]" />
      <div className="absolute -top-32 left-[30%] h-80 w-[34rem] max-w-full rounded-full accent-glow blur-[120px]" />
    </div>
  )
}

// Where each screenshot sits in the collage: two behind, one in front.
const places = [
  'absolute bottom-0 left-[11%] z-10 w-[78%] shadow-lift',
  'absolute left-0 top-0 w-[66%] shadow-card',
  'absolute right-0 top-[9%] w-[60%] shadow-card',
]

// These are the likely largest element on wide screens, so they load straight away (the front one first).
function HeroShots() {
  const [front, ...behind] = heroShots.images
  return (
    <figure className="mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative aspect-[10/8]">
        {[...behind, front].map((image) => (
          <div key={image.src} className={`overflow-hidden rounded-card border border-edge bg-surface ${places[heroShots.images.indexOf(image)]}`}>
            <div aria-hidden="true" className="flex h-4 items-center gap-1 border-b border-edge px-2 sm:h-5">
              {[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 rounded-full bg-edge" />)}
            </div>
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              fetchPriority={image === front ? 'high' : 'low'}
              className="block h-auto w-full"
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm">
        {heroShots.caption}{' '}
        <Link to={heroShots.link.to} className="inline-block py-1 font-semibold text-primary underline underline-offset-4">{heroShots.link.label}</Link>
      </figcaption>
    </figure>
  )
}

function TrustStrip() {
  return (
    // The gaps show the border colour, which draws the dividers in both the two- and four-column layouts.
    <ul aria-label="What you can expect" className="mt-10 grid gap-px overflow-hidden rounded-card border border-edge bg-edge shadow-card fit-sm:grid-cols-2 lg:mt-12 wide:grid-cols-4">
      {trustPoints.map((point) => (
        <li key={point.title} className="flex flex-col gap-2 bg-surface p-4 fit-md:flex-row fit-md:items-start fit-md:gap-3 fit-md:px-5">
          <point.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-5">
            <span className="block font-semibold text-heading">{point.title}</span>
            <span className="mt-0.5 block">{point.text}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

export default function HeroSection() {
  const { openConsultation } = useConsultation()
  return (
    <section aria-labelledby="home-title" className="relative isolate">
      <div className="absolute inset-0 -z-10"><Backdrop /></div>
      <div className="container-page pb-10 pt-10 lg:pb-14 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
          <Stagger immediate>
            <StaggerItem>
              <Badge tone="brand">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                {hero.eyebrow}
              </Badge>
            </StaggerItem>
            <StaggerItem as="h1" id="home-title" className="heading-display mt-5 text-balance text-[2.25rem] leading-[1.1] sm:text-5xl xl:text-[3.5rem]">
              {hero.title} <span className="text-primary">{hero.highlight}</span>
            </StaggerItem>
            <StaggerItem as="p" className="mt-5 max-w-xl text-pretty text-lg leading-8">{hero.description}</StaggerItem>
            <StaggerItem className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" arrow onClick={() => openConsultation({ context: 'Home hero' })}>{enquiryLabel}</Button>
              <Button size="lg" variant="secondary" to={hero.secondary.to}>{hero.secondary.label}</Button>
            </StaggerItem>
          </Stagger>
          <HeroShots />
        </div>
        <TrustStrip />
      </div>
    </section>
  )
}
