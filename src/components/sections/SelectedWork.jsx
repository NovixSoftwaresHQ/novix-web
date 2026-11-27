import { ExternalLink } from 'lucide-react'
import { selectedWork } from '../../data/homeData.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

const Detail = ({ term, children }) => (
  <div>
    <dt className="inline font-semibold text-heading">{term}: </dt>
    <dd className="inline">{children}</dd>
  </div>
)

export default function SelectedWork() {
  const { items, link } = selectedWork
  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="work-title" align="left" eyebrow={selectedWork.eyebrow} title={selectedWork.title} description={selectedWork.description} />
          <Button to={link.to} variant="secondary" arrow className="self-start lg:self-auto">{link.label}</Button>
        </div>

        <Stagger as="ul" className="mt-9 grid gap-6 md:grid-cols-2">
          {items.map((project) => (
            <StaggerItem as="li" key={project.url}>
              <article className="card flex h-full flex-col overflow-hidden">
                <img
                  src={project.image}
                  width="800"
                  height="600"
                  alt={project.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] h-auto w-full border-b border-edge object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge tone="brand">{project.status}</Badge>
                    <span>{project.category}</span>
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{project.name}</h3>
                  <dl className="mb-5 mt-2 space-y-2 text-sm leading-6">
                    <Detail term="Purpose">{project.purpose}</Detail>
                    <Detail term="What was built">{project.built}</Detail>
                  </dl>
                  <Button href={project.url} variant="secondary" className="mt-auto self-start">
                    View project
                    <span className="sr-only">: {project.name} (opens in a new tab)</span>
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
