import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { IoIosCloseCircle } from 'react-icons/io'
import { logoImages } from '../utils/imageImports'
import { brand, navItems, whatsappUrl } from '../data/content'
import { scrollToId } from '../utils/scroll'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    )

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const goTo = (id) => {
    scrollToId(id)
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#14110f]/95 shadow-sm backdrop-blur-md">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        onClick={(e) => {
          e.preventDefault()
          goTo('home')
        }}
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[96px] w-[min(92%,1200px)] items-center justify-between">
        <Link
          to="/"
          onClick={() => goTo('home')}
          className="flex items-center"
        >
          <img
            src={logoImages.wordmark}
            alt={brand.name}
            className="h-16 w-auto object-contain sm:h-20 md:h-[84px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className={`nav-link text-ivory/80 hover:text-brand-300 ${
                activeId === item.id ? 'nav-link-active text-ivory' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-brand-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-400 sm:inline-flex"
          >
            Book
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-ivory md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <IoIosCloseCircle className="h-8 w-8" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden bg-[#14110f] transition-all duration-300 md:hidden ${
          isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-4 px-6 pb-6 pt-2" aria-label="Mobile">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className="text-left text-base font-medium text-ivory"
            >
              {item.label}
            </button>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            Book on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
