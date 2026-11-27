// Client testimonials shown on the homepage. The section stays hidden while no approved entry exists.
//
// THIS FILE IS SENT TO EVERY VISITOR. Add an entry only after the client has approved the exact words for
// publication under Novix Softwares. Keep drafts, unapproved quotes and review notes somewhere else.
// Quotes from the previous brand are kept outside this repository and must not be copied here without new approval.
//
//   {
//     id: 'unique-id',          required
//     quote: 'Exact words.',    required, published verbatim
//     clientName: 'Name',       required
//     role: 'Title',            optional
//     company: 'Company',       optional
//     avatar: '/clients/x.jpg', optional, approved image in public/
//     projectUrl: 'https://…',  optional
//     approved: true,           required: anything other than the value true keeps the entry hidden
//   }
export const testimonialRecords = []

const filled = (value) => typeof value === 'string' && value.trim() !== ''

/** Publication approval must be explicit; a missing or "truthy" value is not enough. */
export const approvedTestimonials = (records) =>
  records.filter((item) => item.approved === true && filled(item.id) && filled(item.quote) && filled(item.clientName))
