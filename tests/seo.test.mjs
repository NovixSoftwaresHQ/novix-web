import assert from 'node:assert/strict'
import { test } from 'node:test'
import { productionOrigin, resolveSiteEnv } from '../scripts/site-env.mjs'
import { buildHead } from '../src/seo/head.js'

test('a release build is blocked without a valid production origin', () => {
  for (const SITE_URL of [undefined, '', 'novix', 'http://novix.in', 'https://localhost', 'https://site.netlify.app', 'https://example.com', 'https://novix.in/path', 'https://127.0.0.1']) {
    assert.throws(() => resolveSiteEnv({ CONTEXT: 'production', SITE_URL }), /Release blocked/, String(SITE_URL))
    assert.throws(() => resolveSiteEnv({ RELEASE: '1', SITE_URL }), /Release blocked/, String(SITE_URL))
  }
  assert.equal(productionOrigin('https://novix.in/'), 'https://novix.in')
})

test('only a release build may be indexed', () => {
  const SITE_URL = 'https://novix.in'
  for (const CONTEXT of [undefined, 'deploy-preview', 'branch-deploy', 'dev']) {
    assert.equal(resolveSiteEnv({ CONTEXT, SITE_URL }).indexable, false)
    assert.equal(resolveSiteEnv({ CONTEXT, SITE_URL, REDIRECT_ALIASES: 'true' }).redirectAliases, false)
  }
  assert.equal(resolveSiteEnv({ CONTEXT: 'production', SITE_URL }).indexable, true)
})

const robots = (head) => head.metas.find(([, name]) => name === 'robots')[2]
const page = { title: 'A page', description: 'About it.', path: '/a' }

test('indexing follows both the page and the build', () => {
  assert.match(robots(buildHead(page, true)), /^index, follow/)
  assert.equal(robots(buildHead({ ...page, noindex: true }, true)), 'noindex, follow')
  assert.equal(robots(buildHead(page, false)), 'noindex, nofollow')
})

test('a page without a path (not found) has no canonical or structured data', () => {
  const head = buildHead({ title: 'Page not found' }, true)
  assert.equal(head.canonical, null)
  assert.equal(head.jsonLd, null)
  assert.equal(robots(head), 'noindex, follow')
})
