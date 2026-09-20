import { RiWhatsappFill } from 'react-icons/ri'
import { useBooking } from '../context/BookingContext'

const WhatsAppButton = () => {
  const { openBooking } = useBooking()

  return (
    <button
      type="button"
      onClick={() => openBooking('an appointment')}
      aria-label="Book on WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
    >
      <RiWhatsappFill className="h-6 w-6 sm:h-7 sm:w-7" />
    </button>
  )
}

export default WhatsAppButton
