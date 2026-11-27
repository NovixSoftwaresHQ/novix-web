// Used only at build time by scripts/prerender.mjs.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { preloadRoute } from './routes/routeTable.js'
import { HeadContext } from './hooks/usePageMeta.js'

export { allRoutes } from './data/siteRoutes.js'
export { products } from './data/productCatalog.js'
export { services } from './data/serviceCatalog.js'
export { company } from './data/companyData.js'

export async function render(path) {
  await preloadRoute(path)
  const head = {}
  const html = renderToString(
    <HeadContext.Provider value={head}>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </HeadContext.Provider>,
  )
  return { html, head }
}
