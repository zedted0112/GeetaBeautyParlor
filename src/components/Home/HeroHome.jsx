import { useEffect, useState } from 'react'
import { heroImages } from '../../utils/imageImports'
import { brand, stats } from '../../data/content'
import { scrollToId } from '../../utils/scroll'
import { useBooking } from '../../context/BookingContext'

const slides = [heroImages.homeMain, heroImages.homeAlt, heroImages.aboutMain].filter(Boolean)

const HeroHome = () => {
  const [index, setIndex] = useState(0)
  const { openBooking } = useBooking()

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${src}')` }}
          aria-hidden={i !== index}
        />
      ))}

      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-ink/40 p-3 text-white backdrop-blur-sm md:block"
            aria-label="Previous image"
            onClick={() => setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          >
            ←
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-ink/40 p-3 text-white backdrop-blur-sm md:block"
            aria-label="Next image"
            onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
          >
            →
          </button>
        </>
      )}

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(92%,1100px)] flex-col items-center justify-center px-1 pb-24 pt-[calc(5rem+env(safe-area-inset-top))] text-center text-white sm:px-4 sm:pb-20 sm:pt-28">
        <p className="section-badge-light mb-3 text-[10px] sm:mb-6 sm:text-xs">{brand.locationShort} · 15 years of craft</p>
        <h1 className="font-display text-[1.85rem] font-semibold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
          {brand.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[13px] font-light leading-relaxed text-white/90 sm:mt-5 sm:text-xl">
          {brand.description}
        </p>

        <div className="mt-5 flex w-full max-w-xs flex-col items-stretch gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => openBooking('an appointment')}>
            Book on WhatsApp
          </button>
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => scrollToId('services')}>
            Explore services
          </button>
        </div>

        <div className="mt-7 grid w-full max-w-sm grid-cols-3 gap-1.5 text-white/80 sm:mt-14 sm:flex sm:max-w-none sm:items-center sm:justify-center sm:gap-10">
          {stats.map((item, i) => (
            <div key={item.label} className="flex items-center sm:gap-10">
              {i > 0 && <div className="mr-6 hidden h-10 w-px bg-white/25 sm:block" />}
              <div>
                <p className="font-display text-lg text-white sm:text-3xl">{item.value}</p>
                <p className="mt-0.5 text-[9px] uppercase leading-tight tracking-wider sm:text-xs">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroHome
