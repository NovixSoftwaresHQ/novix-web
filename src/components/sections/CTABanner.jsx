import { closingCta } from '../../data/homeData.js'
import CompactProjectCTA from './CompactProjectCTA.jsx'

/** The closing banner. Home and About use the default copy; other pages pass their own heading and sentence. */
export default function CTABanner({ title = closingCta.title, text = closingCta.text, whatsapp, topic, context }) {
  return <CompactProjectCTA title={title} text={text} whatsapp={whatsapp} topic={topic} context={context} />
}
