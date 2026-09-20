import { useEffect, useState } from 'react'
import { heroImages, serviceImages } from '../../utils/imageImports'
import { brand, stats } from '../../data/content'
import { scrollToId } from '../../utils/scroll'
import { useBooking } from '../../context/BookingContext'

const slides = [heroImages.brideBgTop1, serviceImages.bridal.studio1, heroImages.brideBgTop3].filter(Boolean)

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
          className={`absolute inset-0 bg-cover bg-[center_18%] transition-opacity duration-[1600ms] ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${src}')` }}
          aria-hidden={i !== index}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/85" />

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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-[min(92%,1100px)] flex-col items-center px-1 pb-[calc(4.4rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] text-center text-white sm:px-4 sm:pb-16 sm:pt-32">
        <div>
          <h1 className="hero-wordmark">
            <span className="hero-wordmark-name">Geeta</span>
            <span className="hero-wordmark-sub">Makeovers</span>
          </h1>
        </div>

        <div className="mt-auto flex w-full flex-col items-center">
          <div className="hero-cta" role="group" aria-label="Quick actions">
            <button type="button" aria-label="Book on WhatsApp" onClick={() => openBooking('an appointment')}>
              Book
            </button>
            <span className="hero-cta-rule" aria-hidden="true" />
            <button type="button" aria-label="Explore services" onClick={() => scrollToId('services')}>
              Explore
            </button>
          </div>

          <div className="mt-3 grid w-full max-w-sm grid-cols-3 gap-1.5 text-white/80 sm:mt-5 sm:flex sm:max-w-none sm:items-center sm:justify-center sm:gap-10">
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

        <blockquote className="hero-quote">
          <span className="hero-quote-mark" aria-hidden="true">
            “
          </span>
          <p>{brand.description}</p>
        </blockquote>
      </div>
    </section>
  )
}

export default HeroHome
