// Header and footer link trees from the audit.
import { Bot, Briefcase, Building2, Code2, Globe, Megaphone, MonitorSmartphone, PenTool, Settings2, Sparkles, Workflow } from 'lucide-react'

export const serviceMenu = [
  {
    title: "Software Development",
    icon: Code2,
    links: [
      { label: "Custom software development", to: "/custom-software-development-company-in-india" },
      { label: "Digital transformation", to: "/digital-transformation-services" },
      { label: "Legacy system modernisation", to: "/legacy-system-modernisation-services" },
      { label: "Cloud migration", to: "/cloud-migration-services" },
      { label: "Workflow automation", to: "/workflow-automation-services" },
      { label: "Technology audit & roadmap", to: "/technology-audit-roadmap-services" },
      { label: "Hire dedicated developers", to: "/hire-dedicated-developers" },
    ],
  },
  {
    title: "Web & Mobile",
    icon: MonitorSmartphone,
    links: [
      { label: "Web development", to: "/website-development-company-in-india" },
      { label: "E-commerce development", to: "/ecommerce-website-development-company-in-india" },
      { label: "Customer & client portals", to: "/custom-portal-development" },
      { label: "Enterprise dashboards", to: "/enterprise-dashboard-development" },
      { label: "Mobile app development", to: "/mobile-app-development-company-in-india" },
      { label: "On-demand delivery apps", to: "/on-demand-delivery-app-development" },
      { label: "Android app development", to: "/android-app-development-company" },
      { label: "PHP development", to: "/php-development-company" },
      { label: "WordPress development", to: "/wordpress-development-company-in-india" },
      { label: "Joomla development", to: "/joomla-development-company" },
      { label: "Interspire development", to: "/interspire-development-company" },
    ],
  },
  {
    title: "SaaS & AI",
    icon: Sparkles,
    links: [
      { label: "Custom AI software", to: "/custom-ai-software-development" },
      { label: "AI website integration", to: "/ai-website-integration-services" },
      { label: "SaaS & cloud platforms", to: "/saas-application-development" },
      { label: "Subscription management", to: "/subscription-management-software-development" },
      { label: "Marketing automation", to: "/marketing-automation-solutions" },
      { label: "AI & automation", to: "/ai-machine-learning-solutions" },
      { label: "AI chatbots & assistants", to: "/ai-chatbot-development-company" },
      { label: "AI agent development", to: "/ai-agent-development-services" },
      { label: "Demand forecasting", to: "/demand-forecasting-ai-software" },
      { label: "Fraud detection", to: "/fraud-detection-software-solutions" },
    ],
  },
  {
    title: "Digital Marketing",
    icon: Megaphone,
    links: [
      { label: "Digital marketing", to: "/digital-marketing-agency-in-india" },
      { label: "SEO services", to: "/best-seo-company-in-india" },
      { label: "PPC advertising", to: "/ppc-services-agency-in-india" },
      { label: "Social media marketing", to: "/social-media-marketing-agency" },
      { label: "Social media packages", to: "/social-media-marketing-packages" },
      { label: "Content marketing", to: "/content-marketing-agency" },
      { label: "Content writing", to: "/content-writing-services" },
      { label: "Web analytics", to: "/web-analytics-services" },
      { label: "Reputation management", to: "/online-reputation-management-services" },
    ],
  },
  {
    title: "Design",
    icon: PenTool,
    links: [
      { label: "Website design", to: "/website-redesign-services" },
      { label: "Responsive websites", to: "/responsive-web-design-services" },
      { label: "Graphic design", to: "/graphic-design-services" },
      { label: "Logo design", to: "/logo-design-services" },
    ],
  },
]

export const productMenu = [
  {
    title: "Business Software",
    icon: Briefcase,
    links: [
      { label: "CRM software", to: "/crm-software" },
      { label: "ERP software", to: "/erp-software" },
      { label: "Enterprise software", to: "/enterprise-software-development" },
      { label: "Billing software", to: "/billing-software" },
      { label: "GST software", to: "/billing-gst-software" },
      { label: "Inventory management", to: "/inventory-management-software" },
      { label: "HR & payroll", to: "/hr-payroll-software" },
      { label: "Vendor & contract management", to: "/vendor-contract-management-software" },
    ],
  },
  {
    title: "Industry Solutions",
    icon: Building2,
    links: [
      { label: "School management ERP", to: "/school-management-system" },
      { label: "School & college ERP", to: "/school-college-erp-software" },
      { label: "E-learning & online tests", to: "/e-learning-software" },
      { label: "Doctor & patient booking", to: "/doctor-patient-booking-system" },
      { label: "Construction software", to: "/construction-management-software" },
      { label: "Tender management", to: "/tender-procurement-software" },
      { label: "Field service management", to: "/field-service-management-software" },
    ],
  },
  {
    title: "Operations",
    icon: Settings2,
    links: [
      { label: "Project management system", to: "/project-management-system" },
      { label: "Recruitment software", to: "/recruitment-management-software" },
      { label: "Security management", to: "/visitor-security-management-software" },
      { label: "Mass e-mail (PMS)", to: "/mass-email-marketing-software" },
      { label: "OMR solution", to: "/omr-sheet-checker-software" },
      { label: "Digify IVR machine", to: "/smart-ivr-telephony-system" },
    ],
  },
  {
    title: "Web Portals",
    icon: Globe,
    links: [
      { label: "News & classified portals", to: "/news-classified-portal-development" },
      { label: "Property portal", to: "/real-estate-property-portal-development" },
      { label: "Matrimonial portal", to: "/matrimonial-portal-development" },
      { label: "Financial portal", to: "/fintech-financial-portal-development" },
      { label: "Health portal", to: "/healthcare-telemedicine-portal-development" },
      { label: "Advertisement portal", to: "/digital-advertising-portal-development" },
      { label: "Online chat", to: "/live-chat-messaging-system" },
    ],
  },
]

// The AI tab. Every link is also on the Services index.
export const aiMenu = [
  {
    title: 'AI solutions',
    icon: Sparkles,
    links: [
      { label: 'AI & machine learning', to: '/ai-machine-learning-solutions' },
      { label: 'AI website integration', to: '/ai-website-integration-services' },
      { label: 'Custom AI software', to: '/custom-ai-software-development' },
      { label: 'Generative AI', to: '/generative-ai-integration-services' },
    ],
  },
  {
    title: 'Assistants & agents',
    icon: Bot,
    links: [
      { label: 'AI chatbots & assistants', to: '/ai-chatbot-development-company' },
      { label: 'AI agent development', to: '/ai-agent-development-services' },
    ],
  },
  {
    title: 'Automation & insight',
    icon: Workflow,
    links: [
      { label: 'Workflow automation', to: '/workflow-automation-services' },
      { label: 'Robotic process automation', to: '/robotic-process-automation-solutions' },
      { label: 'Demand forecasting', to: '/demand-forecasting-ai-software' },
      { label: 'Fraud detection', to: '/fraud-detection-software-solutions' },
      { label: 'Data analytics', to: '/data-analytics-solutions' },
    ],
  },
]

export const primaryNav = [
  {
    label: 'AI',
    badge: 'Hot',
    to: '/ai-machine-learning-solutions',
    menu: aiMenu,
    footer: { text: 'Wondering where AI could save your team time? Tell us about the work.', overview: 'AI overview' },
    video: {
      to: '/ai-machine-learning-solutions#watch',
      thumb: '/videos/ai-automation-thumb.webp',
      title: 'AI automation in 38 seconds',
      text: 'Watch the film',
    },
  },
  {
    label: 'Services',
    to: '/services',
    menu: serviceMenu,
    footer: { text: 'Not sure which service fits? Tell us what you are trying to do.', overview: 'All services' },
  },
  {
    label: 'Products',
    to: '/products',
    menu: productMenu,
    footer: { text: 'Not sure whether to adapt a product or build your own? Talk it through with us.', overview: 'All products' },
  },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

// Selected links only: the index pages list everything.
export const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About us', to: '/about' },
      { label: 'Portfolio', to: '/portfolio' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Custom software', to: '/custom-software-development-company-in-india' },
      { label: 'Web development', to: '/website-development-company-in-india' },
      { label: 'Mobile apps', to: '/mobile-app-development-company-in-india' },
      { label: 'AI software', to: '/custom-ai-software-development' },
      { label: 'Cloud migration', to: '/cloud-migration-services' },
      { label: 'UI/UX & web design', to: '/custom-web-design-agency-in-india' },
      { label: 'Digital marketing', to: '/digital-marketing-agency-in-india' },
      { label: 'All services', to: '/services' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'CRM software', to: '/crm-software' },
      { label: 'ERP software', to: '/erp-software' },
      { label: 'School management', to: '/school-management-system' },
      { label: 'Billing & GST', to: '/billing-gst-software' },
      { label: 'HR & payroll', to: '/hr-payroll-software' },
      { label: 'All products', to: '/products' },
    ],
  },
]
