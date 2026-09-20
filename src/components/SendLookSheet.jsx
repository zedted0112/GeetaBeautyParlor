import { useEffect, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { useParlor } from '../context/ParlorContext'
import { getVisitorId } from '../lib/visitor'
import { readLocalProfile } from '../lib/profile'
import { sendToGeeta } from '../lib/messages'

const SendLookSheet = ({ open, kind = 'look', refId, image, onClose, onSent }) => {
  const { visitorId } = useParlor()
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    setNote('')
    setBusy(false)
    setError('')

    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const data = new FormData(event.target)
    const body = String(data.get('note') || note || '').trim()
    const next = readLocalProfile()
    if (!next) {
      setError('Join the parlor first')
      return
    }

    setBusy(true)
    setError('')
    try {
      await sendToGeeta({
        visitorId: getVisitorId() || visitorId,
        name: next.name,
        avatar: next.avatar,
        kind,
        refId,
        body,
      })
      onSent?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Could not send to the studio. Try again.')
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(6.8rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="send-look-title"
    >
      <div
        className="max-h-[80dvh] w-full max-w-[22rem] overflow-y-auto rounded-2xl border border-white/25 bg-white/10 p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-brand-200">Send To Studio</p>
            <h2 id="send-look-title" className="mt-0.5 font-display text-xl leading-tight text-ivory">
              Add a note
            </h2>
            <p className="mt-0.5 text-[11px] leading-snug text-ivory/60">
              This look and your comment land on her desk.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-0.5 rounded-full p-0.5 text-ivory/70 transition hover:text-ivory"
            aria-label="Close note"
          >
            <IoIosCloseCircle className="h-7 w-7" />
          </button>
        </div>

        {image ? (
          <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
            <img src={image} alt="" className="h-36 w-full object-cover object-[center_20%]" />
          </div>
        ) : null}

        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/55">Comment</span>
            <textarea
              autoFocus
              name="note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={280}
              placeholder="Hair, jewellery, or anything Geeta should know"
              className="booking-input parlor-input min-h-[84px] resize-none"
            />
          </label>

          {error ? <p className="text-xs text-rose-200">{error}</p> : null}

          <button type="submit" className="btn-primary w-full !min-h-10 !py-2 !text-xs" disabled={busy}>
            {busy ? 'Sending…' : 'Send look'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SendLookSheet
