import { CheckCircle2, Mail, MessageCircle } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { afterEnquiry, company, enquiryLabel, sendLabel, serviceOptions, unsureOption } from '../../data/companyData.js'
import { fallbackLinks, submitLead } from '../../lib/submitLead.js'
import Button from '../ui/Button.jsx'

// Only what is needed to reply and start the conversation is required. Order here is the order on screen.
const FIELDS = ['email', 'message', 'name', 'phone', 'service']
const REQUIRED = ['email', 'message']

// `check` runs on any filled value; `empty` applies to required fields only.
const rules = {
  email: {
    empty: 'Enter your email address so we can reply.',
    invalid: 'Enter a complete email address, like name@company.com.',
    check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  },
  message: {
    empty: 'Add a short summary of your project.',
    invalid: 'Add a little more detail (at least 10 characters).',
    check: (v) => v.trim().length >= 10,
  },
  name: { invalid: 'Enter at least 2 characters, or leave this empty.', check: (v) => v.trim().length >= 2 },
  phone: { invalid: 'Enter a phone number with 10 to 15 digits, or leave this empty.', check: (v) => /^\+?\d{10,15}$/.test(v.replace(/[\s()-]/g, '')) },
  service: { check: () => true },
}

const errorFor = (name, value) => {
  if (!value.trim()) return REQUIRED.includes(name) ? rules[name].empty : null
  return rules[name].check(value) ? null : rules[name].invalid
}

function Field({ id, label, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-heading">
        {label}{' '}
        {/* "required" is also announced from the field itself. */}
        <span aria-hidden={required || undefined} className="font-normal text-body">({required ? 'required' : 'optional'})</span>
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

export default function LeadForm({
  options = serviceOptions,
  defaultService = '',
  messagePlaceholder = 'What do you need, who will use it, and what should it improve?',
  context = enquiryLabel,
  topic,
  autoFocus = false,
  wide = false,
  onDone,
}) {
  const uid = useId()
  const choices = [unsureOption, ...options.filter((option) => option !== unsureOption)]
  const initial = { email: '', message: '', name: '', phone: '', service: choices.includes(defaultService) ? defaultService : '' }
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const sending = useRef(false)
  const success = useRef(null)

  // Move focus to the confirmation, so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (status === 'sent') success.current?.focus()
  }, [status])

  const change = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name] && !errorFor(name, value)) setErrors(({ [name]: _removed, ...rest }) => rest)
    if (status === 'failed') setStatus('idle')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (sending.current) return // a second click or Enter while sending does nothing
    const nextErrors = Object.fromEntries(FIELDS.map((name) => [name, errorFor(name, values[name])]).filter(([, error]) => error))
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      event.currentTarget.elements.namedItem(firstInvalid)?.focus()
      return
    }
    sending.current = true
    setStatus('sending')
    const trap = event.currentTarget.elements.namedItem('bot-field').value
    const result = await submitLead({ ...values, context, topic, page: window.location.pathname, 'bot-field': trap })
    sending.current = false
    setStatus(result)
  }

  const props = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange: change,
    required: REQUIRED.includes(name),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
    className: 'field',
  })
  const field = (name, label) => ({ id: `${uid}-${name}`, label, required: REQUIRED.includes(name), error: errors[name] })
  const links = fallbackLinks({ ...values, topic })
  const isSending = status === 'sending'
  const errorCount = Object.keys(errors).length

  if (status === 'sent') {
    return (
      <div ref={success} tabIndex={-1} role="status" className="py-8 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-emerald-600 dark:text-primary" />
        <p className="mt-3 font-semibold text-heading">Your enquiry has been received.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6">What happens next: {afterEnquiry}</p>
        <Button className="mt-6" onClick={onDone ?? (() => { setValues(initial); setStatus('idle') })}>
          {onDone ? 'Close' : 'Send another enquiry'}
        </Button>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={submit} aria-busy={isSending} className={wide ? 'grid items-start gap-4 md:grid-cols-3' : 'space-y-4'}>
      <Field {...field('email', 'Email')}>
        <input {...props('email')} {...(autoFocus && { 'data-autofocus': true })} type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" />
      </Field>
      <div className={wide ? 'md:col-span-2' : ''}>
        <Field {...field('message', 'Project summary')}>
          <textarea {...props('message')} rows={wide ? 2 : 4} placeholder={messagePlaceholder} />
        </Field>
      </div>
      <div className={wide ? 'contents' : 'grid gap-4 sm:grid-cols-2'}>
        <Field {...field('name', 'Your name')}>
          <input {...props('name')} autoComplete="name" />
        </Field>
        <Field {...field('phone', 'Phone / WhatsApp')}>
          <input {...props('phone')} type="tel" autoComplete="tel" placeholder="+91 00000 00000" />
        </Field>
      </div>
      <Field {...field('service', 'Service')}>
        <select {...props('service')}>
          <option value="">Select a service</option>
          {choices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </Field>

      {/* Netlify's spam trap: people never see it, so only a bot that fills in every field gives itself away. */}
      <div hidden>
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Always present, so that changes inside it are announced. */}
      <div aria-live="polite" className={wide ? 'md:col-span-3 empty:hidden' : 'empty:hidden'}>
        {errorCount > 0 && (
          <p className="sr-only">
            {errorCount === 1 ? '1 field needs attention.' : `${errorCount} fields need attention.`}
          </p>
        )}
        {isSending && <p className="sr-only">Sending your enquiry.</p>}
        {status === 'failed' && (
          <div className="rounded-card border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="font-semibold">Your enquiry has not been sent.</p>
            <p className="mt-1">
              We could not reach our server. What you typed is still here, so you can try again.{' '}
              You can also send the same details by email or WhatsApp:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" href={links.email}><Mail aria-hidden="true" className="h-4 w-4" />Email</Button>
              <Button size="sm" variant="secondary" href={links.whatsapp}><MessageCircle aria-hidden="true" className="h-4 w-4" />WhatsApp</Button>
            </div>
          </div>
        )}
      </div>

      <div className={wide ? 'md:col-span-3' : ''}>
        {/* aria-disabled rather than disabled, so focus is not lost while sending. */}
        <Button type="submit" size="lg" arrow={!isSending} aria-disabled={isSending || undefined} className="w-full aria-disabled:cursor-wait aria-disabled:opacity-70">
          {isSending ? 'Sending…' : sendLabel}
        </Button>
        <p className="mt-3 text-center text-xs leading-5">
          What happens next: {afterEnquiry}{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener" className="font-semibold text-primary underline underline-offset-4">
            Privacy policy<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        <p className="mt-1 text-center text-xs">
          Prefer to talk? <a href={company.phones[0].href} className="inline-block py-1 font-semibold text-primary">{company.phones[0].label}</a>
        </p>
      </div>
    </form>
  )
}
