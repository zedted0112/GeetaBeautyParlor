import { useEffect, useRef, useState } from 'react'
import { serviceImages } from '../../utils/imageImports'
import { services } from '../../data/content'
import { useBooking } from '../../context/BookingContext'
import { useGallery } from '../../context/GalleryContext'

const images = {
  bridal: serviceImages.bridal.studio1,
  makeup: serviceImages.makeup.main,
  hair: serviceImages.hair.main,
  facial: serviceImages.facial.main,
  spa: serviceImages.spa.main,
  waxing: serviceImages.waxing.main,
}

const orderedServices = [
  ...services.filter((service) => service.id === 'bridal'),
  ...services.filter((service) => service.id !== 'bridal'),
]

const SNAP = 0.16

const readTargets = (track) => {
  const center = track.scrollLeft + track.clientWidth / 2
  let best = 0
  let bestDist = Infinity
  const targets = [...track.children].map((card, index) => {
    const mid = card.offsetLeft + card.offsetWidth / 2
    const dist = Math.abs(mid - center)
    const t = Math.max(0, 1 - dist / card.offsetWidth)
    if (dist < bestDist) {
      bestDist = dist
      best = index
    }
    return t * t * (3 - 2 * t)
  })
  return { targets, best }
}

const applyPops = (track, values) => {
  ;[...track.children].forEach((card, index) => {
    card.style.setProperty('--pop', values[index].toFixed(3))
  })
}

const Services = () => {
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const popsRef = useRef([])
  const draggingRef = useRef(false)
  const rafRef = useRef(0)
  const { openBooking } = useBooking()
  const { openGallery } = useGallery()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = () => {
      rafRef.current = 0
      const { targets, best } = readTargets(track)
      if (!popsRef.current.length) popsRef.current = targets.slice()
      const snap = reduce || draggingRef.current ? 1 : SNAP
      let moving = false
      const next = targets.map((target, index) => {
        const current = popsRef.current[index] ?? target
        const value = current + (target - current) * snap
        if (Math.abs(value - target) > 0.008) moving = true
        return Math.abs(value - target) < 0.008 ? target : value
      })
      popsRef.current = next
      applyPops(track, next)
      setActive((prev) => (prev === best ? prev : best))
      if (moving) rafRef.current = window.requestAnimationFrame(tick)
    }

    const kick = () => {
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(tick)
    }

    const onPointerDown = () => {
      draggingRef.current = true
    }
    const onPointerUp = () => {
      draggingRef.current = false
      kick()
    }

    tick()
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)
    track.addEventListener('touchstart', onPointerDown, { passive: true })
    track.addEventListener('touchend', onPointerUp, { passive: true })
    track.addEventListener('scroll', kick, { passive: true })
    return () => {
      window.cancelAnimationFrame(rafRef.current)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
      track.removeEventListener('touchstart', onPointerDown)
      track.removeEventListener('touchend', onPointerUp)
      track.removeEventListener('scroll', kick)
    }
  }, [])

  const renderCard = (service, pop = false) => {
    const isBridal = service.id === 'bridal'

    return (
      <article
        key={service.id}
        className={`group flex h-full w-[min(78vw,22rem)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none sm:rounded-3xl ${
          pop ? 'service-tab' : ''
        }`}
        style={pop && service.id === orderedServices[0].id ? { '--pop': 1 } : undefined}
      >
        {pop ? <span className="service-tab-veil" aria-hidden="true" /> : null}
        <div className="service-photo relative">
          <img
            src={images[service.image]}
            alt={service.name}
            className="transition duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        </div>
        <div className="px-3 py-2.5 sm:px-4 sm:py-3">
          <h3 className="font-display text-base text-ivory sm:text-lg">{service.name}</h3>
          <p className="mt-0.5 text-[11px] leading-snug text-ivory/60 sm:mt-1 sm:text-xs">{service.blurb}</p>
          {isBridal ? (
            <button
              type="button"
              onClick={() => openGallery()}
              className="mt-1.5 inline-flex text-[11px] font-semibold text-brand-300 transition hover:text-brand-200 sm:mt-2.5 sm:text-xs"
            >
              <span className="sm:hidden">Gallery →</span>
              <span className="hidden sm:inline">View bride shoots →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openBooking(service.name)}
              className="mt-1.5 inline-flex text-[11px] font-semibold text-brand-300 transition hover:text-brand-200 sm:mt-2.5 sm:text-xs"
            >
              Book this →
            </button>
          )}
        </div>
      </article>
    )
  }

  return (
    <section id="services" className="scroll-target bg-sand">
      <div className="mx-auto w-[min(92%,1360px)] py-9 sm:py-14 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-badge">What we do</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ivory sm:mt-5 sm:text-4xl lg:text-5xl">
            Services, not a catalogue
          </h2>
          <p className="mt-2 text-sm text-ivory/70 sm:mt-4 sm:text-lg">
            Choose what you need. We will build the look around your day, your jewellery, and your light.
          </p>
        </div>

        <div className="relative -mx-[4vw] mt-6 sm:hidden">
          <div
            ref={trackRef}
            className="service-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1"
          >
            {orderedServices.map((service) => renderCard(service, true))}
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {orderedServices.map((service, index) => (
              <span
                key={service.id}
                className={`h-1.5 rounded-full transition ${
                  index === active ? 'w-5 bg-brand-400' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-14 hidden items-stretch gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {orderedServices.map((service) => renderCard(service))}
        </div>
      </div>
    </section>
  )
}

export default Services
