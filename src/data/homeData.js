// Home page copy. Safe to edit by hand.
import { Brain, Code2, Contact, FileSignature, Globe, KeyRound, Layers, LifeBuoy, MonitorUp, School, Smartphone } from 'lucide-react'
import { portfolio } from './portfolioData.js'

export const homeMeta = {
  title: 'Custom Software Development | Novix Softwares',
  description:
    'Novix Softwares builds custom software, web applications and business automation tools. Tell us what you need and discuss your project with our team.',
}

export const hero = {
  eyebrow: 'Software development company in India',
  title: 'Custom software for',
  highlight: 'the way your business works.',
  description:
    "We build web and mobile applications, business systems and AI automation around your team's needs. We work with startups, small firms and established businesses.",
  secondary: { label: 'Explore services', to: '/services' },
}

// Smaller WebP copies of portfolio screenshots. The first one is the large image in front.
export const heroShots = {
  caption: 'Websites from our portfolio.',
  link: { label: 'See all projects', to: '/portfolio' },
  images: [
    { src: '/portfolio/thumbs/magtechprocessinc-800.webp', width: 800, height: 600, alt: 'Home page of the Magtech Process Equipments website' },
    { src: '/portfolio/thumbs/blastdrive-560.webp', width: 560, height: 420, alt: 'Home page of the Blastdrive Securities website' },
    { src: '/portfolio/thumbs/roonrent-560.webp', width: 560, height: 420, alt: 'Home page of the Ro Rent website' },
  ],
}

export const trustPoints = [
  { title: 'Clear scope', text: 'Scope and milestones set out before we build', icon: FileSignature },
  { title: 'Regular demos', text: 'Try working software while it is being built', icon: MonitorUp },
  { title: 'Code ownership', text: 'Source code handed over as agreed', icon: KeyRound },
  { title: 'Agreed support', text: 'Help after launch, on agreed terms', icon: LifeBuoy },
]

export const services = {
  eyebrow: 'Services',
  title: 'Software we build for your business',
  description: 'Four main areas. Each page explains what is included and how we approach it.',
  cards: [
    { title: 'Custom Software', text: 'Business systems, internal tools and SaaS products shaped around how your team works.', link: 'Custom software development', to: '/custom-software-development-company-in-india', icon: Code2 },
    { title: 'Web Development', text: 'Company websites, online shops, customer portals and reporting dashboards.', link: 'Web development services', to: '/website-development-company-in-india', icon: Globe },
    { title: 'Mobile Apps', text: 'Apps for Android and iPhone, built natively or from one shared codebase.', link: 'Mobile app development', to: '/mobile-app-development-company-in-india', icon: Smartphone },
    { title: 'AI & Automation', text: 'Chatbots, AI agents and automation for work your team repeats by hand.', link: 'AI software and automation', to: '/custom-ai-software-development', icon: Brain },
  ],
  moreLabel: 'We also offer:',
  more: [
    { label: 'Cloud migration', to: '/cloud-migration-services' },
    { label: 'UI/UX and web design', to: '/custom-web-design-agency-in-india' },
    { label: 'Digital marketing', to: '/digital-marketing-agency-in-india' },
  ],
  all: { label: 'View all services', to: '/services' },
  readyMade: { text: 'Looking for ready-made software instead?', label: 'Browse our products', to: '/products' },
}

const project = (domain) => {
  const found = portfolio.projects.find((entry) => entry.domain === domain)
  if (!found) throw new Error(`Featured project missing from portfolioData.js: ${domain}`)
  return { name: found.name, category: found.category, url: found.url }
}

// Describe only what can be seen on the live site. Add results only when they are documented.
export const selectedWork = {
  eyebrow: 'Selected work',
  title: 'Two live websites from our portfolio',
  description: 'Open them and try them for yourself.',
  link: { label: 'See the full portfolio', to: '/portfolio' },
  items: [
    {
      ...project('tanyalibrary.com'),
      image: '/portfolio/thumbs/tanyalibrary-800.webp',
      imageAlt: 'Home page of the Tanya Reading Library website, with a button to register and book a seat',
      purpose: 'Let students join a study library and book a seat online.',
      built: 'A website with online admission, a choice of branch, shift and seat booking, and the library’s shift plans.',
      status: 'Live website',
    },
    {
      ...project('karsarspares.com'),
      image: '/portfolio/thumbs/karsarspares-800.webp',
      imageAlt: 'Home page of the Karsar Spares website for a lift and escalator parts supplier',
      purpose: 'Help buyers find lift and escalator parts from a supplier in the UAE.',
      built: 'A product catalogue arranged by category, with featured parts and a way to request a quote.',
      status: 'Live website',
    },
  ],
}

// Confirm each product is ready to offer before listing it here. Add a demo link only when a demo works.
export const readyMade = {
  eyebrow: 'Ready-made products',
  title: 'Adapt a product, or build your own',
  choices: [
    { title: 'Adapt a ready-made product', text: 'Start from software made for a common job, then set it up around your workflow, records and reports.' },
    { title: 'Commission custom software', text: 'When no ready product fits, we design and build something new around your process.' },
  ],
  items: [
    { title: 'CRM software', text: 'Track every lead, call and follow-up.', link: 'See the CRM', to: '/crm-software', icon: Contact },
    { title: 'ERP software', text: 'One system for purchases, sales, stock and accounts.', link: 'See the ERP', to: '/erp-software', icon: Layers },
    { title: 'School management system', text: 'Manage admissions, fee payments, attendance and exams.', link: 'See the school system', to: '/school-management-system', icon: School },
  ],
  all: { label: 'View all products', to: '/products' },
  custom: { label: 'About custom development', to: '/custom-software-development-company-in-india' },
}

export const processSection = {
  eyebrow: 'How we work',
  title: 'Four stages from first conversation to launch',
  link: { label: 'How we work with you, in more detail', to: '/about#working-with-us' },
}

export const faqs = [
  { question: 'How long will my project take?', answer: 'It depends on the scope: the features, the kinds of users, the systems it must connect to and any data to move. We agree a timeline with you once the scope is clear, before building starts.' },
  { question: 'How do you estimate the cost?', answer: 'From what the software needs to do: its features, who will use it, the systems it connects to and the data it works with. You get the estimate together with the scope, before work begins.' },
  { question: 'Who owns the source code?', answer: 'We hand over the source code and documentation as agreed for your project, so the software can be maintained and developed further. Tell us what you need to own, and we will agree it with you before work starts.' },
  { question: 'What support is available after launch?', answer: 'Support is agreed for each project. It can cover bug fixes, security updates, backups, monitoring and small improvements. Larger new features are planned as separate work.' },
]

// The closing call to action. Home and About use it as it is.
export const closingCta = {
  title: 'Tell us what you want to improve',
  text: 'Share the process, product idea or system you have in mind, and we will talk through a sensible way to build it.',
}
