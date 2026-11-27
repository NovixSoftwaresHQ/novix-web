import { Check } from 'lucide-react'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import PageHero from '../components/ui/PageHero.jsx'
import { Blocks, Inline } from '../components/ui/RichText.jsx'
import { legalDocuments } from '../data/legalData.js'
import { usePageMeta } from '../hooks/usePageMeta.js'

// Legal text is rendered verbatim from legalData.js; it is never generated or summarised.
export default function LegalPage({ route }) {
  const doc = legalDocuments[route.path]
  const crumbs = [{ label: 'Home', to: '/' }, { label: route.title }]
  usePageMeta({ title: doc.meta.title, description: doc.meta.description, path: route.path, exact: true, crumbs })

  return (
    <>
      <PageHero crumbs={crumbs}>
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <Badge tone="brand">{doc.badge}</Badge>
          <h1 className="heading-display mt-6 text-4xl sm:text-5xl"><Inline nodes={doc.heading} /></h1>
          <p className="mt-5 text-lg leading-8"><Inline nodes={doc.intro} /></p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            {doc.highlights.map((item) => <li key={item} className="flex items-center gap-2"><Check aria-hidden="true" className="h-4 w-4 text-primary" />{item}</li>)}
          </ul>
        </div>
      </PageHero>
      <article className="container-page border-t border-edge py-16">
        <div className="mx-auto max-w-3xl">
          <Blocks blocks={doc.blocks} />
          {doc.cross && (
            <div className="card mt-14 flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{doc.cross.title}</h2>
                <p className="mt-1 text-sm leading-6">{doc.cross.text}</p>
              </div>
              <Button variant="secondary" to={doc.cross.link.to} arrow>{doc.cross.link.label}</Button>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
