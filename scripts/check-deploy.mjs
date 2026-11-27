// Verifies a deployed copy over HTTP.
//   npm run check:deploy -- https://deploy-preview-1--your-site.netlify.app            (expects noindex)
//   SITE_URL=https://your-domain npm run check:deploy -- https://your-domain --production
import { archives } from '../src/data/archivesData.js'
import { company } from '../src/data/companyData.js'
import { products } from '../src/data/productCatalog.js'
import { services } from '../src/data/serviceCatalog.js'
import { allRoutes } from '../src/data/siteRoutes.js'
import { productionOrigin } from './site-env.mjs'

const args = process.argv.slice(2)
const production = args.includes('--production')
const base = args.find((arg) => /^https?:\/\//.test(arg))?.replace(/\/+$/, '')
if (!base) {
  console.error('Usage: npm run check:deploy -- <deployed URL> [--production]')
  process.exit(2)
}
const origin = production ? productionOrigin(process.env.SITE_URL) : process.env.SITE_URL?.replace(/\/+$/, '') || company.siteUrl

const failures = []
const get = (url) => fetch(url.startsWith('http') ? url : base + url, { redirect: 'manual', signal: AbortSignal.timeout(20000) })
const hidden = new Set(archives.map((route) => route.path))

async function expect(path, test) {
  try {
    const response = await get(path)
    const problem = await test(response, await response.text())
    if (problem) failures.push(`${path}: ${problem}`)
  } catch (error) {
    failures.push(`${path}: ${error.message}`)
  }
}

const checks = allRoutes.map(({ path }) => () =>
  expect(path, (response, body) => {
    if (response.status !== 200) return `status ${response.status} ${response.headers.get('location') ?? ''}`
    if (!body.includes(`<link rel="canonical" href="${origin}${path}"`)) return 'wrong or missing page HTML or canonical'
    const header = response.headers.get('x-robots-tag') ?? ''
    const meta = body.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ''
    if (production) {
      if (header.includes('noindex')) return `production sends X-Robots-Tag: ${header}`
      if (meta.includes('noindex') !== hidden.has(path)) return `unexpected robots meta "${meta}"`
    } else if (!header.includes('noindex') && !meta.includes('noindex')) return 'preview can be indexed (no noindex header or meta)'
    return null
  }),
)
for (const path of ['/this-page-does-not-exist', '/services/not-a-service', '/blog/tag/not-a-tag', '/api/submit_form.php']) {
  checks.push(() =>
    expect(path, (response, body) => (response.status !== 404 ? `expected 404, got ${response.status}` : body.includes('Page not found') ? null : '404 without the not-found page')),
  )
}
for (const [group, entries] of [['services', services], ['products', products]]) {
  for (const entry of entries) {
    checks.push(() =>
      expect(`/${group}/${entry.slug}`, (r) =>
        r.status === 301 && r.headers.get('location')?.endsWith(entry.path) ? null : `expected 301 to ${entry.path}, got ${r.status} ${r.headers.get('location') ?? ''}`,
      ),
    )
  }
}
for (const path of ['/sitemap.xml', '/robots.txt', '/uploads/og-image.jpg', '/uploads/logo.png', '/favicon.svg']) {
  checks.push(() => expect(path, (r) => (r.status === 200 && !r.headers.get('content-type')?.includes('text/html') ? null : `status ${r.status} ${r.headers.get('content-type')}`)))
}
checks.push(() =>
  expect('/sitemap.xml', (_, body) => {
    const urls = [...body.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1])
    const wrong = urls.filter((url) => !url.startsWith(`${origin}/`))
    return urls.length !== allRoutes.length - hidden.size ? `lists ${urls.length} URLs` : wrong.length ? `off-origin URL ${wrong[0]}` : null
  }),
)
if (production) {
  // Alternate hosts must redirect to the same path on the production origin.
  const { hostname } = new URL(origin)
  const other = hostname.startsWith('www.') ? hostname.slice(4) : `www.${hostname}`
  for (const url of [`http://${hostname}/about`, `https://${other}/about`, ...(process.env.NETLIFY_HOST ? [`https://${process.env.NETLIFY_HOST}/about`] : [])]) {
    checks.push(() =>
      expect(url, (r) => ([301, 308].includes(r.status) && r.headers.get('location') === `${origin}/about` ? null : `expected a permanent redirect to ${origin}/about, got ${r.status} ${r.headers.get('location') ?? ''}`)),
    )
  }
}

for (let i = 0; i < checks.length; i += 8) await Promise.all(checks.slice(i, i + 8).map((check) => check()))
console.log(`${checks.length - failures.length} of ${checks.length} checks passed for ${base} (${production ? 'production' : 'preview'} expectations)`)
if (failures.length) {
  console.log(failures.slice(0, 40).join('\n'))
  process.exit(1)
}
