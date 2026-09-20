import { useEffect, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { whatsappUrl } from '../data/content'
import { useBooking } from '../context/BookingContext'
import { useParlor } from '../context/ParlorContext'
import { addVisit, prettyVisitDate } from '../lib/visits'

const emptyForm = { name: '', date: '', message: '' }

const BookingModal = () => {
  const { open, service, intent, closeBooking } = useBooking()
  const { profile, visitorId } = useParlor()
  const [form, setForm] = useState(emptyForm)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const planning = intent === 'plan'

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
    if (open) {
      setForm({ name: profile?.name || '', date: '', message: '' })
      setBusy(false)
      setError('')
    }
  }, [open, profile])

  if (!open) return null

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const data = new FormData(event.target)
    const name = String(data.get('name') || form.name || '').trim()
    const date = String(data.get('date') || form.date || '')
    const message = String(data.get('message') || form.message || '').trim()
    setForm({ name, date, message })

    if (!name || !date) {
      setError('Add your name and a date.')
      return
    }

    if (planning) {
      setBusy(true)
      setError('')
      try {
        await addVisit(visitorId, { name, service, date, message })
        closeBooking()
      } catch (err) {
        setError(err.message || 'Could not save this plan. Try again.')
        setBusy(false)
      }
      return
    }

    const text = [
      `Hi Geeta, I want to book ${service} at Geeta Makeovers.`,
      '',
      `Name: ${name}`,
      `Date: ${prettyVisitDate(date)}`,
      message ? `Message: ${message}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n')

    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
    closeBooking()
  }

  return (
    <div
      className={`fixed inset-0 z-[90] flex justify-center bg-black/60 backdrop-blur-md ${
        planning ? 'items-center p-4' : 'items-end p-0 sm:items-center sm:p-4'
      }`}
      onClick={closeBooking}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        className={`w-full overflow-y-auto border border-white/25 bg-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl ${
          planning
            ? 'max-h-[80dvh] max-w-[22rem] rounded-2xl p-3.5 sm:p-4'
            : 'max-h-[92dvh] max-w-md rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:p-8 sm:pb-8'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {planning ? null : <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/25 sm:hidden" />}
        <div className={`flex items-start justify-between gap-3 ${planning ? 'mb-3' : 'mb-5 sm:mb-6'}`}>
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-brand-200 sm:text-[10px]">
              {planning ? 'Your parlor' : 'Book with Geeta'}
            </p>
            <h2
              id="booking-title"
              className={`font-display leading-tight text-ivory ${
                planning ? 'mt-0.5 text-xl' : 'mt-2 text-[1.7rem] sm:text-3xl'
              }`}
            >
              {planning ? 'Plan a visit' : `Book ${service}`}
            </h2>
            <p className={`text-ivory/65 ${planning ? 'mt-0.5 text-[11px]' : 'mt-1 text-sm'}`}>
              {planning
                ? 'Save a date here. Book on WhatsApp from Planned when you are ready.'
                : 'Fill this in. We will open WhatsApp with your details.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            className="rounded-full p-0.5 text-ivory/70 transition hover:text-ivory"
            aria-label={planning ? 'Close plan form' : 'Close booking form'}
          >
            <IoIosCloseCircle className={planning ? 'h-7 w-7' : 'h-9 w-9'} />
          </button>
        </div>

        <form className={planning ? 'space-y-3' : 'space-y-4'} onSubmit={onSubmit}>
          <label className="block">
            <span className={`mb-1 block uppercase tracking-[0.14em] text-ivory/60 ${planning ? 'text-[10px]' : 'text-xs'}`}>
              Name
            </span>
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
              placeholder="Your name"
              className={`booking-input ${planning ? 'parlor-input' : ''}`}
            />
          </label>

          <label className="block">
            <span className={`mb-1 block uppercase tracking-[0.14em] text-ivory/60 ${planning ? 'text-[10px]' : 'text-xs'}`}>
              Date
            </span>
            <input
              required
              type="date"
              name="date"
              min={today}
              value={form.date}
              onInput={onChange}
              onChange={onChange}
              className={`booking-input ${planning ? 'parlor-input' : ''}`}
            />
          </label>

          <label className="block">
            <span className={`mb-1 block uppercase tracking-[0.14em] text-ivory/60 ${planning ? 'text-[10px]' : 'text-xs'}`}>
              Note
            </span>
            <textarea
              name="message"
              rows={planning ? '2' : '3'}
              value={form.message}
              onChange={onChange}
              placeholder="Look, occasion, or anything we should know"
              className={`booking-input resize-none ${planning ? 'parlor-input min-h-[64px]' : 'min-h-[84px] sm:min-h-[96px]'}`}
            />
          </label>

          {error ? <p className="text-xs text-rose-200">{error}</p> : null}

          <button type="submit" className={`btn-primary w-full ${planning ? '!min-h-10 !py-2 !text-xs' : ''}`} disabled={busy}>
            {planning ? (busy ? 'Saving…' : 'Save plan') : 'Book on WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
