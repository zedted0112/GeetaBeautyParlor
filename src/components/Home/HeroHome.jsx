import { useEffect, useState } from 'react'
import { heroImages } from '../../utils/imageImports'
import { brand, stats, whatsappUrl } from '../../data/content'
import { scrollToId } from '../../utils/scroll'

const slides = [heroImages.homeMain, heroImages.homeAlt, heroImages.aboutMain].filter(Boolean)

const HeroHome = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
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
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(92%,1100px)] flex-col items-center justify-center px-4 pb-20 pt-28 text-center text-white">
        <p className="section-badge-light mb-6">{brand.locationShort} · 15 years of craft</p>
        <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          {brand.name}
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-light text-white/90 sm:text-xl">
          {brand.description}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn-primary">
            Book on WhatsApp
          </a>
          <button type="button" className="btn-secondary" onClick={() => scrollToId('services')}>
            Explore services
          </button>
        </div>

        <div className="mt-14 flex items-center gap-6 text-white/80 sm:gap-10">
          {stats.map((item, i) => (
            <div key={item.label} className="flex items-center gap-6 sm:gap-10">
              {i > 0 && <div className="h-10 w-px bg-white/25" />}
              <div>
                <p className="font-display text-2xl text-white sm:text-3xl">{item.value}</p>
                <p className="text-xs uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroHome
