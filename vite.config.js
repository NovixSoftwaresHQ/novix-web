import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveSiteEnv } from './scripts/site-env.mjs'

export default defineConfig(() => {
  // Throws, and so fails the build, when a release has no valid production origin.
  const site = resolveSiteEnv()
  return {
    plugins: [react()],
    define: {
      __SITE_ORIGIN__: JSON.stringify(site.origin),
      __SITE_INDEXABLE__: JSON.stringify(site.indexable),
    },
  }
})
