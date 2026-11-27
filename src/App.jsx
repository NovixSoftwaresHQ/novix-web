import { MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout.jsx'
import { ConsultationProvider } from './context/ConsultationContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { productBySlug } from './data/productCatalog.js'
import { serviceBySlug } from './data/serviceCatalog.js'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
// Export only the App component from this file; see routes/routeTable.js.
import { pages } from './routes/routeTable.js'

/**
 * /services/:slug and /products/:slug redirect to the canonical root-level URL.
 * On Netlify the same redirects are real 301s (see scripts/prerender.mjs); this covers in-app navigation.
 */
function CatalogAlias({ lookup }) {
  const { slug } = useParams()
  const entry = Object.hasOwn(lookup, slug) ? lookup[slug] : null
  return entry ? <Navigate to={entry.path} replace /> : <NotFoundPage />
}

/** The router is supplied by the caller: BrowserRouter in the browser, StaticRouter when prerendering. */
export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ConsultationProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              {/* keys force a remount so page state never leaks between routes sharing a template */}
              {pages.map(([path, Page, props]) => <Route key={path} path={path} element={<Page key={path} {...props} />} />)}
              <Route path="services/:slug" element={<CatalogAlias lookup={serviceBySlug} />} />
              <Route path="products/:slug" element={<CatalogAlias lookup={productBySlug} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ConsultationProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
