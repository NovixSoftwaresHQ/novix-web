// Main, article and legal routes. Article previews here also feed the homepage.
export const mainRoutes = [
  { path: '/', title: 'Home' },
  { path: '/about', title: 'About' },
  { path: '/services', title: 'Services' },
  { path: '/products', title: 'Products' },
  { path: '/portfolio', title: 'Portfolio' },
  { path: '/blog', title: 'Blog' },
  { path: '/contact', title: 'Contact' },
]

export const articles = [
  {
    path: '/blog/autonomous-ai-agents-conversational-copilots-enterprise',
    title: 'How to Plan AI Agents and Copilots for Business Systems',
    category: 'AI & Automation',
    date: '2026-11-03',
    dateLabel: 'Nov 3, 2026',
    excerpt:
      'A comprehensive engineering guide on designing multi-agent AI ecosystems, secure retrieval-augmented generation (RAG) pipelines, and continuous vector synchronization for modern enterprises.',
  },
  {
    path: '/blog/custom-plumbing-crm-field-service-management',
    title: 'Building a Plumbing CRM and Field Service Platform for US Home Service Firms',
    category: 'CRM & Enterprise ERP Systems',
    date: '2026-11-03',
    dateLabel: 'Nov 3, 2026',
    excerpt:
      'Explore how specialized trade contractors in the US are replacing off-the-shelf tools like ServiceTitan, Housecall Pro, and Jobber with custom CRM architectures built for real-time dispatching, automated lead routing, and higher job margins.',
  },
]

export const legalRoutes = [
  { path: '/privacy-policy', title: 'Privacy Policy' },
  { path: '/terms-and-conditions', title: 'Terms & Conditions' },
]
