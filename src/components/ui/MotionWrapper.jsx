import { createContext, useContext } from 'react'
import SectionReveal from './SectionReveal.jsx'

// Easing for the Framer Motion transitions elsewhere (menus, dialog, drawer).
export const EASE = [0.22, 1, 0.36, 1]

// True inside <Stagger immediate>, whose children are animated by CSS instead.
const CssStagger = createContext(false)

/**
 * Groups <StaggerItem> children. Each is revealed as it is scrolled to, and items that arrive together
 * follow one another. `immediate` is for above-the-fold content: it animates on load with CSS (.rise-group).
 */
export function Stagger({ as: Element = 'div', delay = 0, immediate = false, className = '', children, ...props }) {
  return (
    <CssStagger.Provider value={immediate}>
      <Element
        className={immediate ? `rise-group ${className}` : className}
        style={immediate && delay ? { '--rise-delay': `${delay}s` } : undefined}
        {...props}
      >
        {children}
      </Element>
    </CssStagger.Provider>
  )
}

export function StaggerItem({ as = 'div', children, ...props }) {
  const css = useContext(CssStagger)
  if (css) {
    const Element = as
    return <Element {...props}>{children}</Element>
  }
  return (
    <SectionReveal as={as} {...props}>
      {children}
    </SectionReveal>
  )
}
