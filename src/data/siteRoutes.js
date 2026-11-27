// Single registry of all 121 HTML routes.
import { archives } from './archivesData.js'
import { articles, legalRoutes, mainRoutes } from './contentRoutes.js'
import { products } from './productCatalog.js'
import { services } from './serviceCatalog.js'

export const allRoutes = [...mainRoutes, ...services, ...products, ...articles, ...archives, ...legalRoutes]
