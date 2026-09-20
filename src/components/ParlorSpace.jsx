import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { contact } from '../data/content'
import { PARLOR_ROLES, isAdminProfile } from '../lib/profile'
import { REACTION_EMOJI, loadVisitorVotes } from '../lib/reactions'
import { loadVisits, prettyVisitDate, prettyVisitWhen, sendVisitToGeeta } from '../lib/visits'
import { BOOKING_STATUS, loadGeetaInbox, loadMyThreads } from '../lib/messages'
import { holdImages } from '../lib/mediaCache'
import { useParlor } from '../context/ParlorContext'
import { useBooking } from '../context/BookingContext'
import { useGallery } from '../context/GalleryContext'
import { bridalPhotos } from './Home/BridalGallery'
import ParlorAvatar from './ParlorAvatar'
import ParlorChat from './ParlorChat'

const looksById = Object.fromEntries(bridalPhotos.map((item) => [item.id, item]))
const reelsById = Object.fromEntries(contact.instagramReels.map((item) => [item.id, item]))

const thumbFor = (row) => {
  if (row.kind === 'look') return looksById[row.ref_id]?.src
  if (row.kind === 'reel') return reelsById[row.ref_id]?.poster
  return ''
}

const holdImageThumb = (row) => {
  const src = thumbFor(row)
  if (src) holdImages([src])
}

const kindLabel = (kind) => {
  if (kind === 'book') return 'Booking'
  if (kind === 'reel') return 'Reel'
  return 'Look'
}

const ThreadList = ({ rows, onOpen, onGallery }) => (
  <ul className="space-y-2">
    {rows.map((row) => {
      const thumb = thumbFor(row)
      const preview = row.lastReply?.body || row.body
      return (
        <li key={row.id} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
          {thumb ? (
            <button
              type="button"
              className="h-16 w-12 shrink-0 overflow-hidden rounded-lg"
              onClick={(event) => onGallery(event.currentTarget, row)}
            >
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            </button>
          ) : (
            <button type="button" onClick={() => onOpen(row)} aria-label={`Open chat with ${row.from_name}`}>
              <ParlorAvatar id={row.from_avatar} size="md" />
            </button>
          )}
          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onOpen(row)}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-brand-200">
              {kindLabel(row.kind)}
              {row.kind === 'book' ? ` · ${BOOKING_STATUS[row.status || 'pending']}` : ''}
            </p>
            <p className="text-sm font-medium text-ivory">{row.from_name}</p>
            {row.kind === 'book' ? (
              <p className="text-[12px] text-ivory/60">
                {prettyVisitWhen(row.visit_on, row.visit_time)} · {row.service}
              </p>
            ) : null}
            {preview ? (
              <p className="mt-0.5 line-clamp-2 text-[12px] text-ivory/70">
                {row.lastReply ? `${row.lastReply.from_name}: ${preview}` : preview}
              </p>
            ) : row.kind !== 'book' ? (
              <p className="mt-0.5 text-[12px] text-ivory/60">Wants this {row.kind}</p>
            ) : null}
          </button>
        </li>
      )
    })}
  </ul>
)

const ParlorSpace = () => {
  const navigate = useNavigate()
  const { profile, visitorId, openProfile } = useParlor()
  const { openPlan } = useBooking()
  const { openGallery } = useGallery()
  const [votes, setVotes] = useState([])
  const [visits, setVisits] = useState([])
  const [inbox, setInbox] = useState([])
  const [sent, setSent] = useState({})
  const [chat, setChat] = useState(null)
  const admin = isAdminProfile(profile, visitorId)
  const role = PARLOR_ROLES.find((item) => item.id === profile?.role)

  const closeChat = useCallback(() => setChat(null), [])
  const refreshInbox = useCallback(() => {
    if (admin) {
      loadGeetaInbox({ fresh: true })
        .then(setInbox)
        .catch(() => {})
      return
    }
    if (!visitorId) return
    loadMyThreads(visitorId, { fresh: true })
      .then(setInbox)
      .catch(() => {})
  }, [admin, visitorId])

  const onBookingChange = useCallback((next) => {
    setChat((current) => (current ? { ...current, ...next } : current))
    setInbox((rows) => rows.map((row) => (row.id === next?.id ? { ...row, ...next } : row)))
    refreshInbox()
  }, [refreshInbox])
  const onOpenLook = useCallback(
    (el) => {
      if (!chat?.ref_id) return
      openGallery(el, chat.kind === 'reel' ? 'bts' : 'bridal', chat.ref_id)
    },
    [chat, openGallery]
  )
  const openThreadGallery = useCallback(
    (el, row) => {
      holdImageThumb(row)
      openGallery(el, row.kind === 'reel' ? 'bts' : 'bridal', row.ref_id)
    },
    [openGallery]
  )

  useEffect(() => {
    if (!visitorId || admin) return undefined
    let alive = true
    loadVisitorVotes(visitorId)
      .then((rows) => {
        if (alive) setVotes(rows)
      })
      .catch(() => {
        if (alive) setVotes([])
      })
    return () => {
      alive = false
    }
  }, [visitorId, admin])

  useEffect(() => {
    if (!visitorId || admin) return undefined
    let alive = true
    loadVisits(visitorId)
      .then((rows) => {
        if (alive) setVisits(rows)
      })
      .catch(() => {
        if (alive) setVisits([])
      })
    return () => {
      alive = false
    }
  }, [visitorId, admin])

  useEffect(() => {
    if (!admin) return undefined
    let alive = true
    loadGeetaInbox()
      .then((rows) => {
        if (!alive) return
        setInbox(rows)
        holdImages(rows.map(thumbFor).filter(Boolean))
      })
      .catch(() => {
        if (alive) setInbox([])
      })
    return () => {
      alive = false
    }
  }, [admin])

  useEffect(() => {
    if (!visitorId || admin) return undefined
    let alive = true
    loadMyThreads(visitorId)
      .then((rows) => {
        if (!alive) return
        setInbox(rows)
        holdImages(rows.map(thumbFor).filter(Boolean))
      })
      .catch(() => {
        if (alive) setInbox([])
      })
    return () => {
      alive = false
    }
  }, [visitorId, admin])

  const looks = useMemo(
    () => votes.filter((row) => looksById[row.photo_id]).map((row) => ({ ...looksById[row.photo_id], kind: row.kind })),
    [votes]
  )
  const reels = useMemo(
    () => votes.filter((row) => reelsById[row.photo_id]).map((row) => ({ ...reelsById[row.photo_id], kind: row.kind })),
    [votes]
  )

  const sendBook = async (item) => {
    if (sent[item.id]) return
    try {
      await sendVisitToGeeta(item, profile, visitorId)
      setSent((current) => ({ ...current, [item.id]: true }))
    } catch {
      setSent((current) => ({ ...current, [item.id]: 'err' }))
    }
  }

  if (!profile) return <Navigate to="/" replace />

  return (
    <>
    <main className="mx-auto min-h-[100svh] w-[min(94%,40rem)] px-1 pb-[calc(6.2rem+env(safe-area-inset-bottom))] pt-[calc(5.6rem+env(safe-area-inset-top))]">
      <header className="mb-6 flex items-center gap-3">
        <ParlorAvatar id={profile.avatar} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.16em] text-brand-200">{admin ? 'Studio desk' : 'Your parlor'}</p>
          <h1 className="font-display text-2xl leading-tight text-ivory">{profile.name}</h1>
          <p className="text-[12px] text-ivory/55">{admin ? 'Admin' : role?.label || profile.role}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ivory/80"
          onClick={openProfile}
        >
          Edit
        </button>
      </header>

      {admin ? (
        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">Inbox</h2>
            <span className="text-[11px] tabular-nums text-ivory/35">{inbox.length}</span>
          </div>
          {inbox.length ? (
            <ThreadList
              rows={inbox}
              onOpen={setChat}
              onGallery={openThreadGallery}
            />
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">
              When a client books or sends a look, it lands here.
            </p>
          )}
        </section>
      ) : (
        <>
          <section className="mb-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">Looks you liked</h2>
              <span className="text-[11px] tabular-nums text-ivory/35">{looks.length}</span>
            </div>
            {looks.length ? (
              <div className="parlor-looks">
                {looks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="parlor-look"
                    aria-label="Open liked look"
                    onClick={(event) => openGallery(event.currentTarget, 'bridal', item.id)}
                  >
                    <img src={item.src} alt="" />
                    <span>{REACTION_EMOJI[item.kind] || ''}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">
                React on a bridal look — it will land here.
              </p>
            )}
          </section>

          <section className="mb-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">Reels you liked</h2>
              <span className="text-[11px] tabular-nums text-ivory/35">{reels.length}</span>
            </div>
            {reels.length ? (
              <div className="parlor-looks parlor-reels">
                {reels.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="parlor-look"
                    aria-label="Open liked reel"
                    onClick={(event) => openGallery(event.currentTarget, 'bts', item.id)}
                  >
                    <img src={item.poster} alt="" />
                    <span>{REACTION_EMOJI[item.kind] || ''}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">
                Heart a reel and it stays in your parlor.
              </p>
            )}
          </section>

          <section className="mb-6">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">With Geeta</h2>
              <span className="text-[11px] tabular-nums text-ivory/35">{inbox.length}</span>
            </div>
            {inbox.length ? (
              <ThreadList
                rows={inbox}
                onOpen={setChat}
                onGallery={openThreadGallery}
              />
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">
                Send a look — tap the message to chat with Geeta.
              </p>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">Planned visits</h2>
              <button
                type="button"
                className="text-[11px] font-semibold uppercase tracking-wide text-brand-200"
                onClick={() => openPlan('an appointment')}
              >
                Plan one
              </button>
            </div>
            {visits.length ? (
              <ul className="space-y-2">
                {visits.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ivory">{prettyVisitDate(item.date)}</p>
                      <p className="text-[12px] text-ivory/60">{item.service}</p>
                      {item.message ? <p className="mt-0.5 text-[12px] text-ivory/45">{item.message}</p> : null}
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-full bg-brand-500 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                      onClick={() => sendBook(item)}
                    >
                      {sent[item.id] === true ? 'Sent' : sent[item.id] === 'err' ? 'Retry' : 'Book'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">
                Save a date — send it to Geeta from here when you are ready.
              </p>
            )}
          </section>
        </>
      )}

      <button
        type="button"
        className="mt-8 w-full text-center text-[12px] text-ivory/40"
        onClick={() => navigate('/')}
      >
        Back to the studio
      </button>
    </main>
    <ParlorChat
      open={Boolean(chat)}
      root={chat}
      image={chat ? thumbFor(chat) : ''}
      visitorId={visitorId}
      profile={profile}
      admin={admin}
      onClose={closeChat}
      onBookingChange={onBookingChange}
      onOpenLook={onOpenLook}
      onMutate={refreshInbox}
    />
    </>
  )
}

export default ParlorSpace
