import { aiMenu } from '../data/navigation.js'
import { products } from '../data/productCatalog.js'
import { services } from '../data/serviceCatalog.js'

// AI service pages belong to the AI tab rather than to Services.
const aiPages = new Set(aiMenu.flatMap((group) => group.links.map((link) => link.to)))
const sectionPages = {
  '/ai-machine-learning-solutions': aiPages,
  '/services': new Set(services.map((service) => service.path).filter((path) => !aiPages.has(path))),
  '/products': new Set(products.map((product) => product.path)),
}

/** aria-current for a menu link: 'page' on that page, 'true' on another page in its section. */
export function currentIn(pathname, to) {
  if (pathname === to) return 'page'
  if (to !== '/' && (pathname.startsWith(`${to}/`) || sectionPages[to]?.has(pathname))) return 'true'
  return undefined
}
