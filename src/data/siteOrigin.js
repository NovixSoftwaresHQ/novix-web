// The one place the production origin is defined.
// PROPOSED_ORIGIN is the domain named in the README. It becomes the release origin only when the owner
// confirms it by setting SITE_URL (see scripts/site-env.mjs and NETLIFY-SEO-LAUNCH.md).
export const PROPOSED_ORIGIN = 'https://novixsoftwares.com'

// __SITE_ORIGIN__ and __SITE_INDEXABLE__ are set by vite.config.js. Plain Node (tests, scripts) has neither.
export const SITE_ORIGIN = typeof __SITE_ORIGIN__ === 'string' ? __SITE_ORIGIN__ : PROPOSED_ORIGIN
export const SITE_INDEXABLE = typeof __SITE_INDEXABLE__ === 'boolean' ? __SITE_INDEXABLE__ : false
