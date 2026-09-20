import { useEffect, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { whatsappUrl } from '../data/content'
import { useBooking } from '../context/BookingContext'

const emptyForm = { name: '', date: '', message: '' }

const BookingModal = () => {
  const { open, service, closeBooking } = useBooking()
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') closeBooking()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeBooking])

  useEffect(() => {
    if (open) setForm(emptyForm)
  }, [open])

  if (!open) return null

  const today = new Date().toISOString().split('T')[0]
  const prettyDate = form.date
    ? new Date(`${form.date}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.date) return

    const text = [
      `Hi Geeta, I want to book ${service} at Geeta Makeovers.`,
      '',
      `Name: ${form.name.trim()}`,
      `Date: ${prettyDate}`,
      form.message.trim() ? `Message: ${form.message.trim()}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n')

    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
    closeBooking()
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      onClick={closeBooking}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/25 bg-white/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-200">Book with Geeta</p>
            <h2 id="booking-title" className="mt-2 font-display text-3xl text-ivory">
              Book {service}
            </h2>
            <p className="mt-1 text-sm text-ivory/65">Fill this in. We will open WhatsApp with your details.</p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            className="rounded-full p-1 text-ivory/70 transition hover:text-ivory"
            aria-label="Close booking form"
          >
            <IoIosCloseCircle className="h-9 w-9" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-ivory/60">Name</span>
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
              placeholder="Your name"
              className="booking-input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-ivory/60">Date</span>
            <input
              required
              type="date"
              name="date"
              min={today}
              value={form.date}
              onChange={onChange}
              className="booking-input"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-ivory/60">Message</span>
            <textarea
              name="message"
              rows="3"
              value={form.message}
              onChange={onChange}
              placeholder="Look, occasion, or anything we should know"
              className="booking-input min-h-[96px] resize-none"
            />
          </label>

          <button type="submit" className="btn-primary w-full">
            Book on WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
