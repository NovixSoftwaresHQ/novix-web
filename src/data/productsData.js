// Page content for the product pages, keyed by slug and merged with the route catalog.
// Each theme's content is a separate download, so a visitor fetches only the group they open.
import { createGroupLoader } from '../lib/contentGroups.js'
import { productBySlug } from './productCatalog.js'

export const loadProductGroup = createGroupLoader({
  ops: () => import('./products/operations.js'),
  edu: () => import('./products/education.js'),
  care: () => import('./products/care.js'),
  portal: () => import('./products/portals.js'),
})

export const preloadProduct = (slug) => loadProductGroup(productBySlug[slug].theme)
