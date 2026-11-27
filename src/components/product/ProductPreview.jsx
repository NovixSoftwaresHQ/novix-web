import { Search, Smartphone } from 'lucide-react'

// Decorative illustrations built from each product's own feature names. Nothing here is interactive or live data.
const shell = 'overflow-hidden rounded-card border border-edge bg-surface text-xs shadow-card '
const bar = 'block h-1.5 rounded-full bg-edge '
const tones = {
  ok: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  wait: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  info: 'bg-tint text-primary',
}
const Chip = ({ tone, children }) => (
  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tones[tone] ?? tones.info}`}>{children}</span>
)

function Window({ title, children }) {
  return (
    <div className={shell}>
      <div className="flex items-center gap-1.5 border-b border-edge px-4 py-3">
        {[0, 1, 2].map((dot) => <span key={dot} className="h-2.5 w-2.5 rounded-full bg-edge" />)}
        <span className="ml-2 truncate font-mono text-body">{title}</span>
      </div>
      {children}
    </div>
  )
}

function Operations({ data }) {
  return (
    <Window title={data.title}>
      <div className="flex">
        <ul className="hidden w-36 shrink-0 space-y-1 border-r border-edge p-3 sm:block">
          {data.menu.map((item, index) => (
            <li key={item} className={`truncate rounded-md px-2 py-1.5 ${index === 0 ? 'bg-tint font-semibold text-primary' : ''}`}>{item}</li>
          ))}
        </ul>
        <div className="min-w-0 flex-1 p-4">
          <div className="grid grid-cols-3 gap-2">
            {data.tiles.map((tile) => (
              <div key={tile} className="rounded-lg border border-edge p-2.5">
                <span className="block truncate font-medium text-heading">{tile}</span>
                <span className={`${bar} mt-2 w-4/5`} />
                <span className={`${bar} mt-1.5 w-1/2`} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-24 items-end gap-2">
            {[45, 70, 55, 85, 62, 94, 76].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} className="flex-1 rounded-t bg-primary/50" />
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {data.rows.map((row) => (
              <li key={row.text} className="flex items-center gap-2 rounded-lg border border-edge px-2.5 py-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="min-w-0 flex-1 truncate">{row.text}</span>
                <Chip tone={row.tone}>{row.status}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Window>
  )
}

const slotColors = [
  'bg-tint text-heading',
  'border border-edge bg-subtle text-heading',
  'bg-primary/20 text-heading',
  'border border-primary/40 bg-surface text-heading',
]

function Note({ note }) {
  return (
    <div className="border-t border-edge bg-subtle px-4 py-3">
      <strong className="block text-heading">{note.title}</strong>
      <span className="block truncate">{note.text}</span>
    </div>
  )
}

function Timetable({ data }) {
  return (
    <Window title={data.title}>
      <div className="grid grid-cols-[auto_repeat(5,minmax(0,1fr))] gap-1.5 p-3">
        <span />
        {data.days.map((day) => <span key={day} className="text-center font-semibold text-heading">{day}</span>)}
        {data.rows.map((row) => [
          <span key={row.time} className="pr-1 pt-2 font-mono text-[10px] text-body">{row.time}</span>,
          ...row.slots.map((slot, index) =>
            slot ? (
              <span key={`${row.time}-${index}`} className={`flex min-h-[3.5rem] items-center overflow-hidden rounded-md p-1 text-[10px] font-medium leading-tight ${slotColors[slot.color % slotColors.length]}`}>
                <span className="line-clamp-3 break-words">{slot.label}</span>
              </span>
            ) : (
              <span key={`${row.time}-${index}`} className="min-h-[3.5rem] rounded-md border border-dashed border-edge" />
            ),
          ),
        ])}
      </div>
      <Note note={data.note} />
    </Window>
  )
}

function Phone({ data }) {
  return (
    <div className={`${shell} mx-auto max-w-xs !rounded-[36px] !border-4`}>
      <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-edge" />
      <div className="flex items-start gap-2 px-5 pt-4">
        <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="font-semibold text-heading">{data.title}</span>
      </div>
      <p className="px-5 pt-3 font-mono uppercase text-body">{data.subtitle}</p>
      <ul className="space-y-2 p-4">
        {data.appointments.map((item) => (
          <li key={item.time} className="rounded-xl border border-edge p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-primary">{item.time}</span>
              <Chip tone={item.tone}>{item.status}</Chip>
            </div>
            <strong className="mt-1.5 block text-heading">{item.title}</strong>
            <span>{item.meta}</span>
          </li>
        ))}
      </ul>
      {data.button && <div className="mx-4 mb-4 rounded-control bg-action py-2 text-center font-semibold text-on-action">{data.button}</div>}
      <Note note={data.note} />
    </div>
  )
}

function Portal({ data }) {
  return (
    <Window title={data.url}>
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-full border border-edge py-1.5 pl-3 pr-1.5">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{data.search}</span>
          {data.searchButton && <span className="rounded-full bg-action px-3 py-1 font-semibold text-on-action">{data.searchButton}</span>}
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {data.filters.map((filter, index) => (
            <li key={filter} className={`rounded-full border px-2.5 py-1 ${index === 0 ? 'border-primary bg-tint font-semibold text-primary' : 'border-edge'}`}>{filter}</li>
          ))}
        </ul>
        <ul className="mt-4 grid grid-cols-3 gap-2">
          {data.cards.map((card, index) => (
            <li key={card} className="overflow-hidden rounded-lg border border-edge">
              <span className={`block h-20 ${['bg-primary/25', 'bg-primary/15', 'bg-tint'][index % 3]}`} />
              <span className="block p-2">
                <strong className="line-clamp-2 text-heading">{card}</strong>
                <span className={`${bar} mt-2 w-4/5`} />
                <span className={`${bar} mt-1.5 w-1/2`} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  )
}

const previews = { ops: Operations, edu: Timetable, care: Phone, portal: Portal }

export default function ProductPreview({ variant, data }) {
  const Preview = previews[variant]
  return (
    <div aria-hidden="true" className="rise relative min-w-0" style={{ '--rise-delay': '.12s' }}>
      <Preview data={data} />
    </div>
  )
}
