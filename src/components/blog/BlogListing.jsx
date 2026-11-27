import { Filter, Search, SearchX, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { blog } from '../../data/blogData.js'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import PageHero from '../ui/PageHero.jsx'
import { Inline } from '../ui/RichText.jsx'
import ArticleCard from './ArticleCard.jsx'

/** /blog, and with `archive` set, a category or tag archive. */
export default function BlogListing({ path, archive }) {
  const meta = archive?.meta ?? blog.meta
  const crumbs = [
    { label: 'Home', to: '/' },
    ...(archive ? [{ label: 'Blog', to: '/blog' }, { label: archive.filterLabel }] : [{ label: 'Blog' }]),
  ]
  // Tag and category archives repeat the two article cards, so they stay out of search.
  usePageMeta({ title: meta.title, description: meta.description, path, exact: true, type: 'CollectionPage', crumbs, noindex: Boolean(archive) })
  const [query, setQuery] = useState('')
  const results = useRef(null)

  const posts = archive ? blog.posts.filter((post) => archive.posts.includes(post.path)) : blog.posts
  const needle = query.trim().toLowerCase()
  const visible = needle
    ? posts.filter((post) =>
        [post.searchText, post.title, post.category, post.author, ...post.cardTags.map((t) => t.label)].join(' ').toLowerCase().includes(needle),
      )
    : posts

  const submit = (event) => {
    event.preventDefault()
    results.current?.scrollIntoView()
  }

  return (
    <>
      <PageHero crumbs={crumbs}>
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <Badge tone="brand">{blog.hero.badge}</Badge>
          <h1 className="heading-display mt-6 text-balance text-4xl sm:text-5xl"><Inline nodes={archive?.heading ?? blog.hero.heading} /></h1>
          <p className="mt-5 text-lg leading-8">{blog.hero.subtitle}</p>
          <form role="search" onSubmit={submit} className="card mx-auto mt-8 flex max-w-xl items-center gap-2 p-1.5 pl-4 focus-within:ring-4 focus-within:ring-primary/20">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={blog.hero.placeholder}
              aria-label="Search articles, keywords, topics"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-heading outline-none"
            />
            <Button type="submit" size="sm">{blog.hero.searchLabel}</Button>
          </form>
        </div>
      </PageHero>

      <section ref={results} aria-label="Articles" className="section surface-alt border-t border-edge !pt-14">
        <div className="container-page">
          {archive && (
            <div className="card mb-8 flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <Filter aria-hidden="true" className="h-4 w-4 text-primary" />
                Filtering Articles By:
                <Badge tone="brand">{archive.filterLabel}</Badge>
                <span className="font-normal">({posts.length} {posts.length === 1 ? 'article' : 'articles'})</span>
              </p>
              <Button size="sm" variant="secondary" to="/blog"><X aria-hidden="true" className="h-4 w-4" />Clear Filter (Show All)</Button>
            </div>
          )}
          {visible.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post) => <li key={post.path}><ArticleCard post={post} /></li>)}
            </ul>
          ) : (
            <div className="card mx-auto max-w-lg p-10 text-center">
              <SearchX aria-hidden="true" className="mx-auto h-8 w-8 text-primary" />
              <h2 className="heading-section mt-4 text-xl">{blog.empty.title}</h2>
              <p className="mt-2 text-sm">{blog.empty.text}</p>
              <Button variant="secondary" className="mt-6" onClick={() => setQuery('')}>{blog.empty.reset}</Button>
            </div>
          )}
          {/* Counts always reflect this view; the live archives showed a mismatched total. */}
          <p role="status" className="mt-8 text-center text-sm">
            {visible.length > 0 ? `Showing 1 to ${visible.length} of ${posts.length} results` : `Showing 0 of ${posts.length} results`}
          </p>
        </div>
      </section>
    </>
  )
}
