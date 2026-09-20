import { useEffect, useRef, useState } from 'react'
import { IoCalendar, IoHeart, IoSparkles } from 'react-icons/io5'
import { RiInstagramFill } from 'react-icons/ri'
import { contact, navItems } from '../data/content'
import { logoImages } from '../utils/imageImports'
import { scrollToId } from '../utils/scroll'
import { useBooking } from '../context/BookingContext'
import { useGallery } from '../context/GalleryContext'

const TIPS = {
  home: 'The studio',
  about: 'Meet Geeta',
  services: 'Bridal looks',
  instagram: 'See the looks',
  book: 'Pick a date',
}

const ICONS = {
  about: IoHeart,
  services: IoSparkles,
}

const Dock = () => {
  const [activeId, setActiveId] = useState('home')
  const [mouseX, setMouseX] = useState(null)
  const [bounce, setBounce] = useState(null)
  const itemRefs = useRef([])
  const { open, openBooking } = useBooking()
  const { open: galleryOpen, openGallery } = useGallery()

  const items = [
    ...navItems.filter((item) => item.id !== 'contact'),
    { id: 'instagram', label: 'Instagram', href: contact.instagramUrl },
    { id: 'book', label: 'Book' },
  ].map((item, index) => ({ ...item, index }))

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

  if (open || galleryOpen) return null

  const metricsFor = (index) => {
    if (bounce !== null || mouseX === null) return { scale: 1, y: 0 }
    const el = itemRefs.current[index]
    if (!el) return { scale: 1, y: 0 }
    const rect = el.getBoundingClientRect()
    const dist = Math.abs(mouseX - (rect.left + rect.width / 2))
    const t = Math.max(0, 1 - dist / 78)
    const curve = t * t * (3 - 2 * t)
    return {
      scale: 1 + curve * 0.62,
      y: -curve * 18,
    }
  }

  const bounceIcon = (index) => {
    setBounce(index)
    window.setTimeout(() => setBounce(null), 520)
  }

  return (
    <div className="pointer-events-none fixed bottom-[max(0.7rem,env(safe-area-inset-bottom))] left-1/2 z-[70] -translate-x-1/2">
      <nav
        aria-label="Quick"
        className="dock-glass pointer-events-auto flex items-center gap-1.5 rounded-full px-3 sm:gap-2 sm:px-4"
        onMouseMove={(event) => {
          if (bounce !== null) return
          setMouseX(event.clientX)
        }}
        onMouseLeave={() => setMouseX(null)}
      >
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
          <defs>
            <linearGradient id="dockSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff4b0" />
              <stop offset="35%" stopColor="#ffb347" />
              <stop offset="70%" stopColor="#ff7eb3" />
              <stop offset="100%" stopColor="#c08d70" />
            </linearGradient>
          </defs>
        </svg>
        {items.map((item) => {
          const isHome = item.id === 'home'
          const isAbout = item.id === 'about'
          const isServices = item.id === 'services'
          const isIg = item.id === 'instagram'
          const isBook = item.id === 'book'
          const Icon = isBook ? IoCalendar : ICONS[item.id]
          const { scale, y } = metricsFor(item.index)
          const isActive = !isBook && !isIg && activeId === item.id
          const motion = {
            '--dock-scale': scale,
            '--dock-y': `${y}px`,
            transform: `translateY(${y}px) scale(${scale})`,
          }

          return (
            <span key={item.id} className="flex items-center">
              {item.id === 'book' ? (
                <span className="mx-1 hidden h-5 w-px bg-white/25 sm:mx-1.5 sm:block" />
              ) : null}
              <button
                ref={(node) => {
                  itemRefs.current[item.index] = node
                }}
                type="button"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`dock-item group/dock relative flex items-center justify-center ${
                  isBook ? 'text-brand-300' : ''
                }`}
                onClick={() => {
                  setMouseX(null)
                  bounceIcon(item.index)
                  if (isBook) openBooking('an appointment')
                  else if (isServices) openGallery()
                  else if (item.href) window.open(item.href, '_blank', 'noopener,noreferrer')
                  else scrollToId(item.id)
                }}
              >
                <span className="dock-tip">{TIPS[item.id] || item.label}</span>
                {isHome ? (
                  <img
                    src={logoImages.primary}
                    alt=""
                    className={`dock-icon dock-logo h-7 w-7 object-contain brightness-0 invert sm:h-8 sm:w-8 ${
                      bounce === item.index ? 'is-bounce' : ''
                    }`}
                    style={motion}
                  />
                ) : isAbout ? (
                  <IoHeart
                    className={`dock-icon dock-heart h-5 w-5 sm:h-[22px] sm:w-[22px] ${
                      bounce === item.index ? 'is-bounce' : ''
                    }`}
                    style={motion}
                  />
                ) : isServices ? (
                  <IoSparkles
                    className={`dock-icon dock-sparkle h-5 w-5 drop-shadow-sm sm:h-[22px] sm:w-[22px] ${
                      bounce === item.index ? 'is-bounce' : ''
                    }`}
                    style={motion}
                  />
                ) : isIg ? (
                  <span
                    className={`dock-icon dock-ig ${bounce === item.index ? 'is-bounce' : ''}`}
                    style={motion}
                  >
                    <RiInstagramFill className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <Icon
                    className={`dock-icon h-5 w-5 drop-shadow-sm sm:h-[22px] sm:w-[22px] ${
                      bounce === item.index ? 'is-bounce' : ''
                    }`}
                    style={motion}
                  />
                )}
                {isActive ? (
                  <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand-300" />
                ) : null}
              </button>
            </span>
          )
        })}
      </nav>
    </div>
  )
}

export default Dock
