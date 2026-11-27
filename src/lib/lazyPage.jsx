import { lazy, useState } from 'react'

/**
 * React.lazy with preload(). Once preloaded, the page renders synchronously, which the
 * prerender step needs and which lets hydration reuse the server HTML without a fallback.
 */
export function lazyPage(load) {
  let Loaded = null
  const remember = (module) => {
    Loaded = module.default
    return module
  }
  const Lazy = lazy(() => load().then(remember))

  function Page(props) {
    // Fixed per mount, so a later preload never swaps the component type and resets page state.
    const [Component] = useState(() => Loaded ?? Lazy)
    return <Component {...props} />
  }
  Page.preload = () => load().then(remember)
  return Page
}
