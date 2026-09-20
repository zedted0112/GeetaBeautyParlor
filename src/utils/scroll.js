function headerOffset() {
  return window.matchMedia('(min-width: 768px)').matches ? 96 : 76
}

export function scrollToId(id) {
  if (!id || id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const element = document.getElementById(id)
  if (!element) return

  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top, behavior: 'smooth' })
}

const SECTION_IDS = new Set(['home', 'about', 'services', 'contact'])

export function scrollToHash() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (!SECTION_IDS.has(hash)) return
  setTimeout(() => scrollToId(hash), 80)
}

export function goToSection(id, navigate, pathname) {
  if (pathname && pathname !== '/') {
    navigate('/')
    window.setTimeout(() => scrollToId(id), 80)
    return
  }
  scrollToId(id)
}
