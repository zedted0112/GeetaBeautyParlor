import { serviceImages } from '../../utils/imageImports'
import { brand, contact, telUrl } from '../../data/content'
import { useBooking } from '../../context/BookingContext'

const Cta = () => {
  const { openBooking } = useBooking()

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${serviceImages.makeup.glamour}')` }}
    >
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative mx-auto flex w-[min(92%,900px)] flex-col items-center px-1 py-14 text-center text-white lg:py-24">
        <p className="section-badge-light">Your next look</p>
        <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Ready when you are
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/75 sm:text-lg">
          Message {brand.owner} on WhatsApp or call the studio. We will find a time that fits your day.
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => openBooking('an appointment')}>
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">WhatsApp {contact.phoneDisplay}</span>
          </button>
          <a href={telUrl} className="btn-secondary w-full sm:w-auto">
            Call the studio
          </a>
        </div>
      </div>
    </section>
  )
}

export default Cta
