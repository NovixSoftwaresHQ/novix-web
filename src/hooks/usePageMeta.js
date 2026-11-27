import { createContext, useContext, useEffect } from 'react'
import { buildHead } from '../seo/head.js'

/** Set only while prerendering: collects each page's head data, because effects don't run there. */
export const HeadContext = createContext(null)

/** Replaces every tag the previous page set, so nothing stale or duplicated survives in-app navigation. */
function applyHead({ title, canonical, metas, jsonLd }) {
  document.title = title
  const { head } = document
  head.querySelectorAll('meta[data-seo], script[data-seo], link[rel="canonical"], meta[name="description"], meta[name="robots"]').forEach((element) => element.remove())
  const add = (tag, attributes) => {
    const element = Object.assign(document.createElement(tag), attributes.properties)
    Object.entries(attributes).forEach(([key, value]) => key !== 'properties' && element.setAttribute(key, value))
    element.setAttribute('data-seo', '')
    head.appendChild(element)
  }
  for (const [attribute, name, content] of metas) add('meta', { [attribute]: name, content })
  if (canonical) add('link', { rel: 'canonical', href: canonical })
  if (jsonLd) add('script', { type: 'application/ld+json', properties: { textContent: JSON.stringify(jsonLd) } })
}

/** See buildHead for the accepted fields. */
export function usePageMeta(page) {
  const head = buildHead(page)
  const collector = useContext(HeadContext)
  if (collector) Object.assign(collector, head)

  const serialized = JSON.stringify(head)
  useEffect(() => applyHead(JSON.parse(serialized)), [serialized])
}
