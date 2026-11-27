/** Moves focus to the page content, for when the element it should go back to no longer exists. */
export function focusMain() {
  const main = document.getElementById('main')
  if (!main) return
  // Focusable only while it holds focus, so that clicking in the page never moves focus to <main>.
  main.setAttribute('tabindex', '-1')
  main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true })
  main.focus({ preventScroll: true })
}
