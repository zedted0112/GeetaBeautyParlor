import { useEffect, useRef, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { contact } from '../../data/content'
import { useBooking } from '../../context/BookingContext'
import { useParlor } from '../../context/ParlorContext'
import { isAdminProfile, readLocalProfile } from '../../lib/profile'
import { getVisitorId } from '../../lib/visitor'
import { emptyTally, emptyTallies, loadPresence, loadTallies, saveVote, subscribeTallies } from '../../lib/reactions'
import GalleryReactions from './GalleryReactions'
import SendLookSheet from '../SendLookSheet'
import { holdImage, holdImages } from '../../lib/mediaCache'

const reels = contact.instagramReels
const reelIds = reels.map((item) => item.id)

const BehindTheScenes = ({ open, phase = 'in', origin, startId = null, onClose }) => {
  const { openBooking } = useBooking()
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [muted, setMuted] = useState(true)
  const [tallies, setTallies] = useState(() => emptyTallies(reelIds))
  const [presence, setPresence] = useState([])
  const swipe = useRef(null)
  const didSwipe = useRef(false)
  const videoRefs = useRef([])
  const { ensureProfile, visitorId } = useParlor()
  const [lookSent, setLookSent] = useState({})
  const [noteOpen, setNoteOpen] = useState(false)
  const reel = reels[active]
  const landscape = reel?.layout === 'landscape'
  const reelIdRef = useRef(reel.id)
  reelIdRef.current = reel.id
  const tally = tallies[reel.id] || emptyTally()

  const openSend = async () => {
    if (lookSent[reel.id] === true) return
    if (!(await ensureProfile())) return
    const next = readLocalProfile()
    if (!next || isAdminProfile(next, getVisitorId() || visitorId)) return
    setNoteOpen(true)
  }

  const react = async (kind) => {
    if (!(await ensureProfile())) return
    const current = tallies[reel.id] || emptyTally()
    const previous = current.picked
    setTallies((prev) => {
      const row = { ...(prev[reel.id] || emptyTally()) }
      if (row.picked === kind) {
        row[kind] = Math.max(0, row[kind] - 1)
        row.picked = null
      } else {
        if (row.picked) row[row.picked] = Math.max(0, row[row.picked] - 1)
        row[kind] += 1
        row.picked = kind
      }
      return { ...prev, [reel.id]: row }
    })
    try {
      await saveVote(reel.id, visitorId, kind, previous)
    } catch {
      try {
        setTallies(await loadTallies(reelIds, visitorId))
      } catch {
        // keep optimistic counts if the refresh also fails
      }
    }
  }

  useEffect(() => {
    holdImages(reels.map((item) => item.poster))
  }, [])

  useEffect(() => {
    holdImage(reel?.poster)
  }, [reel?.poster])

  useEffect(() => {
    if (!open) {
      setReady(false)
      videoRefs.current.forEach((el) => el?.pause())
      return undefined
    }
    const index = startId ? reels.findIndex((item) => item.id === startId) : 0
    setActive(index >= 0 ? index : 0)
    const show = window.setTimeout(() => setReady(true), 80)

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') setActive((index) => (index + 1) % reels.length)
      if (event.key === 'ArrowLeft') setActive((index) => (index - 1 + reels.length) % reels.length)
      if (event.key === 'm' || event.key === 'M') setMuted((value) => !value)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(show)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, startId])

  useEffect(() => {
    if (!open) return undefined
    let alive = true
    loadTallies(reelIds, visitorId)
      .then((next) => {
        if (alive) setTallies(next)
      })
      .catch(() => {})
    const stop = subscribeTallies(reelIds, visitorId, (next) => {
      if (!alive) return
      setTallies(next)
      loadPresence(reelIdRef.current, visitorId)
        .then((rows) => {
          if (alive) setPresence(rows)
        })
        .catch(() => {})
    })
    return () => {
      alive = false
      stop?.()
    }
  }, [open, visitorId])

  useEffect(() => {
    if (!open) return undefined
    let alive = true
    loadPresence(reel.id, visitorId)
      .then((rows) => {
        if (alive) setPresence(rows)
      })
      .catch(() => {
        if (alive) setPresence([])
      })
    return () => {
      alive = false
    }
  }, [open, reel.id, visitorId, tally.picked])

  useEffect(() => {
    videoRefs.current.forEach((el) => {
      if (el) el.muted = muted
    })
  }, [muted])

  useEffect(() => {
    if (!open || !ready) return
    videoRefs.current.forEach((el, index) => {
      if (!el) return
      if (index === active) {
        if (el.ended) el.currentTime = 0
        const play = el.play()
        if (play) {
          play.catch(() => {
            el.muted = true
            setMuted(true)
            el.play().catch(() => {})
          })
        }
      } else {
        el.pause()
      }
    })
  }, [active, open, ready])

  const goPrev = () => setActive((index) => (index - 1 + reels.length) % reels.length)
  const goNext = () => setActive((index) => (index + 1) % reels.length)
  const toggleMute = () => setMuted((value) => !value)

  const startSwipe = (x, y) => {
    didSwipe.current = false
    swipe.current = { x, y }
  }

  const endSwipe = (x, y) => {
    if (!swipe.current) return
    const dx = x - swipe.current.x
    const dy = y - swipe.current.y
    swipe.current = null
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
    didSwipe.current = true
    if (dx < 0) goNext()
    else goPrev()
  }

  const onReelTap = () => {
    if (didSwipe.current) {
      didSwipe.current = false
      return
    }
    toggleMute()
  }

  const onReelEnded = (index) => {
    const el = videoRefs.current[index]
    if (reels.length < 2) {
      if (el) {
        el.currentTime = 0
        el.play().catch(() => {})
      }
      return
    }
    goNext()
  }

  if (!open) {
    return (
      <div className="pointer-events-none invisible fixed h-0 w-0 overflow-hidden" aria-hidden="true">
        {reels.map((item) => (
          <img key={item.id} src={item.poster} alt="" decoding="async" />
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="bts-title">
      <button
        type="button"
        className={`gallery-veil ${phase === 'out' ? 'is-out' : 'is-in'}`}
        aria-label="Close behind the scenes"
        onClick={onClose}
      />
      <div
        className={`gallery-paper pointer-events-none ${phase === 'out' ? 'is-out' : 'is-in'}`}
        style={{
          '--ox': `${origin?.x ?? window.innerWidth / 2}px`,
          '--oy': `${origin?.y ?? window.innerHeight - 36}px`,
        }}
      >
        <div
          className="pointer-events-auto relative flex h-[100dvh] w-full flex-col overflow-hidden border-white/10 bg-[#14110f] shadow-2xl sm:h-[min(94vh,920px)] sm:w-[min(96vw,1280px)] sm:rounded-3xl sm:border lg:flex-row"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative flex min-h-0 flex-1 flex-col bg-black pt-[env(safe-area-inset-top)]">
            <div className="relative min-h-0 flex-1">
              <div className={`reel-frame ${landscape ? 'is-landscape' : ''}`}>
                {ready
                  ? reels.map((item, index) => {
                      const shown = index === active
                      const layer = shown ? 'z-[1]' : 'invisible pointer-events-none'
                      if (item.type === 'video') {
                        return (
                          <video
                            key={item.id}
                            ref={(node) => {
                              videoRefs.current[index] = node
                            }}
                            src={item.src}
                            poster={item.poster}
                            className={`absolute inset-0 ${layer}`}
                            controls
                            muted={muted}
                            playsInline
                            preload="metadata"
                            controlsList="nodownload"
                            onEnded={() => onReelEnded(index)}
                            onVolumeChange={(event) => {
                              const next = event.currentTarget.muted
                              setMuted((current) => (current === next ? current : next))
                            }}
                          />
                        )
                      }
                      return (
                        <iframe
                          key={item.id}
                          title={`Studio reel ${index + 1}`}
                          src={item.embed}
                          className={`absolute inset-0 h-full w-full border-0 ${layer}`}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )
                    })
                  : null}
              </div>
              <div
                className="absolute inset-x-0 top-0 bottom-16 z-[12] touch-none"
                aria-label="Tap to mute or unmute, swipe to change reel"
                onPointerDown={(event) => {
                  if (event.button !== 0) return
                  startSwipe(event.clientX, event.clientY)
                  try {
                    event.currentTarget.setPointerCapture(event.pointerId)
                  } catch {
                    // some browsers reject capture on synthetic events
                  }
                }}
                onPointerUp={(event) => endSwipe(event.clientX, event.clientY)}
                onPointerCancel={() => {
                  swipe.current = null
                }}
                onClick={onReelTap}
              />
              {reels.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white sm:left-5"
                    aria-label="Previous reel"
                    onClick={goPrev}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white sm:right-5"
                    aria-label="Next reel"
                    onClick={goNext}
                  >
                    →
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={toggleMute}
                className="absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 rounded-full bg-black/55 p-2 text-white"
                aria-label={muted ? 'Unmute reel' : 'Mute reel'}
              >
                {muted ? <IoVolumeMute className="h-6 w-6" /> : <IoVolumeHigh className="h-6 w-6" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-20 rounded-full bg-black/55 p-1 text-white lg:hidden"
                aria-label="Close behind the scenes"
              >
                <IoIosCloseCircle className="h-8 w-8" />
              </button>
            </div>
            <GalleryReactions tally={tally} onReact={react} presence={presence} />
          </div>

          <aside className="flex w-full shrink-0 flex-col border-t border-white/10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 sm:p-5 lg:w-[360px] lg:border-l lg:border-t-0 lg:p-6">
            <div className="mb-2 flex items-center justify-between gap-3 sm:mb-3 sm:items-start lg:mb-4">
              <div>
                <div className="hidden sm:block">
                  <p className="section-badge">Studio reels</p>
                </div>
                <h3 id="bts-title" className="font-display text-base text-ivory sm:mt-3 sm:text-3xl">
                  Behind the Scenes
                </h3>
                <p className="mt-2 hidden text-sm text-ivory/65 lg:block">
                  Watch how a look comes together in the parlor — light, jewellery, and the finishing that holds through the day.
                </p>
              </div>
              {reels.length > 1 ? (
                <p className="shrink-0 text-sm text-ivory/50 sm:hidden">
                  {active + 1} / {reels.length}
                </p>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="hidden rounded-full p-1 text-ivory/70 transition hover:text-ivory lg:block"
                aria-label="Close behind the scenes"
              >
                <IoIosCloseCircle className="h-9 w-9" />
              </button>
            </div>

            {reels.length > 1 ? (
              <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:overflow-y-auto">
                {reels.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`photo-thumb h-[5.25rem] w-16 shrink-0 sm:h-16 sm:w-12 lg:h-auto lg:w-auto ${
                      index === active ? 'border-brand-400' : 'border-transparent'
                    }`}
                    aria-label={`Show reel ${index + 1}`}
                    aria-current={index === active ? 'true' : undefined}
                  >
                    <img
                      src={item.poster}
                      alt=""
                      className="h-full w-full object-cover object-[center_20%]"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-3 flex items-center gap-2 sm:mt-5">
              {reels.length > 1 ? (
                <p className="hidden shrink-0 text-sm text-ivory/50 sm:mr-auto sm:block">
                  {active + 1} / {reels.length}
                </p>
              ) : null}
              {reel.url ? (
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden text-sm font-semibold text-brand-300 transition hover:text-brand-200 sm:inline-flex"
                >
                  Open on Instagram →
                </a>
              ) : null}
              <button
                type="button"
                className="btn-secondary min-h-10 flex-1 px-3 py-2 text-xs sm:flex-none sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
                onClick={openSend}
              >
                {lookSent[reel.id] === true ? 'Sent' : 'Send to Geeta'}
              </button>
              <button
                type="button"
                className="btn-primary min-h-10 flex-1 px-3 py-2 text-xs sm:flex-none sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
                onClick={() => {
                  onClose()
                  openBooking('an appointment')
                }}
              >
                Book a look
              </button>
            </div>
          </aside>
        </div>
      </div>
      <SendLookSheet
        open={noteOpen}
        kind="reel"
        refId={reel.id}
        image={reel.poster}
        onClose={() => setNoteOpen(false)}
        onSent={() => setLookSent((current) => ({ ...current, [reel.id]: true }))}
      />
    </div>
  )
}

export default BehindTheScenes
