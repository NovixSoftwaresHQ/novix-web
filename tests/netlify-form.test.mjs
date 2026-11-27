import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ENQUIRY_FIELDS, FORM_NAME, FORM_PATH, submitLead } from '../src/lib/submitLead.js'

const blueprint = readFileSync(new URL('../public/__forms.html', import.meta.url), 'utf8')
const lead = { email: 'test@example.com', message: 'A test enquiry, please ignore.', name: '', phone: '', service: 'CRM', context: 'Test', page: '/contact' }

// Stands in for the network: records what was sent and answers as told.
const answer = (status, body) => {
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options })
    return { ok: status >= 200 && status < 300, text: async () => body }
  }
  return calls
}

test('the form Netlify reads lists every field the site sends', () => {
  assert.match(blueprint, new RegExp(`<form name="${FORM_NAME}"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"`))
  for (const field of ['form-name', ...ENQUIRY_FIELDS]) assert.ok(blueprint.includes(`name="${field}"`), field)
})

test('an enquiry is posted URL-encoded with the form name, and nothing arrives as "undefined"', async () => {
  const calls = answer(200, '<html><body><h1>Thank you!</h1></body></html>')
  assert.equal(await submitLead(lead), 'sent')
  assert.equal(calls[0].url, FORM_PATH)
  assert.equal(calls[0].method, 'POST')
  assert.equal(calls[0].headers['Content-Type'], 'application/x-www-form-urlencoded')
  const sent = new URLSearchParams(calls[0].body)
  assert.deepEqual([...sent.keys()], ['form-name', ...ENQUIRY_FIELDS])
  assert.equal(sent.get('form-name'), FORM_NAME)
  assert.equal(sent.get('email'), lead.email)
  assert.equal(sent.get('topic'), '')
})

test('it never reports success unless the enquiry was accepted', async () => {
  for (const [status, body] of [[404, 'Not found'], [500, ''], [200, blueprint], [200, '<div id="root"></div>']]) {
    answer(status, body)
    assert.equal(await submitLead(lead), 'failed', `${status} ${body.slice(0, 20)}`)
  }
  globalThis.fetch = async () => { throw new TypeError('offline') }
  assert.equal(await submitLead(lead), 'failed')
})
