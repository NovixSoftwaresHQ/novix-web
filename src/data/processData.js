// The one four-stage process. Home shows `summary`, About shows `detail`, and /services uses the same stages.
export const stages = [
  {
    title: 'Understand',
    summary: 'We learn how your team works, who will use the software and what it needs to achieve.',
    detail:
      'We start with how your team works today, who will use the software and what it needs to change. Together we set priorities, then agree the scope and an estimate.',
  },
  {
    title: 'Plan & design',
    summary: 'You review screen designs and the technical plan before development starts.',
    detail:
      'You review user flows, screen designs and the technical plan before development starts, while changes are still easy to make.',
  },
  {
    title: 'Build',
    summary: 'We build in stages and show you working software as it develops.',
    detail:
      'We build in stages and show you working software along the way. Your feedback shapes the next stage, and any change to the agreed scope is discussed before we make it.',
  },
  {
    title: 'Launch & support',
    summary: 'We test, release and hand over as agreed, then provide the support you choose.',
    detail:
      'We test and release the software, hand over the source code and documentation as agreed, and set out what support covers after launch.',
  },
]

export const summarySteps = stages.map(({ title, summary }) => ({ title, text: summary }))
