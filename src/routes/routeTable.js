// Which page each address shows. Deliberately not in App.jsx: the dev server cannot update a file in place when it
// exports other things besides a component, so every content change reloaded the whole page.
import { archives } from '../data/archivesData.js'
import { articles, legalRoutes } from '../data/contentRoutes.js'
import { products } from '../data/productCatalog.js'
import { preloadProduct } from '../data/productsData.js'
import { services } from '../data/serviceCatalog.js'
import { preloadService } from '../data/servicesData.js'
import {
  AboutPage,
  BlogPage,
  ContactPage,
  LegalPage,
  PortfolioPage,
  ProductDetailPage,
  ProductsOverviewPage,
  ServiceDetailPage,
  ServicesOverviewPage,
} from './lazyPages.js'

// One table drives both the router and preloading: [path, page component, props].
export const pages = [
  ['/about', AboutPage],
  ['/services', ServicesOverviewPage],
  ['/products', ProductsOverviewPage],
  ['/portfolio', PortfolioPage],
  ['/blog', BlogPage],
  ['/contact', ContactPage],
  ...services.map((s) => [s.path, ServiceDetailPage, { slug: s.slug }]),
  ...products.map((p) => [p.path, ProductDetailPage, { slug: p.slug }]),
  ...[...articles, ...archives].map((route) => [route.path, BlogPage, { route }]),
  ...legalRoutes.map((route) => [route.path, LegalPage, { route }]),
]
const pageByPath = new Map(pages.map(([path, Page, props]) => [path, { Page, props }]))

/** Loads the code for a path before it is rendered (prerender and first page load). */
export const preloadRoute = (path) => {
  const page = pageByPath.get(path)
  if (!page) return Promise.resolve()
  const { Page, props } = page
  const content = Page === ServiceDetailPage ? preloadService(props.slug) : Page === ProductDetailPage ? preloadProduct(props.slug) : null
  return Promise.all([Page.preload(), content])
}
