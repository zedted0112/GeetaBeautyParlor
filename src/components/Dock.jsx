import { useEffect, useRef, useState } from 'react'
import { IoCalendar, IoCall, IoHeart, IoSparkles } from 'react-icons/io5'
import { navItems } from '../data/content'
import { logoImages } from '../utils/imageImports'
import { scrollToId } from '../utils/scroll'
import { useBooking } from '../context/BookingContext'

const ICONS = {
  about: IoHeart,
  services: IoSparkles,
  contact: IoCall,
}

const Dock = () => {
  const [activeId, setActiveId] = useState('home')
  const [mouseX, setMouseX] = useState(null)
  const [bounce, setBounce] = useState(null)
  const itemRefs = useRef([])
  const { open, openBooking } = useBooking()

  const items = [
    ...navItems.map((item, index) => ({ ...item, index })),
    { id: 'book', label: 'Book', index: navItems.length },
  ]

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

  if (open) return null

  const metricsFor = (index) => {
    if (mouseX === null) return { scale: 1, y: 0 }
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
        onMouseMove={(event) => setMouseX(event.clientX)}
        onMouseLeave={() => setMouseX(null)}
        onPointerDown={(event) => setMouseX(event.clientX)}
        onPointerUp={() => window.setTimeout(() => setMouseX(null), 320)}
        onPointerCancel={() => setMouseX(null)}
      >
        {items.map((item) => {
          const isHome = item.id === 'home'
          const isBook = item.id === 'book'
          const Icon = isBook ? IoCalendar : ICONS[item.id]
          const { scale, y } = metricsFor(item.index)
          const isActive = !isBook && activeId === item.id
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
                  bounceIcon(item.index)
                  if (isBook) openBooking('an appointment')
                  else scrollToId(item.id)
                }}
              >
                <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/dock:opacity-100">
                  {item.label}
                </span>
                {isHome ? (
                  <img
                    src={logoImages.primary}
                    alt=""
                    className={`dock-icon dock-logo h-7 w-7 object-contain brightness-0 invert sm:h-8 sm:w-8 ${
                      bounce === item.index ? 'is-bounce' : ''
                    }`}
                    style={motion}
                  />
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
