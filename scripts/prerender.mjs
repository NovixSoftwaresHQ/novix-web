// Turns the built app into one HTML file per route, with that page's own content and head tags,
// then writes sitemap.xml, robots.txt, _redirects and (for non-release builds) _headers.
// Output is flat (dist/about.html) so that Netlify serves /about at the same URL the live site uses.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveSiteEnv } from './site-env.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const site = resolveSiteEnv()
const { render, allRoutes, services, products, company } = await import(`${root}dist-ssr/entry-server.js`)
const template = readFileSync(`${root}dist/index.html`, 'utf8')

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// "<" is escaped so that page text can never close the script element.
const jsonLd = (data) => `<script type="application/ld+json" data-seo>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const headTags = (head) => [
  ...head.metas.map(([attribute, name, content]) => `<meta ${attribute}="${name}" content="${escape(content)}" data-seo />`),
  ...(head.canonical ? [`<link rel="canonical" href="${head.canonical}" />`] : []),
  ...(head.jsonLd ? [jsonLd(head.jsonLd)] : []),
]

function document_(html, head, prerendered) {
  let page = template
  const replace = (pattern, value) => {
    if (!pattern.test(page)) throw new Error(`index.html is missing ${pattern}`)
    page = page.replace(pattern, () => value)
  }
  replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(head.title)}</title>`)
  replace(/\s*<meta name="description"[^>]*\/>/, '')
  replace(/<\/head>/, `    ${headTags(head).join('\n    ')}\n  </head>`)
  replace(/<div id="root"><\/div>/, `<div id="root"${prerendered ? ` data-prerendered="${prerendered}"` : ''}>${html}</div>`)
  return page
}

function write(file, contents) {
  mkdirSync(dirname(`${root}dist/${file}`), { recursive: true })
  writeFileSync(`${root}dist/${file}`, contents)
}

const paths = allRoutes.map((route) => route.path)
if (new Set(paths).size !== paths.length) throw new Error('Two routes share a path')

const indexable = []
const summaries = new Map()
for (const path of paths) {
  const { html, head } = await render(path)
  const headings = html.match(/<h1[\s>]/g)?.length ?? 0
  // Fail the build rather than publish an empty or wrong page.
  if (headings !== 1 || head.path !== path || !head.title || !head.description) {
    throw new Error(`Prerender failed for ${path}: ${headings} <h1>, head.path=${head.path}`)
  }
  if (!head.noindex) {
    indexable.push(path)
    summaries.set(path, head)
  }
  write(path === '/' ? 'index.html' : `${path.slice(1)}.html`, document_(html, head, path))
}

// Netlify serves dist/404.html, with status 404, for any URL without a file.
const missing = await render('/__not-found__')
write('404.html', document_(missing.html, missing.head))

// No <lastmod>: the content files do not record real change dates.
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((path) => `  <url><loc>${escape(company.siteUrl + path)}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
)

// Preview builds stay crawlable on purpose: a crawler has to fetch a page to see its noindex.
write(
  'robots.txt',
  `User-agent: *
Allow: /

# AI search, assistant and training crawlers are welcome.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

# Slow down third-party SEO tool crawlers
User-agent: AhrefsBot
User-agent: SemrushBot
Allow: /
Crawl-delay: 10

Sitemap: ${company.siteUrl}/sitemap.xml
`,
)

// llms.txt is a plain-text page list for AI tools. It is an informal convention: search engines do not require it.
const line = (path) => `- [${summaries.get(path).title}](${company.siteUrl + path}): ${summaries.get(path).description}`
const section = (title, list) => `## ${title}\n\n${list.filter((path) => summaries.has(path)).map(line).join('\n')}\n`
const servicePaths = services.map((entry) => entry.path)
const productPaths = products.map((entry) => entry.path)
const listed = new Set([...servicePaths, ...productPaths])
write(
  'llms.txt',
  [
    `# ${company.name}\n\n> ${summaries.get('/').description}\n\nContact: ${company.email}, ${company.phones[0].label}\n`,
    section('Company', indexable.filter((path) => !listed.has(path))),
    section('Services', servicePaths),
    section('Products', productPaths),
  ].join('\n'),
)

const aliases = [
  ...services.map((entry) => `/services/${entry.slug}  ${entry.path}  301`),
  ...products.map((entry) => `/products/${entry.slug}  ${entry.path}  301`),
]

// Alternate production hosts, once the owner has connected the domain and set REDIRECT_ALIASES=true.
// The rules name exact hosts, so Deploy Previews and branch deploys are never redirected.
const hostRules = []
if (site.redirectAliases) {
  const { hostname } = new URL(site.origin)
  const alternates = [hostname.startsWith('www.') ? hostname.slice(4) : `www.${hostname}`]
  if (site.netlifySiteName) alternates.push(`${site.netlifySiteName}.netlify.app`)
  else console.warn('REDIRECT_ALIASES is set but SITE_NAME is not, so there is no netlify.app redirect')
  for (const host of alternates) {
    for (const scheme of ['https', 'http']) hostRules.push(`${scheme}://${host}/*  ${site.origin}/:splat  301!`)
  }
}
write('_redirects', `# Generated by scripts/prerender.mjs\n${[...hostRules, ...aliases].join('\n')}\n`)
if (!site.indexable) write('_headers', '# Not a release build: keep it out of search results.\n/*\n  X-Robots-Tag: noindex, nofollow\n')

rmSync(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`prerendered ${paths.length} routes + 404.html; ${indexable.length} in sitemap; ${aliases.length} path redirects, ${hostRules.length} host redirects`)
console.log(
  site.indexable
    ? `RELEASE build for ${site.origin}`
    : `NON-RELEASE build: every page is noindex. Canonical URLs use ${site.origin}. Do not publish this as the production site.`,
)
for (const warning of site.warnings) console.warn(`WARNING: ${warning}`)
