import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'

// The grid for each number of steps, and where its connecting line ends: the centre of the last circle.
const layouts = {
  3: { grid: 'lg:grid-cols-3', line: 'right-[calc(33.333%-34px)]' },
  4: { grid: 'lg:grid-cols-4', line: 'right-[calc(25%-35px)]' },
  5: { grid: 'lg:grid-cols-5', line: 'right-[calc(20%-36px)]' },
}

/** Numbered steps in a row. `children` go under the steps (a link to the fuller process, for example). */
export default function ProcessTimeline({ id = 'process', eyebrow = 'How we work', title, description, steps, className = '', children }) {
  const layout = layouts[steps.length] ?? layouts[3]
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section ${className}`}>
      <div className="container-page">
        <SectionHeader id={`${id}-title`} eyebrow={eyebrow} title={title} description={description} />
        <div className="relative mt-10 lg:mt-12">
          <div aria-hidden="true" className={`absolute left-5 top-5 hidden h-px bg-edge lg:block ${layout.line}`} />
          <Stagger as="ol" className={`relative grid gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-5 ${layout.grid}`}>
            {steps.map((step, index) => (
              // On phones the number sits beside the text, to keep the section short.
              <StaggerItem as="li" key={step.title} className="flex gap-4 sm:block">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge bg-surface font-mono text-xs font-medium text-primary">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="pt-2 font-semibold sm:mt-4 sm:pt-0">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        {children}
      </div>
    </section>
  )
}
