// The pages that load on demand. Kept apart from the route table, so that editing content never recreates them:
// a recreated page would be mounted again, and the reader would lose their place.
import { lazyPage } from '../lib/lazyPage.jsx'

export const AboutPage = lazyPage(() => import('../pages/AboutPage.jsx'))
export const BlogPage = lazyPage(() => import('../pages/BlogPage.jsx'))
export const ContactPage = lazyPage(() => import('../pages/ContactPage.jsx'))
export const LegalPage = lazyPage(() => import('../pages/LegalPage.jsx'))
export const PortfolioPage = lazyPage(() => import('../pages/PortfolioPage.jsx'))
export const ProductsOverviewPage = lazyPage(() => import('../pages/ProductsOverviewPage.jsx'))
export const ServicesOverviewPage = lazyPage(() => import('../pages/ServicesOverviewPage.jsx'))
export const ServiceDetailPage = lazyPage(() => import('../pages/ServiceDetailPage.jsx'))
export const ProductDetailPage = lazyPage(() => import('../pages/ProductDetailPage.jsx'))
