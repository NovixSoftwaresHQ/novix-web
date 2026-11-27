// Decides, from environment variables, which origin a build uses and whether it may be indexed.
// A release build is Netlify's production context, or any build run with RELEASE=1.
// Every other build is a development or preview build: it is marked noindex.
import { PROPOSED_ORIGIN } from '../src/data/siteOrigin.js'

/** Returns the normalised origin, or throws with the reason it cannot be a production origin. */
export function productionOrigin(value) {
  if (!value?.trim()) throw new Error('SITE_URL is not set')
  let url
  try {
    url = new URL(value.trim())
  } catch {
    throw new Error(`SITE_URL is not a valid URL: ${value}`)
  }
  const host = url.hostname
  if (url.protocol !== 'https:') throw new Error('SITE_URL must use https')
  if (url.pathname !== '/' || url.search || url.hash) throw new Error('SITE_URL must be an origin only, without a path, query or fragment')
  if (url.port || url.username || url.password) throw new Error('SITE_URL must not contain a port or credentials')
  if (!host.includes('.') || /^[\d.]+$/.test(host) || host.startsWith('[') || /(^|\.)(localhost|local|test|invalid|example)$/.test(host) || /(^|\.)example\.(com|org|net)$/.test(host)) {
    throw new Error(`SITE_URL is not a public hostname: ${host}`)
  }
  if (host.endsWith('.netlify.app')) throw new Error('SITE_URL must be the final domain, not a netlify.app address')
  return url.origin
}

export function resolveSiteEnv(env = process.env) {
  const release = env.CONTEXT === 'production' || env.RELEASE === '1'
  const warnings = []
  let origin
  try {
    origin = productionOrigin(env.SITE_URL)
  } catch (error) {
    if (release) {
      throw new Error(
        `Release blocked: ${error.message}. Set SITE_URL to the confirmed production origin, for example SITE_URL=${PROPOSED_ORIGIN}`,
      )
    }
    if (env.SITE_URL) warnings.push(`${error.message}; using ${PROPOSED_ORIGIN} for this non-release build`)
    origin = PROPOSED_ORIGIN
  }
  return {
    origin,
    release,
    indexable: release,
    redirectAliases: release && env.REDIRECT_ALIASES === 'true',
    netlifySiteName: env.SITE_NAME || '',
    warnings,
  }
}
