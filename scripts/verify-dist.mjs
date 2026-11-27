// Checks the built site for SEO regressions. Runs at the end of every build and fails it on a problem.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { archives } from '../src/data/archivesData.js'
import { allRoutes } from '../src/data/siteRoutes.js'
import { ENQUIRY_FIELDS, FORM_NAME } from '../src/lib/submitLead.js'
import { resolveSiteEnv } from './site-env.mjs'

const dist = fileURLToPath(new URL('../dist', import.meta.url))
const site = resolveSiteEnv()
const failures = []
const fail = (path, problem) => failures.push(`${path}: ${problem}`)
const read = (file) => readFileSync(`${dist}/${file}`, 'utf8')
const decode = (value) => value.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'").replace(/&amp;/g, '&')
const all = (html, pattern) => [...html.matchAll(pattern)].map((match) => decode(match[1]))

const routes = allRoutes.map((route) => route.path)
const known = new Set(routes)
const hidden = new Set(archives.map((route) => route.path))
const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`)

// Every built page must belong to a route, so nothing is published by accident.
const built = readdirSync(dist, { recursive: true }).filter((file) => file.endsWith('.html'))
const expected = new Set([...routes.map(fileFor), '404.html', '__forms.html'])
for (const file of built) if (!expected.has(file)) fail(file, 'HTML file with no route')

// Netlify learns the enquiry form from this file when it deploys, and drops any field the file does not list.
const blueprint = built.includes('__forms.html') ? read('__forms.html') : ''
if (!new RegExp(`<form name="${FORM_NAME}"[^>]*data-netlify="true"`).test(blueprint)) fail('__forms.html', `must declare the Netlify form "${FORM_NAME}"`)
for (const field of ['form-name', ...ENQUIRY_FIELDS]) if (!blueprint.includes(`name="${field}"`)) fail('__forms.html', `does not list the field "${field}"`)
if (!/<meta name="robots" content="noindex/.test(blueprint)) fail('__forms.html', 'must be noindex')

const seen = { title: new Map(), description: new Map() }
const linked = new Set()
for (const path of routes) {
  if (!existsSync(`${dist}/${fileFor(path)}`)) {
    fail(path, 'no HTML file')
    continue
  }
  const html = read(fileFor(path))
  const one = (label, values) => {
    if (values.length !== 1 || !values[0]) fail(path, `expected one ${label}, found ${values.length}`)
    return values[0]
  }
  const title = one('title', all(html, /<title>([^<]*)<\/title>/g))
  const description = one('meta description', all(html, /<meta name="description" content="([^"]*)"/g))
  const canonical = one('canonical', all(html, /<link rel="canonical" href="([^"]*)"/g))
  const robots = one('robots meta', all(html, /<meta name="robots" content="([^"]*)"/g)) ?? ''
  one('<h1>', all(html, /<(h1)[\s>]/g))
  if (canonical !== site.origin + path) fail(path, `canonical is ${canonical}`)

  const wantsNoindex = !site.indexable || hidden.has(path)
  if (robots.includes('noindex') !== wantsNoindex) fail(path, `unexpected robots value "${robots}" for a ${site.release ? 'release' : 'non-release'} build`)
  if (!hidden.has(path)) {
    for (const [label, value] of [['title', title], ['description', description]]) {
      if (seen[label].has(value)) fail(path, `same ${label} as ${seen[label].get(value)}`)
      seen[label].set(value, path)
    }
  }

  for (const [name, content] of [...html.matchAll(/<meta (?:name|property)="((?:og|twitter):(?:url|image))" content="([^"]*)"/g)].map((m) => [m[1], m[2]])) {
    if (!content.startsWith(`${site.origin}/`)) fail(path, `${name} is not on the production origin: ${content}`)
    else if (name.endsWith('image') && !existsSync(dist + content.slice(site.origin.length))) fail(path, `${name} file is missing`)
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  if (blocks.length !== 1) fail(path, `expected one JSON-LD block, found ${blocks.length}`)
  for (const [, source] of blocks) {
    try {
      const graph = JSON.parse(source)['@graph']
      const ids = new Set(graph.map((node) => node['@id']))
      // Every reference to another node on the page must resolve.
      const check = (value) => {
        if (!value || typeof value !== 'object') return
        const keys = Object.keys(value)
        if (keys.length === 1 && keys[0] === '@id' && !ids.has(value['@id'])) fail(path, `JSON-LD reference to missing ${value['@id']}`)
        Object.values(value).forEach(check)
      }
      check(graph)
      for (const node of graph) {
        for (const forbidden of ['aggregateRating', 'review', 'offers']) if (forbidden in node) fail(path, `JSON-LD has ${forbidden}, which nothing on the site supports`)
        // FAQ answers in markup must be the visible ones.
        if (node['@type'] === 'FAQPage') {
          const text = decode(html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, ''))
          for (const question of node.mainEntity) if (!text.includes(question.name)) fail(path, `FAQ question is not on the page: ${question.name}`)
        }
      }
    } catch (error) {
      fail(path, `JSON-LD does not parse: ${error.message}`)
    }
  }

  for (const href of all(html, /<a [^>]*?href="(\/[^"]*)"/g)) {
    const [target, anchor] = href.split('#')
    const clean = target.split('?')[0] || path
    if (known.has(clean)) {
      if (clean !== path) linked.add(clean)
      if (anchor && !read(fileFor(clean)).includes(`id="${anchor}"`)) fail(path, `link to missing anchor ${href}`)
    } else if (/^\/(services|products)\//.test(clean)) fail(path, `link goes through a redirect: ${href}`)
    else if (!existsSync(dist + clean)) fail(path, `broken link ${href}`)
  }
}
for (const path of routes) if (path !== '/' && !linked.has(path)) fail(path, 'orphan: no other page links to it')

const listed = all(read('sitemap.xml'), /<loc>([^<]*)<\/loc>/g)
const wanted = routes.filter((path) => !hidden.has(path)).map((path) => site.origin + path)
if (new Set(listed).size !== listed.length) fail('sitemap.xml', 'duplicate URLs')
for (const url of wanted) if (!listed.includes(url)) fail('sitemap.xml', `missing ${url}`)
for (const url of listed) if (!wanted.includes(url)) fail('sitemap.xml', `should not list ${url}`)

const robotsTxt = read('robots.txt')
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) fail('robots.txt', 'blocks the whole site')
if (!robotsTxt.includes(`Sitemap: ${site.origin}/sitemap.xml`)) fail('robots.txt', 'sitemap line does not match the origin')
if (existsSync(`${dist}/_headers`) === site.indexable) fail('_headers', site.indexable ? 'a release must not send X-Robots-Tag: noindex' : 'a non-release build must send X-Robots-Tag: noindex')
if (!/<meta name="robots" content="noindex/.test(read('404.html'))) fail('404.html', 'must be noindex')
if (/<link rel="canonical"/.test(read('404.html'))) fail('404.html', 'must not have a canonical URL')

if (failures.length) {
  console.error(`SEO verification failed (${failures.length}):\n${failures.slice(0, 60).join('\n')}`)
  process.exit(1)
}
console.log(`SEO verification passed: ${routes.length} routes, ${listed.length} sitemap URLs, ${site.release ? 'release' : 'non-release'} build`)
