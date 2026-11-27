/**
 * Returns load(key), which gives the same promise every time. Once it settles it carries `status`
 * and `value`, so React's use() reads it without suspending. Prerendering and hydration rely on that.
 */
export function createGroupLoader(loaders) {
  const cache = new Map()
  return (key) => {
    let promise = cache.get(key)
    if (!promise) {
      promise = loaders[key]().then(
        (module) => {
          Object.assign(promise, { status: 'fulfilled', value: module.default })
          return module.default
        },
        (reason) => {
          Object.assign(promise, { status: 'rejected', reason })
          throw reason
        },
      )
      cache.set(key, promise)
    }
    return promise
  }
}

/** A page is its catalog entry plus its content. */
export const mergeContent = (catalog, group, slug) =>
  Object.hasOwn(catalog, slug) && group[slug] ? { ...catalog[slug], ...group[slug] } : undefined
