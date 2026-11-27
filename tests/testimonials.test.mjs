import assert from 'node:assert/strict'
import { test } from 'node:test'
import { approvedTestimonials, testimonialRecords } from '../src/data/testimonialsData.js'

const base = { id: 'a', quote: 'Words.', clientName: 'Name', approved: true }

test('only entries approved with the value true are published', () => {
  const rejected = [false, undefined, 'true', 'yes', 1, {}].map((approved, i) => ({ ...base, id: `r${i}`, approved }))
  const missing = { id: 'm', quote: 'Words.', clientName: 'Name' }
  assert.deepEqual(approvedTestimonials([...rejected, missing, base]), [base])
})

test('incomplete entries are not published', () => {
  const bad = [{ ...base, quote: '  ' }, { ...base, clientName: '' }, { ...base, id: undefined }]
  assert.deepEqual(approvedTestimonials(bad), [])
})

test('optional fields are not required, and quotes are passed through unchanged', () => {
  const long = { ...base, quote: '  Spacing and “quotes” stay exactly as written. ' + 'word '.repeat(200) }
  assert.equal(approvedTestimonials([long])[0].quote, long.quote)
})

test('every published record in the real data file passes the filter', () => {
  assert.equal(approvedTestimonials(testimonialRecords).length, testimonialRecords.length)
})
