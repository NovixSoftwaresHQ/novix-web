// /about. Safe to edit by hand. The four stages are in processData.js.
export const about = {
  meta: {
    title: 'About Novix Softwares | Our Software Team',
    description:
      'About Novix Softwares, a software company in Greater Noida, India: how we approach projects, who you will talk to and how we work with you.',
  },
  hero: {
    eyebrow: 'About Novix Softwares',
    heading: ['Built around your business. ', { hl: ['Designed to evolve.'] }],
    lead: 'We turn your workflows into software your team can use, own and improve.',
    story:
      'Novix Softwares is a software development company in Greater Noida, India. We build for startups, small firms and established businesses whose needs packaged software does not meet.',
    services: 'We design and build web and mobile apps, business systems and AI automation, and also offer cloud, design and digital marketing services.',
    link: { label: 'Explore services', to: '/services' },
  },
  glance: {
    title: 'At a glance',
    items: [
      { term: 'Based in', text: 'Greater Noida, India' },
      { term: 'We work with', text: 'Startups, small firms and established businesses' },
      { term: 'We build', text: 'Web and mobile apps, business systems and AI automation' },
    ],
    work: { term: 'Our work', label: 'See live websites in our portfolio', to: '/portfolio' },
  },
  approach: {
    eyebrow: 'Our approach',
    title: 'How we approach every project',
    principles: [
      { title: 'Built around your workflow', text: 'Understand how the business operates and design around the people using the software.' },
      { title: 'Engineered for reliability', text: 'Use testing, code review and practical performance and security checks.' },
      { title: 'Yours to own and extend', text: 'Provide agreed source-code handover and documentation so the software can be maintained and developed further.' },
    ],
    // Captions under the illustration: one per principle.
    captions: ['Workflow', 'Reliability', 'Ownership'],
  },
  // No individual profiles are published yet. Add names and photos here only when they are real and approved.
  people: {
    eyebrow: 'People behind the work',
    title: 'Who you will talk to',
    paragraphs: [
      'A project lead is your main contact. Bring them your questions about scope, dates and decisions.',
      'Design, development, testing and hosting work is planned around what your project needs.',
    ],
    tech: ['Curious about the tools? See ', { to: '/services#tech', content: ['the technology we build with'] }, '.'],
    reach: 'Reach us directly',
    hire: ['Want to add developers to your own team? ', { to: '/hire-dedicated-developers', content: ['Hire dedicated developers'] }, '.'],
  },
  working: {
    eyebrow: 'Working with us',
    title: 'What happens from first call to launch',
    description: 'The same four stages you see on our home page, with a little more detail.',
    expectTitle: 'What you can expect',
    expectations: [
      { title: 'Plain communication', text: 'Updates in everyday language from the people working on your project.' },
      { title: 'Feedback while it matters', text: 'You try work in progress and comment while changes are still straightforward.' },
      { title: 'Honest estimates', text: 'We say what we think is achievable, including when the answer is not what you hoped for.' },
      { title: 'A clear handover', text: 'What you receive, such as source code, designs, documentation and access, is agreed in advance.' },
      { title: 'Agreed support', text: 'Support after launch is agreed separately, including what it covers. New features are planned as new work.' },
    ],
    engagement: {
      title: 'Ways to work together',
      options: [
        { title: 'Fixed price', text: 'For work with a settled scope, with deliverables and milestones agreed first.' },
        { title: 'Dedicated team', text: 'Developers work with your team and are billed each month. Suits products that keep changing.' },
        { title: 'Hourly', text: 'Billed by the hour. Suits small changes, repairs and support.' },
      ],
      note: 'The best fit depends on how settled the scope is. We will talk it through with you.',
    },
  },
}
