import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import { IoIosCloseCircle } from 'react-icons/io'
import { IoPerson } from 'react-icons/io5'
import { logoImages } from '../utils/imageImports'
import { brand, navItems } from '../data/content'
import { goToSection } from '../utils/scroll'
import { useBooking } from '../context/BookingContext'
import { useParlor } from '../context/ParlorContext'
import ParlorAvatar from './ParlorAvatar'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const { openBooking } = useBooking()
  const { profile, openLogin } = useParlor()
  const navigate = useNavigate()
  const location = useLocation()

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

  useEffect(() => {
    if (!isMenuOpen) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const goTo = (id) => {
    goToSection(id, navigate, location.pathname)
    setIsMenuOpen(false)
  }

  const openAccount = () => {
    setIsMenuOpen(false)
    if (profile) navigate('/me')
    else openLogin()
  }

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#14110f]/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md">
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

      <div className="mx-auto flex h-[72px] w-[min(92%,1200px)] items-center justify-between gap-3 md:h-[96px]">
        <Link
          to="/"
          onClick={() => goTo('home')}
          className="flex min-w-0 items-center"
        >
          <img
            src={logoImages.wordmark}
            alt={brand.name}
            className="h-11 w-auto max-w-[58vw] object-contain sm:h-16 md:h-[84px] md:max-w-none"
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

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openAccount}
            className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2 text-ivory transition hover:border-white/30 hover:bg-white/10 sm:px-3"
            aria-label={profile ? `${profile.name}, parlor self` : 'Login'}
          >
            {profile ? (
              <ParlorAvatar id={profile.avatar} size="sm" className="h-7 w-7 text-sm" />
            ) : (
              <IoPerson className="h-5 w-5" />
            )}
            <span className="hidden max-w-[5.5rem] truncate text-[11px] font-semibold uppercase tracking-wide sm:inline">
              {profile ? profile.name : 'Login'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false)
              openBooking('an appointment')
            }}
            className="inline-flex min-h-10 items-center rounded-full bg-brand-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-brand-400 sm:px-5 sm:py-2.5 sm:text-xs"
          >
            Book
          </button>
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
          isMenuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 pb-6 pt-2" aria-label="Mobile">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className="min-h-11 text-left text-base font-medium text-ivory"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="mt-1 flex min-h-11 items-center gap-3 text-left text-base font-medium text-ivory"
            onClick={openAccount}
          >
            {profile ? <ParlorAvatar id={profile.avatar} size="sm" /> : <IoPerson className="h-5 w-5" />}
            {profile ? profile.name : 'Login'}
          </button>
          <button
            type="button"
            className="btn-primary mt-2 w-full"
            onClick={() => {
              setIsMenuOpen(false)
              openBooking('an appointment')
            }}
          >
            Book with Geeta
          </button>
        </nav>
      </div>
    </header>
    {isMenuOpen && (
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/55 md:hidden"
        aria-label="Close menu"
        onClick={() => setIsMenuOpen(false)}
      />
    )}
    </>
  )
}

export default Header
