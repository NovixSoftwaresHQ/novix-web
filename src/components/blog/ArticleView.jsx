import { CalendarDays, Check, Clock, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { articleDetails } from '../../data/articlesData.js'
import { articles } from '../../data/contentRoutes.js'
import { blog, blogCategories, blogTags } from '../../data/blogData.js'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import { articleNode } from '../../seo/head.js'
import Badge from '../ui/Badge.jsx'
import PageHero from '../ui/PageHero.jsx'
import { Blocks } from '../ui/RichText.jsx'
import ArticleCard, { Cover, TagList } from './ArticleCard.jsx'

export default function ArticleView({ path }) {
  const article = articleDetails[path]
  const post = blog.posts.find((item) => item.path === path)
  const { date, dateLabel } = articles.find((item) => item.path === path)
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.category }]
  usePageMeta({
    title: article.meta.title, description: article.meta.description, path, exact: true, ogType: 'article', crumbs,
    nodes: [articleNode({ path, headline: article.heading, description: article.meta.description, image: article.image, datePublished: date })],
  })
  const related = blog.posts.filter((item) => article.related.includes(item.path))
  const metaIcons = [User, Clock]

  return (
    <>
      <PageHero crumbs={crumbs}>
        <div className="mx-auto mt-6 max-w-4xl text-center">
          <Badge tone="brand">{article.badge}</Badge>
          <h1 className="heading-display mt-6 text-balance text-3xl leading-tight sm:text-5xl">{article.heading}</h1>
          <p className="mt-5 text-lg leading-8">{article.summary}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <li className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4" /><time dateTime={date}>{dateLabel}</time></li>
            {article.meta2.map((item, index) => {
              const Icon = metaIcons[index % metaIcons.length]
              return <li key={item} className="flex items-center gap-2"><Icon aria-hidden="true" className="h-4 w-4" />{item}</li>
            })}
          </ul>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {article.highlights.map((item) => <li key={item} className="flex items-center gap-2"><Check aria-hidden="true" className="h-4 w-4 text-primary" />{item}</li>)}
          </ul>
        </div>
      </PageHero>

      <div className="container-page grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0">
          <Cover priority src={article.image} alt={article.imageAlt} sizes="(min-width: 1024px) 60rem, 100vw" className="aspect-video rounded-card border border-edge" />
          <div className="mt-10 max-w-3xl"><Blocks blocks={article.body} /></div>
          <div className="mt-12 border-t border-edge pt-6">
            <h2 className="mb-3 text-sm font-semibold">Tags</h2>
            <TagList tags={article.tags} />
          </div>
        </article>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Categories" className="card p-5">
            <h2 className="text-sm font-semibold">Categories</h2>
            <ul className="mt-3 space-y-1">
              {blogCategories.map((category) => {
                const active = category.label === post.category
                return (
                  <li key={category.to}>
                    <Link to={category.to} className={`block rounded-lg px-3 py-2 text-sm font-medium ${active ? 'bg-tint text-primary' : 'hover:bg-raised'}`}>
                      {category.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="card p-5">
            <h2 className="mb-3 text-sm font-semibold">Tags</h2>
            <TagList tags={blogTags} />
          </div>
        </aside>
      </div>

      <section aria-labelledby="related-posts" className="section surface-alt border-t border-edge">
        <div className="container-page">
          <h2 id="related-posts" className="heading-section text-2xl">{article.relatedTitle}</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <li key={item.path}><ArticleCard post={item} heading="h3" /></li>)}
          </ul>
        </div>
      </section>
    </>
  )
}
