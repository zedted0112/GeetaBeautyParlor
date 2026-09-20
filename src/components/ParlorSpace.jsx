import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { IoArrowForward, IoCalendar, IoChatbubble, IoChevronBack, IoHeart, IoImage } from 'react-icons/io5'
import { contact } from '../data/content'
import { nowMs } from '../lib/clock'
import { GEETA_ADMIN_ID, PARLOR_ROLES, isAdminProfile, loadParlorClients } from '../lib/profile'
import { REACTION_EMOJI, loadReactionVisitors, loadVisitorVotes } from '../lib/reactions'
import { loadVisits, prettyVisitDate, prettyVisitWhen, sendVisitToGeeta } from '../lib/visits'
import { BOOKING_STATUS, dedupeLookThreads, ensureClientChat, isBookThread, isChatThread, isLiveChatThread, isLookThread, loadGeetaInbox, loadMyThreads, sendChatToGeeta, subscribeMessages } from '../lib/messages'
import { holdImages } from '../lib/mediaCache'
import { useParlor } from '../context/ParlorContext'
import { useBooking } from '../context/BookingContext'
import { useGallery } from '../context/GalleryContext'
import { bridalPhotos } from './Home/BridalGallery'
import { glamPhotos } from './Home/GlamGallery'
import { lookGalleryFor } from '../lib/looks'
import ParlorAvatar from './ParlorAvatar'
import ParlorBell from './ParlorBell'
import ParlorChat from './ParlorChat'

const looksById = Object.fromEntries([...bridalPhotos, ...glamPhotos].map((item) => [item.id, item]))
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
  { id: 'clients', label: 'Clients' },
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
          className={`flex-1 rounded-full px-1.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide sm:px-2 sm:text-[11px] ${
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

const ThreadList = ({ rows, onOpen, onGallery, peer, variant }) => (
  <ul className="space-y-2">
    {rows.map((row) => {
      const thumb = thumbFor(row)
      const looks = variant === 'looks'
      const title = looks && peer ? '' : peer || row.from_name
      const last = row.lastReply
      const preview = String(last?.body || row.body || '').trim()
      const lastName = last?.from_name || ''
      const previewLine = !preview
        ? ''
        : looks && peer
          ? lastName === peer
            ? `${lastName}: ${preview}`
            : preview
          : last && lastName && lastName !== title
            ? `${lastName}: ${preview}`
            : preview
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
            {looks ? null : (
              <p className="text-[10px] uppercase tracking-[0.14em] text-brand-200">
                {kindLabel(row.kind, row)}
                {row.kind === 'book' ? ` · ${BOOKING_STATUS[row.status || 'pending']}` : ''}
              </p>
            )}
            {title ? <p className="text-sm font-medium text-ivory">{title}</p> : null}
            {row.kind === 'book' ? (
              <p className="text-[12px] text-ivory/60">
                {prettyVisitWhen(row.visit_on, row.visit_time)} · {row.service}
              </p>
            ) : null}
            {previewLine ? (
              <p className={`line-clamp-2 text-[12px] text-ivory/70 ${title ? 'mt-0.5' : 'text-[13px] text-ivory/80'}`}>
                {previewLine}
              </p>
            ) : row.kind !== 'book' ? (
              <p className="mt-0.5 text-[12px] text-ivory/60">
                {looks ? (row.kind === 'reel' ? 'Sent this reel' : 'Sent this look') : peer ? `Sent this ${row.kind}` : `Wants this ${row.kind}`}
              </p>
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

const ONLINE_MS = 2 * 60 * 1000

const stampAt = (value) => {
  const time = value ? new Date(value).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

const lastSeenLabel = (time) => {
  if (!time) return { online: false, text: '' }
  const delta = nowMs() - time
  if (delta < ONLINE_MS) return { online: true, text: 'Online' }
  const mins = Math.max(1, Math.round(delta / 60000))
  if (mins < 60) return { online: false, text: `Last seen ${mins}m ago` }
  const hours = Math.round(mins / 60)
  if (hours < 24) return { online: false, text: `Last seen ${hours}h ago` }
  return { online: false, text: `Last seen ${Math.round(hours / 24)}d ago` }
}

const THREAD_SEEN_KEY = 'gbp-admin-thread-seen'
const reactSeenKey = (id) => `gbp-admin-react-seen:${id}`
const bellSeenKey = (id) => `gbp-parlor-notifs-seen:${id}`

const readThreadSeen = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(THREAD_SEEN_KEY) || '{}')
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

const writeThreadSeen = (next) => {
  window.localStorage.setItem(THREAD_SEEN_KEY, JSON.stringify(next))
}

const readStamp = (key) => {
  const value = Number(window.localStorage.getItem(key) || 0)
  return Number.isFinite(value) ? value : 0
}

const lastFromClient = (row) => {
  const last = row?.lastReply || row
  return Boolean(last?.from_visitor_id && last.from_visitor_id !== GEETA_ADMIN_ID)
}

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
  const [clients, setClients] = useState([])
  const [reactedAt, setReactedAt] = useState({})
  const [seenTick, setSeenTick] = useState(0)
  const [threadSeen, setThreadSeen] = useState(() => readThreadSeen())
  const [openClient, setOpenClient] = useState(null)
  const admin = isAdminProfile(profile, visitorId)
  const role = PARLOR_ROLES.find((item) => item.id === profile?.role)

  useEffect(() => {
    setPane('chats')
    setOpenClient(null)
  }, [admin])

  const closeChat = useCallback(() => setChat(null), [])
  const openThread = useCallback((row) => {
    if (row?.id) {
      const next = { ...readThreadSeen(), [row.id]: Date.now() }
      writeThreadSeen(next)
      setThreadSeen(next)
    }
    setChat(row)
  }, [])
  const openClientCard = useCallback((client) => {
    const next = { ...readThreadSeen() }
    inbox
      .filter((row) => row.from_visitor_id === client.visitor_id && row.kind !== 'book')
      .forEach((row) => {
        next[row.id] = Date.now()
      })
    writeThreadSeen(next)
    setThreadSeen(next)
    window.localStorage.setItem(reactSeenKey(client.visitor_id), String(Date.now()))
    setOpenClient(client)
  }, [inbox])
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

  const messageClient = useCallback(async (client) => {
    if (!client?.visitor_id || chatBusy) return
    const existing = inbox.find((row) => row.from_visitor_id === client.visitor_id && isChatThread(row))
    if (existing) {
      openThread(existing)
      return
    }
    setChatBusy(true)
    setChatError('')
    try {
      const row = await ensureClientChat({
        clientId: client.visitor_id,
        clientName: client.name,
        clientAvatar: client.avatar,
      })
      refreshInbox()
      openThread(row)
    } catch (err) {
      setChatError(err.message || 'Could not open chat.')
    } finally {
      setChatBusy(false)
    }
  }, [chatBusy, inbox, openThread, refreshInbox])

  const onBookingChange = useCallback((next) => {
    setChat((current) => (current ? { ...current, ...next } : current))
    setInbox((rows) => rows.map((row) => (row.id === next?.id ? { ...row, ...next } : row)))
    refreshInbox()
  }, [refreshInbox])
  const onOpenLook = useCallback(
    (el) => {
      if (!chat?.ref_id) return
      openGallery(el, chat.kind === 'reel' ? 'bts' : lookGalleryFor(chat.ref_id), chat.ref_id)
    },
    [chat, openGallery]
  )
  const openThreadGallery = useCallback(
    (el, row) => {
      holdImageThumb(row)
      openGallery(el, row.kind === 'reel' ? 'bts' : lookGalleryFor(row.ref_id), row.ref_id)
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

  useEffect(() => {
    if (!admin) return undefined
    let alive = true
    const refresh = () => {
      loadParlorClients()
        .then((rows) => {
          if (alive) setClients(rows)
        })
        .catch(() => {
          if (alive) setClients([])
        })
      loadReactionVisitors()
        .then((rows) => {
          if (alive) setReactedAt(rows)
        })
        .catch(() => {
          if (alive) setReactedAt({})
        })
    }
    refresh()
    const timer = window.setInterval(() => {
      refresh()
      setSeenTick((n) => n + 1)
    }, 30000)
    return () => {
      alive = false
      window.clearInterval(timer)
    }
  }, [admin, pane])

  const bookRows = useMemo(() => inbox.filter(isBookThread), [inbox])
  const lookRows = useMemo(() => dedupeLookThreads(inbox.filter(isLookThread)), [inbox])
  const chatRows = useMemo(() => inbox.filter(isLiveChatThread), [inbox])
  const signalsByVisitor = useMemo(() => {
    const map = {}
    const ensure = (id) => {
      if (!id) return null
      if (!map[id]) {
        map[id] = {
          chats: [],
          looks: [],
          books: [],
          chatAlert: null,
          lookAlert: null,
          bookAlert: null,
          reactAlert: false,
          last: 0,
        }
      }
      return map[id]
    }
    inbox.forEach((row) => {
      const item = ensure(row.from_visitor_id)
      if (!item) return
      const last = Math.max(stampAt(row.created_at), stampAt(row.lastReply?.created_at))
      item.last = Math.max(item.last, last)
      const unread = lastFromClient(row) && last > (threadSeen[row.id] || 0)
      if (isLiveChatThread(row)) {
        item.chats.push(row)
        if (unread && !item.chatAlert) item.chatAlert = row
      }
      if (isLookThread(row)) {
        item.looks.push(row)
        if (unread && !item.lookAlert) item.lookAlert = row
      }
      if (isBookThread(row)) {
        item.books.push(row)
        if ((row.status || 'pending') === 'pending' && !item.bookAlert) item.bookAlert = row
      }
    })
    Object.entries(reactedAt).forEach(([id, time]) => {
      const item = ensure(id)
      if (!item) return
      item.last = Math.max(item.last, time || 0)
      const seenReact = Math.max(readStamp(bellSeenKey(GEETA_ADMIN_ID)), readStamp(reactSeenKey(id)))
      item.reactAlert = Boolean(time && time > seenReact)
    })
    return map
  }, [inbox, reactedAt, threadSeen, seenTick])
  const likedMedia = useMemo(
    () =>
      votes.flatMap((row) => {
        const look = looksById[row.photo_id]
        if (look) return [{ ...look, reaction: row.kind, gallery: lookGalleryFor(look.id), media: look.src }]
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
            onOpenThread={openThread}
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
            counts={{ chats: chatRows.length, reactions: lookRows.length, booking: bookRows.length, clients: clients.length }}
            pane={pane}
            onPane={(next) => {
              setPane(next)
              if (next !== 'clients') setOpenClient(null)
            }}
          />
          {pane === 'chats' ? (
            <section>
              {chatRows.length ? (
                <ThreadList rows={chatRows} onOpen={openThread} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>When a client messages you, it lands here.</EmptyNote>
              )}
            </section>
          ) : null}
          {pane === 'reactions' ? (
            <section>
              {lookRows.length ? (
                <ThreadList rows={lookRows} variant="looks" onOpen={openThread} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>When a client sends a look or reel, it lands here.</EmptyNote>
              )}
            </section>
          ) : null}
          {pane === 'booking' ? (
            <section>
              {bookRows.length ? (
                <ThreadList rows={bookRows} onOpen={openThread} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>When a client books, it lands here.</EmptyNote>
              )}
            </section>
          ) : null}
          {pane === 'clients' ? (
            <section>
              {openClient ? (
                <>
                  <button
                    type="button"
                    className="mb-3 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wide text-ivory/60"
                    onClick={() => setOpenClient(null)}
                  >
                    <IoChevronBack className="h-4 w-4" />
                    Clients
                  </button>
                  {(() => {
                    const signals = signalsByVisitor[openClient.visitor_id] || {}
                    const seen = lastSeenLabel(
                      Math.max(stampAt(openClient.updated_at), stampAt(openClient.created_at), signals.last || 0)
                    )
                    const hasAny = signals.chats?.length || signals.looks?.length || signals.books?.length
                    return (
                      <>
                        <div className="mb-4 flex items-center gap-3">
                          <span className="relative shrink-0">
                            <ParlorAvatar id={openClient.avatar} size="md" />
                            {seen.online ? (
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#14110f]" />
                            ) : null}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ivory">{openClient.name}</p>
                            <p className={`text-[12px] ${seen.online ? 'text-emerald-300' : 'text-ivory/50'}`}>
                              {seen.text}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/15 px-2.5 py-1.5 text-ivory/80 hover:bg-white/10 hover:text-ivory disabled:opacity-50"
                            aria-label={`Message ${openClient.name}`}
                            disabled={chatBusy}
                            onClick={() => messageClient(openClient)}
                          >
                            <IoChatbubble className="h-4 w-4" />
                            <IoArrowForward className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {chatError ? <p className="mb-3 text-[12px] text-rose-200">{chatError}</p> : null}
                        {signals.chats?.length ? (
                          <div className="mb-5">
                            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                              Chats
                            </h2>
                            <ThreadList rows={signals.chats} onOpen={openThread} onGallery={openThreadGallery} />
                          </div>
                        ) : null}
                        {signals.looks?.length ? (
                          <div className="mb-5">
                            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                              Looks
                            </h2>
                            <ThreadList rows={dedupeLookThreads(signals.looks)} variant="looks" onOpen={openThread} onGallery={openThreadGallery} />
                          </div>
                        ) : null}
                        {signals.books?.length ? (
                          <div className="mb-5">
                            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/50">
                              Bookings
                            </h2>
                            <ThreadList rows={signals.books} onOpen={openThread} onGallery={openThreadGallery} />
                          </div>
                        ) : null}
                        {hasAny ? null : <EmptyNote>Nothing from them yet.</EmptyNote>}
                      </>
                    )
                  })()}
                </>
              ) : clients.length ? (
                <ul className="space-y-2">
                  {clients.map((item) => {
                    const signals = signalsByVisitor[item.visitor_id] || {}
                    const seen = lastSeenLabel(
                      Math.max(stampAt(item.updated_at), stampAt(item.created_at), signals.last || 0, seenTick * 0)
                    )
                    const notes = [
                      signals.chatAlert
                        ? { key: 'chat', Icon: IoChatbubble, label: 'New chat', run: () => openThread(signals.chatAlert) }
                        : null,
                      signals.lookAlert
                        ? { key: 'look', Icon: IoImage, label: 'New look', run: () => openThread(signals.lookAlert) }
                        : null,
                      signals.bookAlert
                        ? { key: 'book', Icon: IoCalendar, label: 'Pending booking', run: () => openThread(signals.bookAlert) }
                        : null,
                      signals.reactAlert ? { key: 'react', Icon: IoHeart, label: 'New reaction', run: null } : null,
                    ].filter(Boolean)
                    return (
                      <li key={item.visitor_id}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left"
                          onClick={() => openClientCard(item)}
                        >
                          <span className="relative shrink-0">
                            <ParlorAvatar id={item.avatar} size="md" />
                            {seen.online ? (
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#14110f]" />
                            ) : null}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ivory">{item.name}</span>
                            <span className={`block text-[12px] ${seen.online ? 'text-emerald-300' : 'text-ivory/50'}`}>
                              {seen.text}
                            </span>
                          </span>
                          {notes.length ? (
                            <span className="flex shrink-0 items-center gap-1 text-ivory/75">
                              {notes.map((note) => (
                                <note.Icon key={note.key} className="h-4 w-4" aria-label={note.label} />
                              ))}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <EmptyNote>When someone joins the parlor, they show here.</EmptyNote>
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
                <EmptyNote>Save a date — send it to the studio from here when you are ready.</EmptyNote>
              )}
            </section>
          ) : null}

          {pane === 'looks' ? (
            <section>
              {lookRows.length ? (
                <ThreadList rows={lookRows} variant="looks" peer="Geeta" onOpen={setChat} onGallery={openThreadGallery} />
              ) : (
                <EmptyNote>Send a bridal look, glam look, or a reel — they land here.</EmptyNote>
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
                        onClick={(event) => openGallery(event.currentTarget, item.gallery === 'bts' ? 'bts' : lookGalleryFor(item.id), item.id)}
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
