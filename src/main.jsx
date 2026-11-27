import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { keepReadingPosition } from './lib/keepReadingPosition.js'
import { preloadRoute } from './routes/routeTable.js'
import './index.css'

// Development only, left out of the built site: keeps your place if the dev server has to reload the page.
if (import.meta.env.DEV) keepReadingPosition()
// preloadRoute is only needed at start-up, so a changed route table needs nothing here (App.jsx picks it up).
if (import.meta.hot) import.meta.hot.accept('./routes/routeTable.js', () => {})

const container = document.getElementById('root')
const path = window.location.pathname.replace(/(.)\/+$/, '$1')

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

preloadRoute(path)
  .catch(() => {}) // if the page chunk fails to load here, React retries while rendering
  .then(() => {
    // Hydrate only when the prerendered HTML belongs to this URL; otherwise (404 page, dev) render fresh.
    if (container.dataset.prerendered === path) hydrateRoot(container, app)
    else createRoot(container).render(app)
  })
