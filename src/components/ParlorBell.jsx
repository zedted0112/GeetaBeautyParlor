import { useEffect, useMemo, useRef, useState } from 'react'
import { IoNotifications } from 'react-icons/io5'
import { contact } from '../data/content'
import { formatStudioDate, nowMs } from '../lib/clock'
import { holdImages } from '../lib/mediaCache'
import { GEETA_ADMIN_ID } from '../lib/profile'
import { REACTION_EMOJI, loadReactionFeed, subscribeReactionFeed } from '../lib/reactions'
import { bridalPhotos } from './Home/BridalGallery'
import ParlorAvatar from './ParlorAvatar'

const seenKey = (visitorId) => `gbp-parlor-notifs-seen:${visitorId || 'anon'}`

const readSeen = (visitorId) => {
  try {
    const value = Number(window.localStorage.getItem(seenKey(visitorId)) || 0)
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

const writeSeen = (visitorId, value) => {
  window.localStorage.setItem(seenKey(visitorId), String(value))
}

const stamp = (value) => {
  const time = value ? new Date(value).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

const ago = (value) => {
  const time = stamp(value)
  if (!time) return ''
  const mins = Math.max(0, Math.round((nowMs() - time) / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h`
  return formatStudioDate(time)
}

const looksById = Object.fromEntries(bridalPhotos.map((item) => [item.id, item]))
const reelsById = Object.fromEntries(contact.instagramReels.map((item) => [item.id, item]))

const mediaFor = (photoId) => {
  const look = looksById[photoId]
  if (look) return { src: look.src, label: 'Bridal look', gallery: 'bridal' }
  const reel = reelsById[photoId]
  if (reel) return { src: reel.poster, label: 'Reel', gallery: 'bts' }
  return { src: '', label: 'Look', gallery: 'bridal' }
}

const ParlorBell = ({ admin, visitorId, inbox = [], onOpenThread, onOpenLook }) => {
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(() => readSeen(visitorId))
  const [reactions, setReactions] = useState([])
  const box = useRef(null)

  useEffect(() => {
    setSeen(readSeen(visitorId))
  }, [visitorId])

  useEffect(() => {
    if (!admin) return undefined
    let alive = true
    loadReactionFeed({ excludeVisitorId: GEETA_ADMIN_ID })
      .then((rows) => {
        if (alive) setReactions(rows)
        holdImages(rows.map((row) => mediaFor(row.photoId).src).filter(Boolean))
      })
      .catch(() => {
        if (alive) setReactions([])
      })
    const stop = subscribeReactionFeed((rows) => {
      if (alive) setReactions(rows)
      holdImages(rows.map((row) => mediaFor(row.photoId).src).filter(Boolean))
    }, { excludeVisitorId: GEETA_ADMIN_ID })
    return () => {
      alive = false
      stop()
    }
  }, [admin])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (event) => {
      if (!box.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const clientNotes = useMemo(() => {
    if (admin) return []
    return (inbox || [])
      .map((row) => {
        const reply = row.lastReply
        if (!reply || reply.from_visitor_id === visitorId) return null
        return {
          id: `reply:${row.id}:${reply.created_at || ''}`,
          at: reply.created_at || row.created_at,
          name: reply.from_name || 'Geeta',
          avatar: reply.from_avatar || 'lotus',
          body: reply.body,
          row,
        }
      })
      .filter(Boolean)
      .sort((a, b) => stamp(b.at) - stamp(a.at))
  }, [admin, inbox, visitorId])

  const items = admin ? reactions : clientNotes
  const unread = items.filter((item) => stamp(item.at) > seen).length

  const toggle = () => {
    setOpen((on) => {
      const next = !on
      if (next) {
        const latest = items.reduce((max, item) => Math.max(max, stamp(item.at)), Date.now())
        writeSeen(visitorId, latest)
        setSeen(latest)
      }
      return next
    })
  }

  return (
    <div className="relative" ref={box}>
      <button
        type="button"
        className="relative rounded-full border border-white/15 p-2 text-ivory/80 transition hover:text-ivory"
        aria-label={unread ? `${unread} notifications` : 'Notifications'}
        aria-expanded={open}
        onClick={toggle}
      >
        <IoNotifications className="h-5 w-5" />
        {unread ? (
          <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-brand-500 px-1 text-center text-[9px] font-semibold leading-4 text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-[85] mt-2 w-[min(18.5rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/15 bg-[#1b1714] shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <p className="border-b border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory/50">
            {admin ? 'Reactions' : 'Updates'}
          </p>
          <ul className="max-h-[22rem] overflow-y-auto">
            {admin
              ? reactions.length
                ? reactions.map((item) => {
                    const media = mediaFor(item.photoId)
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/5"
                          onClick={(event) => {
                            setOpen(false)
                            onOpenLook?.(event.currentTarget, media.gallery, item.photoId)
                          }}
                        >
                          <ParlorAvatar id={item.avatar} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] text-ivory">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-ivory/70"> reacted {REACTION_EMOJI[item.kind] || ''}</span>
                            </span>
                            <span className="block text-[11px] text-ivory/45">
                              {media.label} · {ago(item.at)}
                            </span>
                          </span>
                          {media.src ? (
                            <img src={media.src} alt="" className="h-10 w-8 shrink-0 rounded-md object-cover" />
                          ) : null}
                        </button>
                      </li>
                    )
                  })
                : (
                  <li className="px-3 py-4 text-[13px] text-ivory/50">No reactions yet.</li>
                )
              : clientNotes.length
                ? clientNotes.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/5"
                        onClick={() => {
                          setOpen(false)
                          onOpenThread?.(item.row)
                        }}
                      >
                        <ParlorAvatar id={item.avatar} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] text-ivory">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-ivory/70"> replied</span>
                          </span>
                          <span className="block truncate text-[12px] text-ivory/60">{item.body}</span>
                          <span className="block text-[11px] text-ivory/45">{ago(item.at)}</span>
                        </span>
                      </button>
                    </li>
                  ))
                : (
                  <li className="px-3 py-4 text-[13px] text-ivory/50">No updates yet.</li>
                )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default ParlorBell
