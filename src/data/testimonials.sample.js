// DEVELOPMENT PREVIEW ONLY. Placeholder text for checking the layout: not real people, companies or feedback.
// Loaded only when import.meta.env.DEV is true, so it never reaches a built site.
const make = (n, quote, extra = {}) => ({ id: `sample-${n}`, quote, clientName: `Sample Person ${n}`, approved: true, ...extra })

const short = make(1, 'SAMPLE TEXT. A short placeholder quote to check how one card looks.', { role: 'Sample role', company: 'Sample company' })
const bare = make(2, 'SAMPLE TEXT. This card has only a quote and a name, so every optional field should disappear cleanly.')
const long = make(
  3,
  'SAMPLE TEXT. This long placeholder checks that a lengthy quotation stays completely readable, with no clamping, truncation or fixed height. ' +
    'It continues for several sentences so the card has to grow. '.repeat(6) +
    'The very last words of this sample are: END OF LONG SAMPLE.',
  { role: 'A deliberately long sample job title for wrapping', company: 'Sample Company With A Very Long Name Limited', projectUrl: 'https://example.com/' },
)

export const sampleSet = (mode) => ({ 1: [short], 2: [short, bare], 3: [short, bare, long], long: [long] })[mode] ?? [short, bare, long]
