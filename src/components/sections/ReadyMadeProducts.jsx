import { ArrowRight, Blocks, PenLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { readyMade } from '../../data/homeData.js'
import Button from '../ui/Button.jsx'
import SectionReveal from '../ui/SectionReveal.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

const choiceIcons = [Blocks, PenLine]

export default function ReadyMadeProducts() {
  const { choices, items, all, custom } = readyMade
  return (
    <section id="products" aria-labelledby="products-title" className="section surface-alt border-y border-edge">
      <div className="container-page grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-14">
        <div>
          <SectionHeader id="products-title" align="left" eyebrow={readyMade.eyebrow} title={readyMade.title} />
          <SectionReveal as="dl" className="mt-6 space-y-5">
            {choices.map((choice, index) => {
              const Icon = choiceIcons[index]
              return (
                <div key={choice.title}>
                  <dt className="flex items-center gap-3 font-semibold text-heading">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                    {choice.title}
                  </dt>
                  <dd className="mt-1 pl-8 text-sm leading-6">{choice.text}</dd>
                </div>
              )
            })}
          </SectionReveal>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button to={all.to} variant="secondary" arrow>{all.label}</Button>
            <Link to={custom.to} className="inline-block py-1 text-sm font-semibold text-primary underline underline-offset-4">{custom.label}</Link>
          </div>
        </div>

        <SectionReveal as="ul" aria-label="Example products" className="card divide-y divide-edge overflow-hidden">
          {items.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="group flex items-start gap-4 p-5 transition-colors hover:bg-raised">
                <span className="icon-tile"><item.icon aria-hidden="true" className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-heading">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6">{item.text}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {item.link}
                    <ArrowRight aria-hidden="true" className="nudge h-4 w-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </SectionReveal>
      </div>
    </section>
  )
}
