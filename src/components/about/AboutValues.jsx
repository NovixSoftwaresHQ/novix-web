import { KeyRound, ShieldCheck, Waypoints } from 'lucide-react'
import { Stagger, StaggerItem } from '../ui/MotionWrapper.jsx'

const icons = [Waypoints, ShieldCheck, KeyRound]

/** The three principles as rows on one surface. */
export default function AboutValues({ values }) {
  return (
    <Stagger as="ul" className="card divide-y divide-edge px-5 sm:px-6">
      {values.map((value, index) => {
        const Icon = icons[index % icons.length]
        return (
          <StaggerItem as="li" key={value.title} className="flex flex-col gap-3 py-5 fit-xs:flex-row fit-xs:gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-tint text-primary">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold">{value.title}</h3>
              <p className="mt-1 text-sm leading-6">{value.text}</p>
            </div>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}
