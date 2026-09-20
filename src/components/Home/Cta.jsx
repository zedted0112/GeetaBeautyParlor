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
      <div className="relative mx-auto flex w-[min(92%,900px)] flex-col items-center px-1 py-9 text-center text-white sm:py-14 lg:py-24">
        <p className="section-badge-light">Your next look</p>
        <h2 className="mt-3 font-display text-2xl font-semibold sm:mt-5 sm:text-4xl lg:text-5xl">
          Ready when you are
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/75 sm:mt-4 sm:text-lg">
          Message {brand.owner} on WhatsApp or call the studio. We will find a time that fits your day.
        </p>
        <div className="mt-5 flex w-full max-w-xs flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
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
