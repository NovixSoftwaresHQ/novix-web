import { company, unsureOption } from '../data/companyData.js'

// Enquiries are collected by Netlify Forms. public/__forms.html declares this form and its fields, which is how
// Netlify finds it when it deploys. Netlify drops any field that is not declared there.
export const FORM_NAME = 'enquiry'
export const FORM_PATH = '/__forms.html'
export const ENQUIRY_FIELDS = ['email', 'message', 'name', 'phone', 'service', 'topic', 'context', 'page', 'bot-field']
// Only this site's own pages contain these. If one comes back, the server just handed us a page and saved nothing.
const OWN_PAGE = /netlify-forms-blueprint|<div id="root"/

// Only the details the visitor filled in.
const asText = (lead) => {
  const details = [
    lead.topic && `Regarding: ${lead.topic}`,
    lead.name && `Name: ${lead.name}`,
    lead.phone && `Phone / WhatsApp: ${lead.phone}`,
    lead.email && `Email: ${lead.email}`,
    lead.service && `Service: ${lead.service}`,
  ].filter(Boolean)
  return [details.join('\n'), lead.message].filter(Boolean).join('\n\n')
}

const subjectFor = (lead) => lead.topic || (lead.service && lead.service !== unsureOption ? lead.service : 'Project enquiry')

/** Pre-filled links the visitor can use if sending fails. */
export const fallbackLinks = (lead) => ({
  email: `mailto:${company.email}?subject=${encodeURIComponent(`Enquiry: ${subjectFor(lead)}`)}&body=${encodeURIComponent(asText(lead))}`,
  whatsapp: `${company.whatsapp}?text=${encodeURIComponent(asText(lead))}`,
})

/** Returns 'sent' only when Netlify accepts the enquiry, otherwise 'failed'. It never simulates success. */
export async function submitLead(lead) {
  const body = new URLSearchParams({ 'form-name': FORM_NAME })
  for (const field of ENQUIRY_FIELDS) body.set(field, lead[field] ?? '')
  try {
    const response = await fetch(FORM_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) return 'failed'
    return OWN_PAGE.test(await response.text()) ? 'failed' : 'sent'
  } catch {
    return 'failed'
  }
}
