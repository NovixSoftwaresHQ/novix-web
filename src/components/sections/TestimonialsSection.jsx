import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { approvedTestimonials, testimonialRecords } from '../../data/testimonialsData.js'
import TestimonialCard from './TestimonialCard.jsx'

const published = approvedTestimonials(testimonialRecords)

// One or two entries get a narrower, balanced layout instead of an empty third column.
const layouts = {
  1: 'mx-auto max-w-2xl',
  2: 'mx-auto max-w-4xl md:grid-cols-2',
  many: 'md:grid-cols-2 lg:grid-cols-3',
}

/**
 * Development only: /?testimonials-preview=1, 2, 3 or long shows labelled sample cards.
 * Vite replaces import.meta.env.DEV with false in builds, so this code and the samples are dropped.
 */
function useDevPreview() {
  const { search } = useLocation()
  const [samples, setSamples] = useState(null)
  useEffect(() => {
    if (import.meta.env.DEV) {
      const mode = new URLSearchParams(search).get('testimonials-preview')
      if (!mode) setSamples(null)
      else import('../../data/testimonials.sample.js').then((module) => setSamples(module.sampleSet(mode)))
    }
  }, [search])
  return samples
}

/** A static section. It renders nothing, not even a heading, until there is something approved to show. */
export default function TestimonialsSection({ items = published }) {
  const samples = useDevPreview()
  const list = samples ?? items
  if (list.length === 0) return null

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section">
      <div className="container-page">
        {import.meta.env.DEV && samples && (
          <p role="note" className="mx-auto mb-8 max-w-2xl rounded-control border-2 border-dashed border-danger px-4 py-3 text-center text-sm font-semibold text-heading">
            Development preview: sample content, not real client feedback. This is never part of a built site.
          </p>
        )}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">Client feedback</p>
          <h2 id="testimonials-title" className="heading-section mt-3 text-balance text-3xl sm:text-4xl">What our clients say</h2>
        </div>
        <ul className={`mt-10 grid gap-4 ${layouts[list.length] ?? layouts.many}`}>
          {list.map((item) => (
            <li key={item.id}><TestimonialCard item={item} /></li>
          ))}
        </ul>
      </div>
    </section>
  )
}
