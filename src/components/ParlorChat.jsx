import { useEffect, useRef, useState } from 'react'
import { useGallery } from '../context/GalleryContext'
import { IoIosCloseCircle } from 'react-icons/io'
import { IoTrash } from 'react-icons/io5'
import { prettyVisitWhen } from '../lib/visits'
import { BOOKING_STATUS, decideBooking, deleteThread, loadThread, peekThread, replyOnThread, subscribeMessages } from '../lib/messages'
import { formatStudioTime, studioToday } from '../lib/clock'
import { holdImage } from '../lib/mediaCache'
import ParlorAvatar from './ParlorAvatar'

const kindLabel = (kind) => {
  if (kind === 'book') return 'Booking'
  if (kind === 'reel') return 'Reel'
  if (kind === 'chat') return 'Chat'
  return 'Look'
}

const bubbleTime = (value) => formatStudioTime(value)

const statusClass = (status) => {
  if (status === 'accepted') return 'text-emerald-300'
  if (status === 'rejected') return 'text-rose-200'
  if (status === 'rescheduled') return 'text-amber-200'
  return 'text-brand-200'
}

const ParlorChat = ({ open, root, image, visitorId, profile, admin, onClose, onOpenLook, onBookingChange, onMutate }) => {
  const [messages, setMessages] = useState([])
  const [booking, setBooking] = useState(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [changing, setChanging] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const scroller = useRef(null)
  const onCloseRef = useRef(onClose)
  const rootRef = useRef(root)
  const { open: galleryOpen } = useGallery()
  const galleryOpenRef = useRef(galleryOpen)
  const threadId = root?.id || ''
  onCloseRef.current = onClose
  rootRef.current = root
  galleryOpenRef.current = galleryOpen

  useEffect(() => {
    holdImage(image)
  }, [image])

  useEffect(() => {
    if (root) setBooking(root)
  }, [root])

  useEffect(() => {
    if (!open || !threadId) return undefined
    const current = rootRef.current
    const cached = peekThread(threadId)
    setNote('')
    setBusy(false)
    setError('')
    setChanging(false)
    setConfirmDelete(false)
    setBooking(current)
    setDate(current?.visit_on || '')
    setTime(current?.visit_time || '')
    setMessages(cached?.length ? cached : current ? [current] : [])

    let alive = true
    loadThread(current, { fresh: true })
      .then((rows) => {
        if (alive) setMessages(rows.length ? rows : current ? [current] : [])
      })
      .catch(() => {
        if (alive && !cached) setMessages(current ? [current] : [])
      })

    const onKey = (event) => {
      if (galleryOpenRef.current) return
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onCloseRef.current?.()
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      alive = false
      window.removeEventListener('keydown', onKey, true)
    }
  }, [open, threadId])

  useEffect(() => {
    if (!open || !threadId) return undefined
    let alive = true
    const pull = () => {
      loadThread(rootRef.current, { fresh: true })
        .then((rows) => {
          if (!alive) return
          setMessages((current) => {
            if (!rows.length) return current
            if (current.length === rows.length && current.every((item, index) => item.id === rows[index].id && item.body === rows[index].body && item.status === rows[index].status)) {
              return current
            }
            return rows
          })
        })
        .catch(() => {})
    }
    const stop = subscribeMessages(pull)
    const tick = window.setInterval(pull, 2000)
    return () => {
      alive = false
      stop()
      window.clearInterval(tick)
    }
  }, [open, threadId])

  useEffect(() => {
    const node = scroller.current
    if (!node || !open) return
    node.scrollTop = node.scrollHeight
  }, [messages, open])

  if (!open || !root) return null

  const refresh = async (nextBooking) => {
    if (nextBooking) {
      setBooking(nextBooking)
      onBookingChange?.(nextBooking)
    }
    setMessages(await loadThread(nextBooking || root, { fresh: true }))
    onMutate?.()
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.target)
    const body = String(data.get('note') || note || '').trim()
    if (!body) {
      setError('Write a reply')
      return
    }

    setBusy(true)
    setError('')
    try {
      const row = await replyOnThread({
        parentId: root.id,
        visitorId,
        name: profile?.name,
        avatar: profile?.avatar,
        body,
        refId: root.ref_id,
      })
      setNote('')
      setMessages((current) => (current.some((item) => item.id === row.id) ? current : [...current, row]))
      await refresh(booking)
    } catch (err) {
      setError(err.message || 'Could not send reply.')
    } finally {
      setBusy(false)
    }
  }

  const onDecide = async (status) => {
    if (busy) return
    if (status === 'rescheduled' && !date) {
      setError('Pick a date.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const next = await decideBooking({
        root: booking || root,
        visitorId,
        name: profile?.name,
        avatar: profile?.avatar,
        status,
        date: status === 'rescheduled' ? date : undefined,
        time: status === 'rescheduled' ? time : undefined,
        note,
      })
      setNote('')
      setChanging(false)
      await refresh(next)
    } catch (err) {
      setError(err.message || 'Could not update booking.')
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async () => {
    if (busy) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setBusy(true)
    setError('')
    try {
      await deleteThread(root, visitorId)
      onMutate?.()
      onClose?.()
    } catch (err) {
      setError(err.message || 'Could not delete chat.')
      setBusy(false)
    }
  }

  const today = studioToday()
  const card = booking || root
  const isBook = card.kind === 'book'
  const status = card.status || 'pending'

  return (
    <div
      className={`fixed inset-0 z-[75] flex items-center justify-center bg-black/60 p-4 pb-[calc(5.8rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:pb-4 ${
        galleryOpen ? 'pointer-events-none invisible' : ''
      }`}
      onClick={onClose}
      role="dialog"
      aria-hidden={galleryOpen || undefined}
      aria-labelledby="parlor-chat-title"
    >
      <div
        className="flex h-[min(72dvh,32rem)] w-full max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-white/25 bg-[#1b1714] shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2.5">
          <ParlorAvatar id={root.from_avatar} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.14em] text-brand-200">
              {root.kind === 'chat' || root.ref_id === '__chat__' ? 'Chat' : kindLabel(root.kind)}
            </p>
            <h2 id="parlor-chat-title" className="truncate font-display text-lg leading-tight text-ivory">
              {admin ? root.from_name : 'Geeta'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className={`rounded-full p-1.5 transition disabled:opacity-50 ${
              confirmDelete ? 'bg-rose-800/80 text-white' : 'text-ivory/55 hover:text-rose-200'
            }`}
            aria-label={confirmDelete ? 'Confirm delete chat' : 'Delete chat'}
          >
            <IoTrash className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-full p-0.5 text-ivory/70 transition hover:text-ivory"
            aria-label="Close chat"
          >
            <IoIosCloseCircle className="h-7 w-7" />
          </button>
        </header>
        {confirmDelete ? (
          <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
            <p className="min-w-0 flex-1 text-[12px] text-ivory/70">Remove this chat from your inbox? They keep it.</p>
            <button
              type="button"
              className="rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ivory/60"
              disabled={busy}
              onClick={() => setConfirmDelete(false)}
            >
              Keep
            </button>
            <button
              type="button"
              className="rounded-full bg-rose-800/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-50"
              disabled={busy}
              onClick={onDelete}
            >
              {busy ? '…' : 'Delete'}
            </button>
          </div>
        ) : null}

        <div ref={scroller} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
          {image ? (
            <button
              type="button"
              className="mb-2 block w-full overflow-hidden rounded-xl border border-white/10"
              onClick={(event) => onOpenLook?.(event.currentTarget)}
            >
              <img src={image} alt="" className="h-36 w-full object-cover object-[center_20%]" decoding="async" />
            </button>
          ) : null}

          {isBook ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClass(status)}`}>
                {BOOKING_STATUS[status] || BOOKING_STATUS.pending}
              </p>
              <p className="mt-0.5 text-sm text-ivory">{prettyVisitWhen(card.visit_on, card.visit_time) || 'Date to confirm'}</p>
              <p className="text-[12px] text-ivory/60">{card.service}</p>
            </div>
          ) : null}

          {messages.map((row) => {
            const mine = row.from_visitor_id === visitorId
            const text =
              row.body ||
              (row.kind === 'book' ? 'Wants this date' : row.kind === 'chat' || row.ref_id === '__chat__' ? '' : 'Wants this look')
            if (!text) return null
            return (
              <div key={row.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                    mine ? 'rounded-br-md bg-brand-500 text-white' : 'rounded-bl-md bg-white/10 text-ivory'
                  }`}
                >
                  {!mine ? (
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-200">{row.from_name}</p>
                  ) : null}
                  <p className="text-[13px] leading-snug">{text}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-white/70' : 'text-ivory/40'}`}>{bubbleTime(row.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {admin && isBook ? (
          <div className="shrink-0 space-y-2 border-t border-white/10 px-3 py-2">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                className="rounded-full bg-emerald-700/80 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-50"
                disabled={busy}
                onClick={() => onDecide('accepted')}
              >
                Accept
              </button>
              <button
                type="button"
                className="rounded-full bg-rose-800/80 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-50"
                disabled={busy}
                onClick={() => onDecide('rejected')}
              >
                Decline
              </button>
              <button
                type="button"
                className="rounded-full border border-white/15 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ivory disabled:opacity-50"
                disabled={busy}
                onClick={() => setChanging((on) => !on)}
              >
                Change
              </button>
            </div>
            {changing ? (
              <div className="grid grid-cols-[1fr_5.5rem_auto] items-center gap-1.5">
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="booking-input parlor-input !min-h-9 !py-1.5 !text-[12px]"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="booking-input parlor-input !min-h-9 !py-1.5 !text-[12px]"
                />
                <button
                  type="button"
                  className="btn-primary !min-h-9 !px-2.5 !text-[10px]"
                  disabled={busy}
                  onClick={() => onDecide('rescheduled')}
                >
                  Save
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <form
          className="flex shrink-0 gap-2 border-t border-white/10 px-3 py-2.5"
          onSubmit={onSubmit}
        >
          <input
            name="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={280}
            placeholder={admin && isBook ? 'Note with your decision…' : root.kind === 'chat' || root.ref_id === '__chat__' ? 'Message…' : 'Reply…'}
            autoComplete="off"
            className="booking-input parlor-input min-h-10 flex-1 !py-2"
          />
          <button type="submit" className="btn-primary !min-h-10 !px-3 !text-[11px]" disabled={busy}>
            {busy ? '…' : 'Send'}
          </button>
        </form>
        {error ? <p className="px-3 pb-2 text-[11px] text-rose-200">{error}</p> : null}
      </div>
    </div>
  )
}

export default ParlorChat
