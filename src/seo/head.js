// Builds one page's head data from the same content the page shows. Prerendering and the browser both use it.
import { company } from '../data/companyData.js'
import { SITE_INDEXABLE, SITE_ORIGIN } from '../data/siteOrigin.js'

const SHARE_IMAGE = { path: '/uploads/og-image.jpg', width: '1200', height: '630', type: 'image/jpeg' }
const INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export const absolute = (path) => `${SITE_ORIGIN}${path}`
const ORGANIZATION_ID = absolute('/#organization')
const WEBSITE_ID = absolute('/#website')

// Only facts shown on the site. Address and opening hours stay out until the owner confirms them.
const organization = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: company.name,
  url: absolute('/'),
  logo: absolute('/uploads/logo.png'),
  email: company.email,
  telephone: company.phones[0].href.replace('tel:', ''),
})

/** `crumbs` are the visible breadcrumbs. The last one has no `to`: it is the current page. */
const breadcrumbList = (crumbs, url) => ({
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.label,
    item: crumb.to ? absolute(crumb.to) : url,
  })),
})

export const serviceNode = ({ path, name, serviceType, description }) => ({
  '@type': 'Service',
  '@id': `${absolute(path)}#service`,
  url: absolute(path),
  name,
  serviceType,
  description,
  provider: { '@id': ORGANIZATION_ID },
})

export const articleNode = ({ path, headline, description, image, datePublished }) => ({
  '@type': 'BlogPosting',
  '@id': `${absolute(path)}#article`,
  headline,
  description,
  image,
  datePublished,
  author: { '@id': ORGANIZATION_ID },
  publisher: { '@id': ORGANIZATION_ID },
  mainEntityOfPage: { '@id': `${absolute(path)}#webpage` },
})

const faqNode = (items, url) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

/**
 * `noindex` is the page's own indexing decision. Without a `path` (the not-found page) there is no
 * canonical URL or structured data. `exact` uses the title as written.
 */
export function buildHead(
  { title, description = '', path, exact = false, noindex = false, type = 'WebPage', ogType = 'website', crumbs, faq, nodes = [] },
  indexable = SITE_INDEXABLE,
) {
  const fullTitle = exact || title.includes(company.name) ? title : `${title} | ${company.name}`
  const canonical = path ? absolute(path) : null
  const blocked = noindex || !path
  const robots = !indexable ? 'noindex, nofollow' : blocked ? 'noindex, follow' : INDEX
  const image = absolute(SHARE_IMAGE.path)

  const metas = [['name', 'description', description], ['name', 'robots', robots]]
  if (canonical) {
    metas.push(
      ['property', 'og:site_name', company.name], ['property', 'og:locale', 'en_IN'], ['property', 'og:type', ogType],
      ['property', 'og:title', fullTitle], ['property', 'og:description', description], ['property', 'og:url', canonical],
      ['property', 'og:image', image], ['property', 'og:image:type', SHARE_IMAGE.type],
      ['property', 'og:image:width', SHARE_IMAGE.width], ['property', 'og:image:height', SHARE_IMAGE.height],
      ['property', 'og:image:alt', company.name],
      ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', fullTitle],
      ['name', 'twitter:description', description], ['name', 'twitter:image', image], ['name', 'twitter:image:alt', company.name],
    )
  }

  const jsonLd = canonical && {
    '@context': 'https://schema.org',
    '@graph': [
      organization(),
      { '@type': 'WebSite', '@id': WEBSITE_ID, url: absolute('/'), name: company.name, inLanguage: 'en-IN', publisher: { '@id': ORGANIZATION_ID } },
      {
        '@type': type, '@id': `${canonical}#webpage`, url: canonical, name: fullTitle, description, inLanguage: 'en-IN',
        isPartOf: { '@id': WEBSITE_ID },
        ...(crumbs && { breadcrumb: { '@id': `${canonical}#breadcrumb` } }),
      },
      ...(crumbs ? [breadcrumbList(crumbs, canonical)] : []),
      ...nodes,
      ...(faq?.length ? [faqNode(faq, canonical)] : []),
    ],
  }

  return { title: fullTitle, description, path, canonical, noindex: blocked, metas: metas.filter(([, , content]) => content), jsonLd: jsonLd || null }
}
