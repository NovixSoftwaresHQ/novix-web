// The seven service themes from the live site, re-expressed in the new design language.
const grid = 'bg-grid-lines bg-grid opacity-70 [mask-image:linear-gradient(#000_40%,transparent)]'
const dots = 'bg-dots [background-size:22px_22px] [mask-image:linear-gradient(#000_40%,transparent)]'
const wash = 'bg-gradient-to-b from-subtle to-transparent'
const card = 'overflow-hidden rounded-card border border-edge bg-surface shadow-card'

export const heroThemes = {
  software: { layout: 'split', pattern: grid, frame: `${card} border-t-2 !border-t-primary`, panel: '' },
  cloud: { layout: 'split', pattern: wash, frame: `${card} !rounded-panel`, panel: '' },
  web: { layout: 'split', pattern: dots, frame: card, chrome: 'browser', panel: '' },
  mobile: { layout: 'reversed', pattern: wash, frame: `${card} mx-auto w-full max-w-md !rounded-[40px] !border-4`, chrome: 'phone', panel: '' },
  ai: { layout: 'split', pattern: dots, frame: `${card} !rounded-panel !border-primary/30`, panel: '' },
  design: { layout: 'centered', pattern: wash, frame: `${card} !rounded-panel`, panel: '' },
  marketing: { layout: 'split', pattern: grid, frame: card, panel: 'lg:rounded-panel lg:bg-ink lg:p-5 dark:lg:bg-subtle' },
}
