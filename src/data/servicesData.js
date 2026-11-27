// Page content for the service pages, keyed by slug and merged with the route catalog.
// Each theme's content is a separate download, so a visitor fetches only the group they open.
import { createGroupLoader } from '../lib/contentGroups.js'
import { serviceBySlug } from './serviceCatalog.js'

export const loadServiceGroup = createGroupLoader({
  software: () => import('./services/software.js'),
  cloud: () => import('./services/cloud.js'),
  ai: () => import('./services/ai.js'),
  web: () => import('./services/web.js'),
  mobile: () => import('./services/mobile.js'),
  marketing: () => import('./services/marketing.js'),
  design: () => import('./services/design.js'),
})

export const preloadService = (slug) => loadServiceGroup(serviceBySlug[slug].theme)
