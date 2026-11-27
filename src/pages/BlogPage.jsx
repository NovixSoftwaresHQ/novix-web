import ArticleView from '../components/blog/ArticleView.jsx'
import BlogListing from '../components/blog/BlogListing.jsx'
import { articleDetails } from '../data/articlesData.js'
import { archiveDetails } from '../data/blogData.js'

/** Serves /blog, both articles and all category/tag archives. */
export default function BlogPage({ route = { path: '/blog' } }) {
  if (Object.hasOwn(articleDetails, route.path)) return <ArticleView path={route.path} />
  return <BlogListing path={route.path} archive={archiveDetails[route.path]} />
}
