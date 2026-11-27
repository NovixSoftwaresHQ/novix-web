import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'
import InteractiveCard from '../ui/InteractiveCard.jsx'

/** Cover image over a tinted block, so a failed remote image still leaves a tidy block. */
export function Cover({ src, alt, className = '', priority = false, sizes = '(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw' }) {
  // Unsplash serves any width, so offer sizes that suit phones as well as large screens.
  const srcSet = src.includes('images.unsplash.com')
    ? [480, 800, 1200].map((width) => `${src.replace(/([?&])w=\d+/, `$1w=${width}`)} ${width}w`).join(', ')
    : undefined
  return (
    <div className={`overflow-hidden bg-tint ${className}`}>
      <img src={src} srcSet={srcSet} sizes={srcSet && sizes} alt={alt} width="800" height="450" loading={priority ? 'eager' : 'lazy'} onError={(event) => (event.currentTarget.style.visibility = 'hidden')} className="h-full w-full object-cover" />
    </div>
  )
}

export function TagList({ tags }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag.to}>
          <Link to={tag.to} className="inline-block rounded-full border border-edge px-2.5 py-1 text-xs font-medium transition hover:border-primary/50 hover:text-primary">
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function ArticleCard({ post, heading: Heading = 'h2' }) {
  return (
    <InteractiveCard as="article" className="group flex h-full flex-col overflow-hidden">
      <Link to={post.path} tabIndex={-1} aria-hidden="true">
        <Cover src={post.image} alt="" className="aspect-video" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Badge tone="accent" className="self-start">{post.category}</Badge>
        <p className="mt-4 text-xs font-medium">{post.author}</p>
        <Heading className="mt-2 text-lg font-semibold leading-snug text-heading">
          <Link to={post.path} className="hover:text-primary">{post.title}</Link>
        </Heading>
        <p className="mt-3 line-clamp-3 text-sm leading-6">{post.summary}</p>
        <div className="mt-4"><TagList tags={post.cardTags} /></div>
        <Link to={post.path} className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-primary">
          Read article<span className="sr-only">: {post.title}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 nudge" />
        </Link>
      </div>
    </InteractiveCard>
  )
}
