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
          <div className="absolute bottom-[5.5rem] left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full border border-white transition ${
                  i === index ? 'bg-white' : 'bg-transparent hover:bg-white/50'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(92%,1100px)] flex-col items-center justify-center px-1 pb-28 pt-[calc(5.5rem+env(safe-area-inset-top))] text-center text-white sm:px-4 sm:pb-20 sm:pt-28">
        <p className="section-badge-light mb-4 text-[10px] sm:mb-6 sm:text-xs">{brand.locationShort} · 15 years of craft</p>
        <h1 className="font-display text-[2.35rem] font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          {brand.name}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-white/90 sm:mt-5 sm:text-xl">
          {brand.description}
        </p>

        <div className="mt-7 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => openBooking('an appointment')}>
            Book on WhatsApp
          </button>
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={() => scrollToId('services')}>
            Explore services
          </button>
        </div>

        <div className="mt-10 grid w-full max-w-md grid-cols-3 gap-2 text-white/80 sm:mt-14 sm:flex sm:max-w-none sm:items-center sm:justify-center sm:gap-10">
          {stats.map((item, i) => (
            <div key={item.label} className="flex items-center sm:gap-10">
              {i > 0 && <div className="mr-6 hidden h-10 w-px bg-white/25 sm:block" />}
              <div>
                <p className="font-display text-xl text-white sm:text-3xl">{item.value}</p>
                <p className="mt-0.5 text-[10px] uppercase leading-tight tracking-wider sm:text-xs">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroHome
