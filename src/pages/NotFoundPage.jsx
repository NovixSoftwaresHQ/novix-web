import Button from '../components/ui/Button.jsx'
import { usePageMeta } from '../hooks/usePageMeta.js'

export default function NotFoundPage() {
  usePageMeta({ title: 'Page not found' })
  return (
    <div className="container-page section text-center">
      <p className="font-mono text-sm text-primary">404</p>
      <h1 className="heading-display mt-3 text-4xl">Page not found</h1>
      <p className="mt-4">The page you are looking for does not exist or has moved.</p>
      <Button to="/" arrow className="mt-8">Back to home</Button>
    </div>
  )
}
