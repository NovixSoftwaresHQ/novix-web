import { Check, LayoutGrid, Lightbulb } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

/*
 * "From idea to working software": an idea tile feeds a simple interface, which leads to a checkmark.
 * The shapes are illustrative only. Timing lives in src/index.css (.build-*): one pass of 3 seconds,
 * paused on its first frame until the figure is on screen. Reduced motion shows the finished picture.
 */
const Bar = ({ x, y, w, strong = false }) => (
  <rect x={x} y={y} width={w} height="5" rx="2.5" className={strong ? 'fill-primary/45' : 'fill-edge'} />
)
const Panel = ({ x, y, w, h }) => <rect x={x} y={y} width={w} height={h} rx="10" className="fill-surface stroke-edge" />

export default function SoftwareBuildIllustration({ caption = [] }) {
  const ref = useRef(null)
  const [play, setPlay] = useState(false)
  const halo = useId()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPlay(true)
        observer.disconnect() // plays once
      },
      { threshold: 0.4 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className="mx-auto w-full max-w-[470px]">
      <div
        ref={ref}
        role="img"
        aria-label="Illustration: from idea to working software. An idea feeds into a simple app interface and ends in a checkmark."
        data-play={play ? '' : undefined}
        className="build aspect-[4/3] w-full"
      >
        <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id={halo}>
              <stop offset="0" className="[stop-color:rgb(var(--primary))] [stop-opacity:var(--glow-alpha)]" />
              <stop offset="1" className="[stop-color:rgb(var(--primary))]" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="240" cy="180" rx="240" ry="180" fill={`url(#${halo})`} />

          {/* Browser window: surface, toolbar, then the outline drawn over them */}
          <g className="build-fade [--at:.55s]">
            <rect x="48" y="20" width="384" height="244" rx="16" className="fill-surface" />
            <path d="M48 56h384" className="stroke-edge" />
            {[66, 78, 90].map((cx) => <circle key={cx} cx={cx} cy="38" r="3.5" className="fill-edge" />)}
            <rect x="112" y="31" width="170" height="14" rx="7" className="fill-tint" />
          </g>
          <rect x="48" y="20" width="384" height="244" rx="16" pathLength="1" fill="none" strokeWidth="1.5" className="build-draw stroke-primary/60 [--at:0s] [--dur:.8s]" />

          {/* Sidebar */}
          <g className="build-fade [--at:.75s]">
            <rect x="62" y="70" width="62" height="180" rx="10" className="fill-tint" />
            {[86, 112, 138, 164].map((y, i) => (
              <g key={y}>
                <rect x="74" y={y} width="10" height="10" rx="3" className={i === 0 ? 'fill-primary' : 'fill-primary/30'} />
                <Bar x={90} y={y + 2.5} w={22} />
              </g>
            ))}
          </g>

          {/* Three interface modules */}
          <g className="build-rise [--at:.95s]">
            <Panel x={138} y={70} w={280} h={70} />
            <rect x="152" y="86" width="38" height="38" rx="9" className="fill-tint" />
            <LayoutGrid x="161" y="95" width="20" height="20" strokeWidth="1.6" className="text-primary" />
            <Bar x={204} y={91} w={128} strong />
            <Bar x={204} y={103} w={190} />
            <Bar x={204} y={115} w={156} />
          </g>
          <g className="build-rise [--at:1.1s]">
            <Panel x={138} y={152} w={134} h={98} />
            <Bar x={152} y={166} w={62} strong />
            {[[152, 30], [176, 44], [200, 24], [224, 52]].map(([x, h]) => (
              <rect key={x} x={x} y={236 - h} width="15" height={h} rx="4" className="fill-primary/25" />
            ))}
          </g>
          <g className="build-rise [--at:1.25s]">
            <Panel x={284} y={152} w={134} h={98} />
            {[172, 198, 224].map((y, i) => (
              <g key={y}>
                <circle cx="304" cy={y} r="7" className="fill-tint stroke-primary/50" />
                <Bar x={320} y={y - 7} w={72 - i * 8} strong={i === 0} />
                <Bar x={320} y={y + 3} w={52 + i * 6} />
              </g>
            ))}
          </g>

          {/* Connectors: idea -> interface -> done */}
          <path d="M146 318h45q14 0 14-14v-54" pathLength="1" fill="none" strokeWidth="1.5" strokeLinecap="round" className="build-draw stroke-primary [--at:1.55s] [--dur:.5s]" />
          <path d="M351 250v54q0 14 14 14h33" pathLength="1" fill="none" strokeWidth="1.5" strokeLinecap="round" className="build-draw stroke-primary [--at:2s] [--dur:.5s]" />
          <g className="build-fade [--at:1.95s]">
            <circle cx="205" cy="250" r="3.5" className="fill-primary" />
            <circle cx="351" cy="250" r="3.5" className="fill-primary" />
          </g>

          {/* Idea input tile */}
          <g className="build-fade [--at:1.3s]">
            <rect x="40" y="292" width="106" height="52" rx="12" className="fill-surface stroke-edge" />
            <rect x="52" y="304" width="28" height="28" rx="8" className="fill-tint" />
            <Lightbulb x="57" y="309" width="18" height="18" strokeWidth="1.6" className="text-primary" />
            <Bar x={90} y={310} w={42} strong />
            <Bar x={90} y={321} w={30} />
          </g>

          {/* Completion */}
          <g className="build-pop [--at:2.45s]">
            <circle cx="422" cy="318" r="24" className="fill-action stroke-action-edge" />
          </g>
          <g className="build-fade [--at:2.6s]">
            <Check x="408" y="304" width="28" height="28" strokeWidth="2.6" className="build-check text-on-action" />
          </g>
        </svg>
      </div>
      {caption.length > 0 && (
        <figcaption className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm font-medium">
          {caption.map((word, index) => (
            <span key={word} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary" />}
              {word}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}
