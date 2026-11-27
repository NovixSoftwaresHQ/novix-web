// Lightweight catalog (URL, menu title, theme) for the router, directories and sitemap.
// Full page content lives in productsData.js, which only the detail page loads.
export const products = [
  { slug: "crm-software", path: "/crm-software", title: "CRM software", theme: "ops", category: "Business Software" },
  { slug: "erp-software", path: "/erp-software", title: "ERP software", theme: "ops", category: "Business Software" },
  { slug: "billing-software", path: "/billing-software", title: "Billing software", theme: "ops", category: "Business Software" },
  { slug: "billing-gst-software", path: "/billing-gst-software", title: "GST software", theme: "ops", category: "Business Software" },
  { slug: "inventory-management-software", path: "/inventory-management-software", title: "Inventory management", theme: "ops", category: "Business Software" },
  { slug: "hr-payroll-software", path: "/hr-payroll-software", title: "HR & payroll", theme: "ops", category: "Business Software" },
  { slug: "vendor-contract-management-software", path: "/vendor-contract-management-software", title: "Vendor & contract management", theme: "ops", category: "Business Software" },
  { slug: "school-management-system", path: "/school-management-system", title: "School management ERP", theme: "edu", category: "Education" },
  { slug: "school-college-erp-software", path: "/school-college-erp-software", title: "School & college ERP", theme: "edu", category: "Education" },
  { slug: "e-learning-software", path: "/e-learning-software", title: "E-learning & online tests", theme: "edu", category: "Education" },
  { slug: "doctor-patient-booking-system", path: "/doctor-patient-booking-system", title: "Doctor & patient booking", theme: "care", category: "Care & Field Operations" },
  { slug: "construction-management-software", path: "/construction-management-software", title: "Construction software", theme: "ops", category: "Business Software" },
  { slug: "tender-procurement-software", path: "/tender-procurement-software", title: "Tender management", theme: "ops", category: "Business Software" },
  { slug: "field-service-management-software", path: "/field-service-management-software", title: "Field service management", theme: "care", category: "Care & Field Operations" },
  { slug: "project-management-system", path: "/project-management-system", title: "Project management system", theme: "ops", category: "Business Software" },
  { slug: "recruitment-management-software", path: "/recruitment-management-software", title: "Recruitment software", theme: "portal", category: "Portals & Platforms" },
  { slug: "visitor-security-management-software", path: "/visitor-security-management-software", title: "Security management", theme: "care", category: "Care & Field Operations" },
  { slug: "mass-email-marketing-software", path: "/mass-email-marketing-software", title: "Mass e-mail (PMS)", theme: "portal", category: "Portals & Platforms" },
  { slug: "omr-sheet-checker-software", path: "/omr-sheet-checker-software", title: "OMR solution", theme: "edu", category: "Education" },
  { slug: "smart-ivr-telephony-system", path: "/smart-ivr-telephony-system", title: "Digify IVR machine", theme: "portal", category: "Portals & Platforms" },
  { slug: "news-classified-portal-development", path: "/news-classified-portal-development", title: "News & classified portals", theme: "portal", category: "Portals & Platforms" },
  { slug: "real-estate-property-portal-development", path: "/real-estate-property-portal-development", title: "Property portal", theme: "portal", category: "Portals & Platforms" },
  { slug: "matrimonial-portal-development", path: "/matrimonial-portal-development", title: "Matrimonial portal", theme: "portal", category: "Portals & Platforms" },
  { slug: "fintech-financial-portal-development", path: "/fintech-financial-portal-development", title: "Financial portal", theme: "portal", category: "Portals & Platforms" },
  { slug: "healthcare-telemedicine-portal-development", path: "/healthcare-telemedicine-portal-development", title: "Health portal", theme: "care", category: "Care & Field Operations" },
  { slug: "digital-advertising-portal-development", path: "/digital-advertising-portal-development", title: "Advertisement portal", theme: "portal", category: "Portals & Platforms" },
  { slug: "live-chat-messaging-system", path: "/live-chat-messaging-system", title: "Online chat", theme: "portal", category: "Portals & Platforms" },
]

export const productBySlug = Object.fromEntries(products.map((item) => [item.slug, item]))
