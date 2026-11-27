// Colours are CSS variables (see src/index.css): "Warm Ivory + Deep Teal" in light mode, charcoal + green in dark mode.
// Each utility therefore adapts to the theme by itself; no `dark:` colour variants are needed.
import plugin from 'tailwindcss/plugin'

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

/*
 * Layouts that depend on room for the text use rem widths, so that large browser text keeps the roomier layout
 * instead of overflowing. These are plugin variants on purpose: adding rem sizes to `screens`, or writing
 * min-[…rem] classes, makes Tailwind silently drop every min-* and max-* class (mixed units).
 * They are listed from narrow to wide, so a later one wins. At the default 16px `wide` equals lg.
 */
const roomVariants = plugin(({ addVariant }) => {
  addVariant('fit-xs', '@media (min-width: 20rem)')
  addVariant('fit-sm', '@media (min-width: 22.5rem)')
  addVariant('fit-md', '@media (min-width: 40rem)')
  addVariant('wide', '@media (min-width: 64rem)') // the header fits on one row
})

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: token('page'), // page background
        surface: token('surface'), // cards
        subtle: token('subtle'), // alternating sections
        heading: token('heading'), // main text
        body: token('body'), // secondary text
        edge: token('edge'), // borders
        primary: { DEFAULT: token('primary'), hover: token('primary-hover') },
        'on-primary': token('on-primary'), // text on a primary background
        tint: token('tint'), // faint accent fill
        raised: token('raised'), // hover fill for menu rows and list items
        action: { // fill of buttons, tabs and filters
          DEFAULT: token('action'),
          hover: token('action-hover'),
          edge: token('action-edge'),
          'edge-hover': token('action-edge-hover'),
        },
        'on-action': token('on-action'),
        'edge-hover': token('edge-hover'),
        'control-edge': token('control-edge'),
        danger: token('danger'),
        ink: '#182321', // fixed dark neutral for overlays and inverse panels
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: { page: '80rem' },
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow-color) / .04), 0 4px 16px -8px rgb(var(--shadow-color) / .08)',
        lift: '0 18px 40px -24px rgb(var(--shadow-color) / .28), 0 8px 18px -14px rgb(var(--shadow-color) / .18)',
      },
      // control: buttons, fields, icon tiles. card: cards and menus. panel: banners and dialogs.
      borderRadius: { control: '0.5rem', card: '0.75rem', panel: '1rem' },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(to right, rgb(var(--edge) / .5) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--edge) / .5) 1px, transparent 1px)',
        dots: 'radial-gradient(rgb(var(--primary) / .16) 1px, transparent 1px)',
      },
      backgroundSize: { grid: '56px 56px' },
    },
  },
  plugins: [roomVariants],
}
