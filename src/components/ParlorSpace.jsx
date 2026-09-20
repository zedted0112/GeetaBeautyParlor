import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { contact } from '../data/content'
import { PARLOR_ROLES, isAdminProfile } from '../lib/profile'
import { REACTION_EMOJI, loadVisitorVotes } from '../lib/reactions'
import { loadVisits, prettyVisitDate, prettyVisitWhen, sendVisitToGeeta } from '../lib/visits'
import { BOOKING_STATUS, isBookThread, isLiveChatThread, isLookThread, loadGeetaInbox, loadMyThreads, sendChatToGeeta, subscribeMessages } from '../lib/messages'
import { holdImages } from '../lib/mediaCache'
import { useParlor } from '../context/ParlorContext'
import { useBooking } from '../context/BookingContext'
import { useGallery } from '../context/GalleryContext'
import { bridalPhotos } from './Home/BridalGallery'
import ParlorAvatar from './ParlorAvatar'
import ParlorBell from './ParlorBell'
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

const kindLabel = (kind, row) => {
  if (kind === 'book') return 'Booking'
  if (kind === 'reel') return 'Reel'
  if (kind === 'chat' || row?.ref_id === '__chat__') return 'Chat'
  return 'Look'
}

const CLIENT_PANES = [
  { id: 'chats', label: 'Chats' },
  { id: 'booking', label: 'Booking' },
  { id: 'looks', label: 'Looks' },
]

const ADMIN_PANES = [
  { id: 'chats', label: 'Chats' },
  { id: 'reactions', label: 'Reactions' },
  { id: 'booking', label: 'Booking' },
]

const TabBar = ({ panes, counts, pane, onPane }) => (
  <div className="mb-4 flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
    {panes.map((item) => {
      const count = counts[item.id] || 0
      const on = pane === item.id
      return (
        <button
          key={item.id}
          type="button"
          className={`flex-1 rounded-full px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide ${
            on ? 'bg-brand-500 text-white' : 'text-ivory/55'
          }`}
          onClick={() => onPane(item.id)}
        >
          {item.label}
          <span className={`ml-1 tabular-nums ${on ? 'text-white/70' : 'text-ivory/35'}`}>{count}</span>
        </button>
      )
    })}
  </div>
)

const ThreadList = ({ rows, onOpen, onGallery, peer }) => (
  <ul className="space-y-2">
    {rows.map((row) => {
      const thumb = thumbFor(row)
      const preview = String(row.lastReply?.body || row.body || '').trim()
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
            <button type="button" onClick={() => onOpen(row)} aria-label={`Open chat with ${peer || row.from_name}`}>
              <ParlorAvatar id={row.from_avatar} size="md" />
            </button>
          )}
          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onOpen(row)}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-brand-200">
              {kindLabel(row.kind, row)}
              {row.kind === 'book' ? ` · ${BOOKING_STATUS[row.status || 'pending']}` : ''}
            </p>
            <p className="text-sm font-medium text-ivory">{peer || row.from_name}</p>
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
              <p className="mt-0.5 text-[12px] text-ivory/60">{peer ? `Sent this ${row.kind}` : `Wants this ${row.kind}`}</p>
            ) : null}
          </button>
        </li>
      )
    })}
  </ul>
)

const EmptyNote = ({ children }) => (
  <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">{children}</p>
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
  const [chatNote, setChatNote] = useState('')
  const [chatBusy, setChatBusy] = useState(false)
  const [chatError, setChatError] = useState('')
  const [pane, setPane] = useState('chats')
  const admin = isAdminProfile(profile, visitorId)
  const role = PARLOR_ROLES.find((item) => item.id === profile?.role)

  useEffect(() => {
    setPane('chats')
  }, [admin])

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
  const openBellLook = useCallback(
    (el, gallery, photoId) => {
      openGallery(el, gallery, photoId)
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

  useEffect(() => {
    const stop = subscribeMessages(() => refreshInbox())
    return stop
  }, [refreshInbox])

  const bookRows = useMemo(() => inbox.filter(isBookThread), [inbox])
  const lookRows = useMemo(() => inbox.filter(isLookThread), [inbox])
  const chatRows = useMemo(() => inbox.filter(isLiveChatThread), [inbox])
  const likedMedia = useMemo(
    () =>
      votes.flatMap((row) => {
        const look = looksById[row.photo_id]
        if (look) return [{ ...look, reaction: row.kind, gallery: 'bridal', media: look.src }]
        const reel = reelsById[row.photo_id]
        if (reel) return [{ ...reel, reaction: row.kind, gallery: 'bts', media: reel.poster }]
        return []
      }),
    [votes]
  )

  const sendBook = async (item) => {
    if (sent[item.id]) return
    try {
      await sendVisitToGeeta(item, profile, visitorId)
      setSent((current) => ({ ...current, [item.id]: true }))
      refreshInbox()
    } catch {
      setSent((current) => ({ ...current, [item.id]: 'err' }))
    }
  }

  const sendFirstChat = async (event) => {
    event.preventDefault()
    if (chatBusy) return
    const note = String(chatNote || '').trim()
    if (!note) {
      setChatError('Write a message')
      return
    }
    setChatBusy(true)
    setChatError('')
    try {
      const row = await sendChatToGeeta({
        visitorId,
        name: profile?.name,
        avatar: profile?.avatar,
        body: note,
      })
      setChatNote('')
      setInbox((current) => {
        const next = current.filter((item) => item.id !== row.id)
        return [{ ...row, lastReply: row.lastReply || null }, ...next]
      })
      setChat(row)
      refreshInbox()
    } catch (err) {
      setChatError(err.message || 'Could not send.')
    } finally {
      setChatBusy(false)
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
        <div className="flex shrink-0 items-center gap-2">
          <ParlorBell
            admin={admin}
            visitorId={visitorId}
            inbox={inbox}
            onOpenThread={setChat}
            onOpenLook={openBellLook}
          />
          <button
            type="button"
            className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ivory/80"
            onClick={openProfile}
          >
            Edit
          </button>
        </div>
      </header>

      {admin ? (
        <>
          <TabBar
            panes={ADMIN_PANES}
            counts={{ chats: chatRows.length, reactions: lookRows.length, booking: bookRows.length }}
            pane={pane}
            onPane={setPane}
          />
          {pane === 'chats' ? (
            <section>
              {chatRows.length ? (
                <ThreadList rows={chatRows} onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>When a client messages you, it lands here.</EmptyNote>
              )}
            </section>
          ) : null}
          {pane === 'reactions' ? (
            <section>
              {lookRows.length ? (
                <ThreadList rows={lookRows} onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>When a client sends a look or reel, it lands here.</EmptyNote>
              )}
            </section>
          ) : null}
          {pane === 'booking' ? (
            <section>
              {bookRows.length ? (
                <ThreadList rows={bookRows} onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>When a client books, it lands here.</EmptyNote>
              )}
            </section>
          ) : null}
        </>
      ) : (
        <>
          <TabBar
            panes={CLIENT_PANES}
            counts={{ chats: chatRows.length, booking: bookRows.length, looks: lookRows.length }}
            pane={pane}
            onPane={setPane}
          />

          {pane === 'chats' ? (
            <section>
              {chatRows.length ? (
                <ThreadList rows={chatRows} peer="Geeta" onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <form className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3" onSubmit={sendFirstChat}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">Message Geeta</p>
                  <div className="flex gap-2">
                    <input
                      value={chatNote}
                      onChange={(event) => setChatNote(event.target.value)}
                      maxLength={280}
                      placeholder="Write a message…"
                      autoComplete="off"
                      className="booking-input parlor-input min-h-10 flex-1 !py-2"
                    />
                    <button type="submit" className="btn-primary !min-h-10 !px-3 !text-[11px]" disabled={chatBusy}>
                      {chatBusy ? '…' : 'Send'}
                    </button>
                  </div>
                  {chatError ? <p className="text-[11px] text-rose-200">{chatError}</p> : null}
                </form>
              )}
            </section>
          ) : null}

          {pane === 'booking' ? (
            <section>
              {bookRows.length ? (
                <ThreadList rows={bookRows} peer="Geeta" onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>Book a date and Geeta will reply here.</EmptyNote>
              )}
              <div className="mb-2 mt-6 flex items-baseline justify-between">
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
                <EmptyNote>Save a date — send it to Geeta from here when you are ready.</EmptyNote>
              )}
            </section>
          ) : null}

          {pane === 'looks' ? (
            <section>
              {lookRows.length ? (
                <ThreadList rows={lookRows} peer="Geeta" onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>Send a bridal look or a reel — both land here.</EmptyNote>
              )}
              {likedMedia.length ? (
                <>
                  <h2 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                    Liked
                  </h2>
                  <div className="parlor-looks">
                    {likedMedia.map((item) => (
                      <button
                        key={`${item.gallery}-${item.id}`}
                        type="button"
                        className={`parlor-look ${item.gallery === 'bts' ? 'is-reel' : ''}`}
                        aria-label={item.gallery === 'bts' ? 'Open liked reel' : 'Open liked look'}
                        onClick={(event) => openGallery(event.currentTarget, item.gallery === 'bts' ? 'bts' : 'bridal', item.id)}
                      >
                        <img src={item.media} alt="" />
                        <span>{REACTION_EMOJI[item.reaction] || ''}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ) : null}
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
