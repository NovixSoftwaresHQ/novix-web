import { SITE_ORIGIN } from './siteOrigin.js'

export const company = {
  name: 'Novix Softwares',
  siteUrl: SITE_ORIGIN,
  tagline:
    'Novix Softwares is a software company in India building custom software, mobile and web apps, ERP and CRM systems and AI automation.',
  address: 'Nova Square, Greater Noida, India',
  hours: 'Monday–Saturday, 9:30 AM–7:30 PM IST',
  email: 'info@novixsoftwares.com',
  phones: [
    { label: '+91 8317020770', href: 'tel:+918317020770' },
    { label: '+91 9838485224', href: 'tel:+919838485224' },
  ],
  whatsapp: 'https://wa.me/918317020770',
  // The old site linked only to the platform homepages. Add real profile URLs to show these links.
  socials: [
    { label: 'LinkedIn', href: null },
    { label: 'Instagram', href: null },
  ],
}

// The one label for every action that opens the enquiry flow, and for the button that sends it.
export const enquiryLabel = 'Discuss your project'
export const sendLabel = 'Send enquiry'
// Offered first in every service list, for visitors who have not decided.
export const unsureOption = 'Not sure yet'
// Shown with the enquiry form and the closing call to action. Add a reply time only if you can keep it.
export const afterEnquiry = 'We read your message, get in touch with any questions, and agree the scope with you before any work starts.'

// Order and labels match the existing contact form.
export const serviceOptions = [
  'Custom Software Development',
  'Enterprise Web Application',
  'Mobile App Development',
  'Custom CRM Platforms',
  'Enterprise ERP Systems',
  'Cloud Architecture & DevOps',
  'AI & Machine Learning Solutions',
  'eCommerce & Retail Platforms',
  'UI/UX & Product Design',
  'Other Consultation',
]
