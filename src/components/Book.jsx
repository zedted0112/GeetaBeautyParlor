import { useEffect } from 'react'
import { useBooking } from '../context/BookingContext'

const Book = () => {
  const { openBooking } = useBooking()

  useEffect(() => {
    openBooking('an appointment')
  }, [openBooking])

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-cream px-5 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-24">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-ivory sm:text-4xl">Book with Geeta</h1>
        <p className="mt-3 text-ivory/70">
          Fill the form to send your name, date, and message on WhatsApp.
        </p>
        <button type="button" className="btn-primary mt-8 w-full sm:w-auto" onClick={() => openBooking('an appointment')}>
          Open booking form
        </button>
      </div>
    </main>
  )
}

export default Book
