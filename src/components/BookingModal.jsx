import { useEffect, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { useBooking } from '../context/BookingContext'
import { useParlor } from '../context/ParlorContext'
import { isAdminProfile, readLocalProfile } from '../lib/profile'
import { addVisit } from '../lib/visits'
import { sendToGeeta } from '../lib/messages'

const emptyForm = { name: '', date: '', time: '', message: '' }

const BookingModal = () => {
  const { open, service, intent, closeBooking } = useBooking()
  const { profile, visitorId, ensureProfile } = useParlor()
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
    if (!open) return undefined
    let alive = true
    if (!readLocalProfile()) {
      ensureProfile().then((ok) => {
        if (!alive) return
        if (!ok) closeBooking()
      })
    }
    return () => {
      alive = false
    }
  }, [open, ensureProfile, closeBooking])

  useEffect(() => {
    if (open) {
      setForm({ name: profile?.name || '', date: '', time: '', message: '' })
      setBusy(false)
      setError('')
    }
  }, [open, profile])

  if (!open) return null

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const onChange = (event) => {
    const { name, value } = event.target
    if (name === 'when') {
      const [date = '', time = ''] = value.split('T')
      setForm((current) => ({ ...current, date, time }))
      return
    }
    setForm((current) => ({ ...current, [name]: value }))
  }

  const whenValue = form.date ? `${form.date}T${form.time || '10:00'}` : ''

  const onSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const data = new FormData(event.target)
    const name = String(data.get('name') || form.name || '').trim()
    const when = String(data.get('when') || '')
    const [nextDate = '', nextTime = ''] = when.split('T')
    const date = nextDate || form.date || ''
    const time = nextTime || form.time || ''
    const message = String(data.get('message') || form.message || '').trim()
    setForm({ name, date, time, message })

    if (!name || !date) {
      setError('Add your name and a date.')
      return
    }

    if (planning) {
      setBusy(true)
      setError('')
      try {
        await addVisit(visitorId, { name, service, date, time, message })
        closeBooking()
      } catch (err) {
        setError(err.message || 'Could not save this plan. Try again.')
        setBusy(false)
      }
      return
    }

    if (isAdminProfile(readLocalProfile(), visitorId)) {
      setError('This desk receives client books.')
      return
    }

    setBusy(true)
    setError('')
    try {
      await addVisit(visitorId, { name, service, date, time, message })
      await sendToGeeta({
        visitorId,
        name,
        avatar: profile?.avatar,
        kind: 'book',
        date,
        time,
        service,
        body: message,
      })
      closeBooking()
    } catch (err) {
      setError(err.message || 'Could not send to the studio. Try again.')
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(6.8rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:p-6"
      onClick={closeBooking}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        className={`w-full overflow-hidden border border-white/25 bg-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl ${
          planning ? 'max-w-[22rem] rounded-2xl p-3.5' : 'max-w-[22rem] rounded-2xl p-4 sm:p-5'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-brand-200">
              {planning ? 'Your parlor' : 'Book with Geeta'}
            </p>
            <h2 id="booking-title" className="mt-0.5 font-display text-xl leading-tight text-ivory">
              {planning ? 'Plan a visit' : `Book ${service}`}
            </h2>
            <p className="mt-0.5 text-[11px] text-ivory/65">
              {planning
                ? 'Save a date here. Send it to the studio from Planned when you are ready.'
                : 'Geeta sees this on her parlor desk.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            className="rounded-full p-0.5 text-ivory/70 transition hover:text-ivory"
            aria-label={planning ? 'Close plan form' : 'Close booking form'}
          >
            <IoIosCloseCircle className="h-7 w-7" />
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/60">Name</span>
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
              placeholder="Your name"
              className="booking-input parlor-input"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/60">Date & time</span>
            <input
              required
              type="datetime-local"
              name="when"
              min={`${today}T00:00`}
              value={whenValue}
              onInput={onChange}
              onChange={onChange}
              className="booking-input parlor-input"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/60">Note</span>
            <textarea
              name="message"
              rows="2"
              value={form.message}
              onChange={onChange}
              placeholder="Look, occasion, or anything we should know"
              className="booking-input parlor-input min-h-[64px] resize-none"
            />
          </label>

          {error ? <p className="text-xs text-rose-200">{error}</p> : null}

          <button type="submit" className="btn-primary w-full !min-h-10 !py-2 !text-xs" disabled={busy}>
            {planning ? (busy ? 'Saving…' : 'Save plan') : busy ? 'Sending…' : 'Send To Studio'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
