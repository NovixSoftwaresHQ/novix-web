// /services and /products overview pages.
// Copy carried over from the previous website, 26 Nov 2026. Safe to edit by hand.
import { summarySteps } from './processData.js'

export const servicesDirectory = {
  "meta": {
    "title": "Software Development Services | Novix Softwares",
    "description": "Explore services from Novix Softwares, a software company in India: custom software, web and mobile apps, ERP, CRM, AI, cloud, design and digital marketing."
  },
  "hero": {
    "eyebrow": "Services",
    "heading": [
      "Everything we build, ",
      {
        "hl": [
          "in one place"
        ]
      }
    ],
    "description": "Novix Softwares provides custom software development, web and mobile app development, ERP and CRM systems, AI solutions, cloud services, design and digital marketing. Open a category to find the service you need.",
    "link": {
      "label": "Unsure which service fits? Ask us",
      "to": "/contact"
    },
    "jumpLabel": "Jump to a category",
    "jumpMore": [
      {
        "href": "#industries",
        "label": "Software by industry"
      },
      {
        "href": "#tech",
        "label": "Technology we use"
      }
    ]
  },
  "categories": [
    {
      "id": "cat-software",
      "title": "Software Development",
      "intro": "Software made for your own processes, and upgrades for systems that are holding you back.",
      "main": {
        "label": "Software development overview",
        "to": "/custom-software-development-company-in-india"
      },
      "links": [
        {
          "to": "/custom-software-development-company-in-india",
          "name": "Custom software development",
          "text": "Applications and internal tools made for you"
        },
        {
          "to": "/digital-transformation-services",
          "name": "Digital transformation",
          "text": "Turn paper and manual work into software"
        },
        {
          "to": "/legacy-system-modernisation-services",
          "name": "Legacy system modernisation",
          "text": "Update or rebuild outdated software"
        },
        {
          "to": "/workflow-automation-services",
          "name": "Workflow automation",
          "text": "Remove repetitive manual steps"
        },
        {
          "to": "/technology-audit-roadmap-services",
          "name": "Technology audit & roadmap",
          "text": "A review of your technology with next steps"
        },
        {
          "to": "/full-stack-web-development-services",
          "name": "Full stack development",
          "text": "One team for interface, server and APIs"
        },
        {
          "to": "/hire-dedicated-developers",
          "name": "Hire dedicated developers",
          "text": "Add developers to your team"
        },
        {
          "to": "/enterprise-software-development",
          "name": "Enterprise software",
          "text": "Larger systems for core business processes"
        },
        {
          "to": "/api-development-integration",
          "name": "API development & integration",
          "text": "Connect your systems, apps and outside services"
        }
      ]
    },
    {
      "id": "cat-web",
      "title": "Web Development",
      "intro": "Websites, online shops, portals and dashboards, built with current frameworks or your chosen CMS.",
      "main": {
        "label": "Web development overview",
        "to": "/website-development-company-in-india"
      },
      "links": [
        {
          "to": "/website-development-company-in-india",
          "name": "Web development",
          "text": "Company websites and browser-based applications"
        },
        {
          "to": "/ecommerce-website-development-company-in-india",
          "name": "E-commerce development",
          "text": "Online stores for consumers or trade buyers"
        },
        {
          "to": "/custom-portal-development",
          "name": "Customer & client portals",
          "text": "Secure self-service areas"
        },
        {
          "to": "/enterprise-dashboard-development",
          "name": "Enterprise dashboards",
          "text": "Dashboards that show current figures"
        },
        {
          "to": "/php-development-company",
          "name": "PHP development",
          "text": "Core PHP, Laravel and CodeIgniter work"
        },
        {
          "to": "/wordpress-development-company-in-india",
          "name": "WordPress development",
          "text": "Custom themes and plugins"
        },
        {
          "to": "/joomla-development-company",
          "name": "Joomla development",
          "text": "Builds, upgrades and extensions"
        },
        {
          "to": "/interspire-development-company",
          "name": "Interspire development",
          "text": "Interspire store and email software work"
        },
        {
          "to": "/shopify-development-agency-in-india",
          "name": "Shopify development",
          "text": "Themes, checkout, integrations and store moves"
        }
      ]
    },
    {
      "id": "cat-mobile",
      "title": "Mobile Apps",
      "intro": "Apps for customers, field staff and delivery businesses, covering the first release and later store updates.",
      "main": {
        "label": "Mobile app development overview",
        "to": "/mobile-app-development-company-in-india"
      },
      "links": [
        {
          "to": "/mobile-app-development-company-in-india",
          "name": "Mobile app development",
          "text": "Cross-platform apps in Flutter or React Native"
        },
        {
          "to": "/android-app-development-company",
          "name": "Android app development",
          "text": "Native Android in Kotlin"
        },
        {
          "to": "/on-demand-delivery-app-development",
          "name": "On-demand delivery apps",
          "text": "Apps for customers, drivers and administrators"
        },
        {
          "to": "/ios-app-development-company",
          "name": "iOS app development",
          "text": "Native apps for iPhone and iPad in Swift"
        },
        {
          "to": "/cross-platform-app-development",
          "name": "Cross-platform apps",
          "text": "iOS and Android with Flutter or React Native"
        }
      ]
    },
    {
      "id": "cat-ai",
      "title": "AI & Automation",
      "intro": "AI assistants, agents, forecasting and automation, added to the products and processes you already use.",
      "main": {
        "label": "AI and machine learning overview",
        "to": "/ai-machine-learning-solutions"
      },
      "links": [
        {
          "to": "/ai-machine-learning-solutions",
          "name": "AI & machine learning",
          "text": "Machine learning aimed at a defined problem"
        },
        {
          "to": "/custom-ai-software-development",
          "name": "Custom AI software",
          "text": "Add AI functions to your application"
        },
        {
          "to": "/ai-website-integration-services",
          "name": "AI website integration",
          "text": "Bring AI search and chat to your site"
        },
        {
          "to": "/ai-chatbot-development-company",
          "name": "AI chatbots & assistants",
          "text": "Support and sales assistants"
        },
        {
          "to": "/ai-agent-development-services",
          "name": "AI agent development",
          "text": "Software agents for tasks with several steps"
        },
        {
          "to": "/demand-forecasting-ai-software",
          "name": "Demand forecasting",
          "text": "Forecast demand to plan stock and capacity"
        },
        {
          "to": "/fraud-detection-software-solutions",
          "name": "Fraud detection",
          "text": "Flag unusual transactions early"
        },
        {
          "to": "/marketing-automation-solutions",
          "name": "Marketing automation",
          "text": "Campaigns and lead follow-up that run automatically"
        },
        {
          "to": "/generative-ai-integration-services",
          "name": "Generative AI integration",
          "text": "Language models for drafting, documents and agents"
        },
        {
          "to": "/robotic-process-automation-solutions",
          "name": "Robotic process automation",
          "text": "Software robots for repetitive admin tasks"
        },
        {
          "to": "/data-analytics-solutions",
          "name": "Data analytics",
          "text": "Bring data together into dashboards"
        }
      ]
    },
    {
      "id": "cat-saas",
      "title": "SaaS & Business Platforms",
      "intro": "SaaS products, and custom ERP or CRM systems for companies whose needs packaged tools no longer meet.",
      "main": {
        "label": "SaaS development overview",
        "to": "/saas-application-development"
      },
      "links": [
        {
          "to": "/saas-application-development",
          "name": "SaaS & cloud platforms",
          "text": "Multi-tenant products with billing"
        },
        {
          "to": "/subscription-management-software-development",
          "name": "Subscription management",
          "text": "Handle subscriptions, renewals and repeat billing"
        },
        {
          "to": "/enterprise-erp-systems-in-india",
          "name": "Custom ERP development",
          "text": "Connect accounts, stock and HR"
        },
        {
          "to": "/custom-crm-development-in-india",
          "name": "Custom CRM development",
          "text": "Track customers and deals your way"
        }
      ]
    },
    {
      "id": "cat-cloud",
      "title": "Cloud & DevOps",
      "intro": "Cloud setup, automated releases and hosting that your team can manage, with running costs kept in view.",
      "main": {
        "label": "Cloud migration overview",
        "to": "/cloud-migration-services"
      },
      "links": [
        {
          "to": "/cloud-migration-services",
          "name": "Cloud migration",
          "text": "Move servers, applications and data to cloud"
        },
        {
          "to": "/cloud-architecture-api-microservices",
          "name": "Cloud architecture & APIs",
          "text": "Scalable services and integrations"
        },
        {
          "to": "/devops-consulting-services",
          "name": "DevOps consulting",
          "text": "Automated releases, monitoring and infrastructure code"
        },
        {
          "to": "/cloud-application-development",
          "name": "Cloud application development",
          "text": "Applications built to run and scale in the cloud"
        }
      ]
    },
    {
      "id": "cat-design",
      "title": "Design",
      "intro": "Design for screens and brands that people find clear and easy to use.",
      "main": {
        "label": "UI/UX and web design overview",
        "to": "/custom-web-design-agency-in-india"
      },
      "links": [
        {
          "to": "/custom-web-design-agency-in-india",
          "name": "UI/UX & web design",
          "text": "Screen design, prototypes and design systems"
        },
        {
          "to": "/website-redesign-services",
          "name": "Website redesign",
          "text": "Refresh an outdated site"
        },
        {
          "to": "/responsive-web-design-services",
          "name": "Responsive websites",
          "text": "Designs that adapt to every screen"
        },
        {
          "to": "/graphic-design-services",
          "name": "Graphic design",
          "text": "Marketing and social creatives"
        },
        {
          "to": "/logo-design-services",
          "name": "Logo design",
          "text": "Logo and basic brand identity design"
        },
        {
          "to": "/product-design-services",
          "name": "Product design",
          "text": "Product discovery, user experience and screens"
        },
        {
          "to": "/mobile-app-ui-ux-design",
          "name": "Mobile app UI/UX design",
          "text": "App flows and screens designed in Figma"
        },
        {
          "to": "/wireframing-prototyping-services",
          "name": "Wireframes & prototypes",
          "text": "Test journeys and features before building"
        },
        {
          "to": "/brand-identity-design-services",
          "name": "Brand identity design",
          "text": "Logo, typography and brand guidelines"
        }
      ]
    },
    {
      "id": "cat-marketing",
      "title": "Digital Marketing",
      "intro": "Search, advertising, social media and content, with reports that show what each effort produced.",
      "main": {
        "label": "Digital marketing overview",
        "to": "/digital-marketing-agency-in-india"
      },
      "links": [
        {
          "to": "/digital-marketing-agency-in-india",
          "name": "Digital marketing",
          "text": "Full-funnel online marketing"
        },
        {
          "to": "/best-seo-company-in-india",
          "name": "SEO services",
          "text": "SEO for pages, site health and local search"
        },
        {
          "to": "/ppc-services-agency-in-india",
          "name": "PPC advertising",
          "text": "Paid campaigns on Google and Meta"
        },
        {
          "to": "/social-media-marketing-agency",
          "name": "Social media marketing",
          "text": "Strategy, posting and community"
        },
        {
          "to": "/social-media-marketing-packages",
          "name": "Social media packages",
          "text": "Social media work planned by the month"
        },
        {
          "to": "/content-marketing-agency",
          "name": "Content marketing",
          "text": "Articles and content that can attract search visitors"
        },
        {
          "to": "/content-writing-services",
          "name": "Content writing",
          "text": "Writing for websites, blogs and product pages"
        },
        {
          "to": "/web-analytics-services",
          "name": "Web analytics",
          "text": "Analytics setup, tags and reports"
        },
        {
          "to": "/online-reputation-management-services",
          "name": "Reputation management",
          "text": "Monitor and improve reviews"
        },
        {
          "to": "/corporate-seo-agency-in-india",
          "name": "Corporate SEO",
          "text": "SEO for large websites and migrations"
        },
        {
          "to": "/local-seo-services-agency",
          "name": "Local SEO",
          "text": "Business profile, listings and local pages"
        },
        {
          "to": "/conversion-rate-optimization-services",
          "name": "Conversion rate optimisation",
          "text": "Help more visitors buy or enquire"
        },
        {
          "to": "/email-marketing-services",
          "name": "Email marketing",
          "text": "Newsletters, reminders and lifecycle emails"
        }
      ]
    }
  ],
  "promo": {
    "title": "Looking for ready-made software?",
    "text": "If a ready product covers your need, our CRM, ERP, billing, school and HR software can be set up with less work than a full custom build.",
    "links": [
      {
        "label": "CRM software",
        "to": "/crm-software"
      },
      {
        "label": "ERP software",
        "to": "/erp-software"
      },
      {
        "label": "Billing software",
        "to": "/billing-software"
      },
      {
        "label": "School ERP",
        "to": "/school-management-system"
      },
      {
        "label": "HR & payroll",
        "to": "/hr-payroll-software"
      },
      {
        "label": "All products →",
        "to": "/products"
      }
    ]
  },
  "process": {
    "eyebrow": "How we work",
    "title": "Four stages from first conversation to launch",
    "description": "Small sites and large platforms both go through these stages.",
    "steps": summarySteps
  },
  "engagement": {
    "eyebrow": "Engagement models",
    "title": "Three ways to engage us",
    "description": "Your choice depends on how settled the scope is now, and it can change as the project grows.",
    "items": [
      {
        "title": "Fixed price",
        "bestFor": "For work with a settled scope",
        "points": [
          "Cost, scope and milestones agreed in advance",
          "Sign-off at each milestone",
          "Suits websites, single modules and first versions"
        ]
      },
      {
        "title": "Dedicated team",
        "bestFor": "For a product under steady development",
        "points": [
          "Designers, developers or testers assigned only to you",
          "You choose priorities for each sprint",
          "Add or reduce people as work changes"
        ]
      },
      {
        "title": "Hourly (time and material)",
        "bestFor": "For small or changing jobs",
        "points": [
          "You are billed for hours worked",
          "You receive timesheets and progress notes",
          "Works well for upkeep, repairs and small additions"
        ]
      }
    ],
    "note": ""
  },
  "cta": {
    "title": "Describe your project to us",
    "text": "Send a short brief. We will come back with questions, a proposed approach and a rough estimate, with no obligation."
  },
  "tech": {
    "eyebrow": "Tech stack",
    "title": "Widely used technology",
    "description": "We build with widely used tools, which makes it easier to find people who can maintain your software, whether or not that is us.",
    "rows": [
      {
        "label": "Front end",
        "items": [
          "React",
          "Next.js",
          "Vue.js",
          "TypeScript",
          "Tailwind CSS",
          "JavaScript",
          "HTML5 & CSS3"
        ]
      },
      {
        "label": "Back end",
        "items": [
          "Node.js",
          "PHP & Laravel",
          "Python",
          "REST & GraphQL"
        ]
      },
      {
        "label": "Mobile",
        "items": [
          "Flutter",
          "React Native",
          "Kotlin",
          "Swift (iOS)"
        ]
      },
      {
        "label": "Data & AI",
        "items": [
          "MySQL",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "OpenAI & LLM APIs",
          "Firebase"
        ]
      },
      {
        "label": "Cloud & DevOps",
        "items": [
          "AWS",
          "Google Cloud",
          "Docker",
          "Kubernetes",
          "GitHub Actions"
        ]
      },
      {
        "label": "CMS & commerce",
        "items": [
          "WordPress",
          "WooCommerce",
          "Shopify",
          "Joomla"
        ]
      }
    ]
  },
  "industries": {
    "id": "industries",
    "eyebrow": "By industry",
    "title": "Software by industry",
    "description": "Starting points for some common industries. Each link goes to the closest service or product.",
    "links": [
      {
        "industry": "Retail & e-commerce",
        "label": "E-commerce development",
        "to": "/ecommerce-website-development-company-in-india"
      },
      {
        "industry": "Education",
        "label": "School and college ERP",
        "to": "/school-college-erp-software"
      },
      {
        "industry": "Healthcare",
        "label": "Health and telemedicine portals",
        "to": "/healthcare-telemedicine-portal-development"
      },
      {
        "industry": "Manufacturing & distribution",
        "label": "Inventory management software",
        "to": "/inventory-management-software"
      },
      {
        "industry": "Real estate",
        "label": "Property portals",
        "to": "/real-estate-property-portal-development"
      },
      {
        "industry": "Construction",
        "label": "Construction management software",
        "to": "/construction-management-software"
      },
      {
        "industry": "Finance & fintech",
        "label": "Financial portals",
        "to": "/fintech-financial-portal-development"
      },
      {
        "industry": "Logistics & field service",
        "label": "Field service management",
        "to": "/field-service-management-software"
      }
    ]
  }
}

export const productsDirectory = {
  "meta": {
    "title": "Business Software: CRM, ERP, Billing & HR | Novix",
    "description": "CRM, ERP, GST billing, stock, HR, payroll and school software from Novix Softwares, configured around the way your business works."
  },
  "hero": {
    "eyebrow": "Products",
    "heading": [
      "Ready-made software, ",
      {
        "hl": [
          "set up for you"
        ]
      }
    ],
    "description": "Browse our software for sales, accounts, HR, schools, clinics and online portals. For each one, setup covers your workflow, your existing records and training for your staff.",
    "link": {
      "label": "Want a custom build? View our services",
      "to": "/services"
    },
    "jumpLabel": "Jump to a category"
  },
  "categories": [
    {
      "id": "cat-business",
      "title": "Business Software",
      "intro": "The systems most businesses run on, covering sales, money, stock and staff. Add modules when you are ready for them.",
      "main": {
        "label": "See the ERP software",
        "to": "/erp-software"
      },
      "links": [
        {
          "to": "/crm-software",
          "name": "CRM software",
          "text": "Follow enquiries and manage field sales teams"
        },
        {
          "to": "/erp-software",
          "name": "ERP software",
          "text": "Accounts, supply chain, HR and reporting together"
        },
        {
          "to": "/enterprise-software-development",
          "name": "Enterprise software",
          "text": "Bigger systems for processes you cannot afford to stop"
        },
        {
          "to": "/billing-software",
          "name": "Billing software",
          "text": "Barcode checkout and receipts for retail counters"
        },
        {
          "to": "/billing-gst-software",
          "name": "GST software",
          "text": "GST invoicing with e-invoice and e-way bill support"
        },
        {
          "to": "/inventory-management-software",
          "name": "Inventory management",
          "text": "See stock in every warehouse and shop"
        },
        {
          "to": "/hr-payroll-software",
          "name": "HR & payroll",
          "text": "Payroll with attendance, leave, PF, ESI and TDS"
        },
        {
          "to": "/vendor-contract-management-software",
          "name": "Vendor & contract management",
          "text": "Manage suppliers, contracts and vendor ratings"
        }
      ]
    },
    {
      "id": "cat-industry",
      "title": "Industry Solutions",
      "intro": "Software for the routines of schools, clinics, construction firms and service teams.",
      "main": {
        "label": "See the school management ERP",
        "to": "/school-management-system"
      },
      "links": [
        {
          "to": "/school-management-system",
          "name": "School management ERP",
          "text": "Run admissions, fees, exams, transport and parent updates"
        },
        {
          "to": "/school-college-erp-software",
          "name": "School & college ERP",
          "text": "Campus exams, CBCS and records for NAAC/NBA reports"
        },
        {
          "to": "/e-learning-software",
          "name": "E-learning & online tests",
          "text": "Online courses with tests and certificates"
        },
        {
          "to": "/doctor-patient-booking-system",
          "name": "Doctor & patient booking",
          "text": "Patient bookings, medical records and prescriptions"
        },
        {
          "to": "/construction-management-software",
          "name": "Construction software",
          "text": "Site reports, BOQs, material requests and contractor bills"
        },
        {
          "to": "/tender-procurement-software",
          "name": "Tender management",
          "text": "Run online tenders, bid reviews and reverse auctions"
        },
        {
          "to": "/field-service-management-software",
          "name": "Field service management",
          "text": "Assign field jobs, plan routes and collect sign-off"
        }
      ]
    },
    {
      "id": "cat-operations",
      "title": "Operations",
      "intro": "Software for everyday jobs such as planning projects, hiring, visitor entry, messaging and exam marking.",
      "main": {
        "label": "See the project management system",
        "to": "/project-management-system"
      },
      "links": [
        {
          "to": "/project-management-system",
          "name": "Project management system",
          "text": "Plan work on boards and charts, with timesheets"
        },
        {
          "to": "/recruitment-management-software",
          "name": "Recruitment software",
          "text": "Sort resumes, book interviews and send offers"
        },
        {
          "to": "/visitor-security-management-software",
          "name": "Security management",
          "text": "Sign in visitors and print QR badges"
        },
        {
          "to": "/mass-email-marketing-software",
          "name": "Mass e-mail (PMS)",
          "text": "Send bulk email and review the results"
        },
        {
          "to": "/omr-sheet-checker-software",
          "name": "OMR solution",
          "text": "Mark OMR answer sheets from scanned copies"
        },
        {
          "to": "/smart-ivr-telephony-system",
          "name": "Digify IVR machine",
          "text": "Phone menus, call routing and call recording"
        }
      ]
    },
    {
      "id": "cat-portals",
      "title": "Web Portals",
      "intro": "Starting platforms for listing, news, finance, matchmaking and health portals, carrying your own brand.",
      "main": {
        "label": "See news and classified portals",
        "to": "/news-classified-portal-development"
      },
      "links": [
        {
          "to": "/news-classified-portal-development",
          "name": "News & classified portals",
          "text": "Publish news or run a classifieds marketplace"
        },
        {
          "to": "/real-estate-property-portal-development",
          "name": "Property portal",
          "text": "Property listings with map search and enquiries"
        },
        {
          "to": "/matrimonial-portal-development",
          "name": "Matrimonial portal",
          "text": "Matchmaking with privacy controls and membership plans"
        },
        {
          "to": "/fintech-financial-portal-development",
          "name": "Financial portal",
          "text": "Online loan applications with KYC and e-NACH"
        },
        {
          "to": "/healthcare-telemedicine-portal-development",
          "name": "Health portal",
          "text": "Online consultations linked to patient records"
        },
        {
          "to": "/digital-advertising-portal-development",
          "name": "Advertisement portal",
          "text": "Sell ad space with advertiser self-service"
        },
        {
          "to": "/live-chat-messaging-system",
          "name": "Online chat",
          "text": "Chat with website visitors and route conversations"
        }
      ]
    }
  ],
  "promo": {
    "title": "Looking for software we have not listed?",
    "text": "We can add modules to any of these products, or design a new system from the ground up for your process.",
    "links": [
      {
        "label": "Custom software",
        "to": "/custom-software-development-company-in-india"
      },
      {
        "label": "Custom ERP",
        "to": "/enterprise-erp-systems-in-india"
      },
      {
        "label": "Custom CRM",
        "to": "/custom-crm-development-in-india"
      },
      {
        "label": "SaaS platforms",
        "to": "/saas-application-development"
      },
      {
        "label": "All services",
        "to": "/services"
      }
    ]
  },
  "process": {
    "eyebrow": "Rollout",
    "title": "From demo to go-live",
    "description": "The core product is already built, so setup concentrates on making it suit you. These are the steps.",
    "steps": [
      {
        "title": "Live demo",
        "text": "A product walkthrough with your staff, where we list the changes your process needs."
      },
      {
        "title": "Configure",
        "text": "We set your branding, forms, user roles, reports and approval steps."
      },
      {
        "title": "Migrate & train",
        "text": "We bring in your current data, check it and train the people who will use it."
      },
      {
        "title": "Go live & support",
        "text": "We support the launch and the first weeks of use, then continue with product updates."
      }
    ]
  },
  "engagement": {
    "eyebrow": "Options",
    "title": "How much should we customise?",
    "description": "Begin with what your budget and schedule allow. Deeper customisation can follow.",
    "items": [
      {
        "title": "Ready to use",
        "bestFor": "Choose this to start sooner",
        "points": [
          "The standard product carrying your brand",
          "Roles, reports and settings set up for you",
          "Takes less work than building from nothing"
        ]
      },
      {
        "title": "Customised product",
        "bestFor": "Best for: specific workflows",
        "points": [
          "Extra fields, screens, modules and approvals",
          "Connections to software you keep using",
          "Developed on top of the existing product"
        ]
      },
      {
        "title": "Fully custom build",
        "bestFor": "Best for: unique processes",
        "points": [
          "Planned and developed for your company alone",
          "Source code handed over as agreed"
        ],
        "link": {
          "label": "About custom software development",
          "to": "/custom-software-development-company-in-india"
        }
      }
    ],
    "note": ""
  },
  "cta": {
    "title": "Ask to see a product working",
    "text": "Describe your business and we will arrange a short demo of the closest product, with a clear price covering setup and support."
  }
}
