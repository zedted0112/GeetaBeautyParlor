import { useEffect, useState } from 'react'
import { serviceImages } from '../../utils/imageImports'
import { about, brand } from '../../data/content'
import { useBooking } from '../../context/BookingContext'

const QUOTE_MS = 5200

const About = () => {
  const { openBooking } = useBooking()
  const quotes = about.quotes
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (quotes.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % quotes.length)
    }, QUOTE_MS)

    return () => window.clearInterval(timer)
  }, [index, quotes.length])

  return (
    <section id="about" className="scroll-target bg-cream">
      <div className="mx-auto w-[min(92%,1200px)] py-9 sm:py-14 lg:py-28">
        <p className="section-badge">{about.badge}</p>

        <div className="artist-frame shadow-card mt-5 sm:mt-7">
          <img
            src={serviceImages.makeup.artist}
            alt={`${brand.owner}, beauty artist at ${brand.name}`}
            className="artist-photo"
          />
          <div className="artist-shine" />
          <div className="artist-vignette" />
          <div className="artist-quote">
            <span className="artist-quote-mark" aria-hidden="true">
              “
            </span>
            <h2>{about.heading}</h2>
            <p key={index} className="artist-quote-text">
              {quotes[index]}
            </p>
            {quotes.length > 1 ? (
              <div className="artist-quote-dots">
                {quotes.map((quote, quoteIndex) => (
                  <button
                    key={quote}
                    type="button"
                    aria-label={`Show quote ${quoteIndex + 1}`}
                    className={quoteIndex === index ? 'is-active' : ''}
                    onClick={() => setIndex(quoteIndex)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => openBooking('a consultation')}
          className="btn-primary mt-5 w-full sm:mx-auto sm:mt-7 sm:flex sm:w-auto"
        >
          Book a consultation
        </button>
      </div>
    </section>
  )
}

export default About
