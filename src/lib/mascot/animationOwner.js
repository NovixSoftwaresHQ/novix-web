/** At most one mascot animates at a time. */
export function createAnimationOwner() {
  let owner = null
  return {
    claim(id) {
      if (owner !== null && owner !== id) return false
      owner = id
      return true
    },
    release(id) {
      if (owner === id) owner = null
    },
    current: () => owner,
  }
}
