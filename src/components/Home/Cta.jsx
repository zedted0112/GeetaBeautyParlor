import { serviceImages } from '../../utils/imageImports'
import { brand, telUrl } from '../../data/content'
import { useBooking } from '../../context/BookingContext'

const Cta = () => {
  const { openBooking } = useBooking()

  return (
    <section
      id="contact"
      className="scroll-target relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${serviceImages.makeup.glamour}')` }}
    >
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative mx-auto flex w-[min(92%,900px)] flex-col items-center px-1 py-9 pb-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))] text-center text-white md:py-14 md:pb-14 lg:py-24">
        <p className="section-badge-light">Your next look</p>
        <h2 className="mt-3 font-display text-2xl font-semibold sm:mt-5 sm:text-4xl lg:text-5xl">
          Ready when you are
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/75 sm:mt-4 sm:text-lg">
          Send a date to {brand.owner}, or call the studio. We will find a time that fits your day.
        </p>
        <div className="hero-cta mt-5 sm:mt-8" role="group" aria-label="Contact actions">
          <button type="button" aria-label="Book with Geeta" onClick={() => openBooking('an appointment')}>
            Book
          </button>
          <span className="hero-cta-rule" aria-hidden="true" />
          <a href={telUrl} aria-label="Call the studio">
            Call
          </a>
        </div>
        <p className="mt-6 text-[11px] tracking-wider text-white/50 sm:mt-8">
          Website by <span className="text-white/80">HimalayanCoder</span>
        </p>
      </div>
    </section>
  )
}

export default Cta
