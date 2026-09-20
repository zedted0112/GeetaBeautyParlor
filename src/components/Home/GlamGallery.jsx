import { useEffect, useMemo, useRef, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { serviceImages } from '../../utils/imageImports'
import { useBooking } from '../../context/BookingContext'
import { useParlor } from '../../context/ParlorContext'
import { isAdminProfile, readLocalProfile } from '../../lib/profile'
import { getVisitorId } from '../../lib/visitor'
import { emptyTally, emptyTallies, loadPresence, loadTallies, saveVote, subscribeTallies } from '../../lib/reactions'
import GalleryReactions from './GalleryReactions'
import SendLookSheet from '../SendLookSheet'
import { holdImage, holdImages } from '../../lib/mediaCache'

export const glamPhotos = [
  { id: 'glam-1', src: serviceImages.glam.g001 },
  { id: 'glam-2', src: serviceImages.glam.g002 },
  { id: 'glam-3', src: serviceImages.glam.g003 },
  { id: 'glam-4', src: serviceImages.glam.g004 },
  { id: 'glam-5', src: serviceImages.glam.g005 },
  { id: 'glam-6', src: serviceImages.glam.g006 },
  { id: 'glam-7', src: serviceImages.glam.g007 },
  { id: 'glam-8', src: serviceImages.glam.g008 },
  { id: 'glam-9', src: serviceImages.glam.g009 },
]

const GlamGallery = ({ open, phase = 'in', origin, startId = null, onClose }) => {
  const photoIds = useMemo(() => glamPhotos.map((photo) => photo.id), [])
  const [active, setActive] = useState(0)
  const [tallies, setTallies] = useState(() => emptyTallies(photoIds))
  const [presence, setPresence] = useState([])
  const { openBooking } = useBooking()
  const { ensureProfile, visitorId } = useParlor()
  const [lookSent, setLookSent] = useState({})
  const [noteOpen, setNoteOpen] = useState(false)
  const touchX = useRef(null)
  const photo = glamPhotos[active]
  const photoIdRef = useRef(photo.id)
  photoIdRef.current = photo.id
  const tally = tallies[photo.id] || emptyTally()

  const openSend = async () => {
    if (!(await ensureProfile())) return
    const next = readLocalProfile()
    if (!next || isAdminProfile(next, getVisitorId() || visitorId)) return
    setNoteOpen(true)
  }

  const react = async (kind) => {
    if (!(await ensureProfile())) return
    const current = tallies[photo.id] || emptyTally()
    const previous = current.picked
    setTallies((prev) => {
      const row = { ...(prev[photo.id] || emptyTally()) }
      if (row.picked === kind) {
        row[kind] = Math.max(0, row[kind] - 1)
        row.picked = null
      } else {
        if (row.picked) row[row.picked] = Math.max(0, row[row.picked] - 1)
        row[kind] += 1
        row.picked = kind
      }
      return { ...prev, [photo.id]: row }
    })
    try {
      await saveVote(photo.id, visitorId, kind, previous)
    } catch {
      try {
        setTallies(await loadTallies(photoIds, visitorId))
      } catch {
        // keep optimistic counts if the refresh also fails
      }
    }
  }

  useEffect(() => {
    let alive = true
    loadTallies(photoIds, visitorId)
      .then((next) => {
        if (alive) setTallies(next)
      })
      .catch(() => {})
    const stop = subscribeTallies(photoIds, visitorId, (next) => {
      if (!alive) return
      setTallies(next)
      loadPresence(photoIdRef.current, visitorId)
        .then((rows) => {
          if (alive) setPresence(rows)
        })
        .catch(() => {})
    })
    return () => {
      alive = false
      stop()
    }
  }, [photoIds, visitorId])

  useEffect(() => {
    let alive = true
    loadPresence(photo.id, visitorId)
      .then((rows) => {
        if (alive) setPresence(rows)
      })
      .catch(() => {
        if (alive) setPresence([])
      })
    return () => {
      alive = false
    }
  }, [photo.id, visitorId, tally.picked])

  useEffect(() => {
    holdImages(glamPhotos.map((item) => item.src))
  }, [])

  useEffect(() => {
    holdImage(photo.src)
  }, [photo.src])

  useEffect(() => {
    if (!open) return undefined
    const index = startId ? glamPhotos.findIndex((item) => item.id === startId) : 0
    setActive(index >= 0 ? index : 0)

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') {
        setActive((index) => (index + 1) % glamPhotos.length)
      }
      if (event.key === 'ArrowLeft') {
        setActive((index) => (index - 1 + glamPhotos.length) % glamPhotos.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, startId])

  const goPrev = () => setActive((index) => (index - 1 + glamPhotos.length) % glamPhotos.length)
  const goNext = () => setActive((index) => (index + 1) % glamPhotos.length)

  const onTouchStart = (event) => {
    touchX.current = event.changedTouches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (touchX.current == null) return
    const delta = event.changedTouches[0].clientX - touchX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchX.current = null
  }

  if (!open) {
    return (
      <div className="pointer-events-none invisible fixed h-0 w-0 overflow-hidden" aria-hidden="true">
        {glamPhotos.map((item) => (
          <img key={item.id} src={item.src} alt="" decoding="async" />
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="glam-gallery-title">
      <button
        type="button"
        className={`gallery-veil ${phase === 'out' ? 'is-out' : 'is-in'}`}
        aria-label="Close gallery"
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
          <div
            className="relative min-h-0 flex-1"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="photo-frame">
              <img
                src={photo.src}
                alt={`Glam look ${active + 1}`}
                className="h-full w-full object-contain object-center"
                decoding="async"
              />
            </div>
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white sm:left-5"
              aria-label="Previous photo"
              onClick={goPrev}
            >
              ←
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white sm:right-5"
              aria-label="Next photo"
              onClick={goNext}
            >
              →
            </button>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] rounded-full bg-black/55 p-1 text-white lg:hidden"
              aria-label="Close gallery"
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
                <p className="section-badge">Party looks</p>
              </div>
              <h3 id="glam-gallery-title" className="font-display text-base text-ivory sm:mt-3 sm:text-3xl">
                GLAM
              </h3>
              <p className="mt-2 hidden text-sm text-ivory/65 lg:block">
                Event makeup in the same frame, so the full look always fits.
              </p>
            </div>
            <p className="shrink-0 text-sm text-ivory/50 sm:hidden">
              {active + 1} / {glamPhotos.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="hidden rounded-full p-1 text-ivory/70 transition hover:text-ivory lg:block"
              aria-label="Close gallery"
            >
              <IoIosCloseCircle className="h-9 w-9" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:overflow-y-auto">
            {glamPhotos.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={`photo-thumb h-[5.25rem] w-16 shrink-0 sm:h-16 sm:w-12 lg:h-auto lg:w-auto ${index === active ? 'border-brand-400' : 'border-transparent'}`}
                aria-label={`Show glam photo ${index + 1}`}
              >
                <img src={item.src} alt="" className="h-full w-full object-cover object-[center_20%]" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 sm:mt-5">
            <p className="hidden shrink-0 text-sm text-ivory/50 sm:mr-auto sm:block">
              {active + 1} / {glamPhotos.length}
            </p>
            <button
              type="button"
              className="btn-secondary min-h-10 flex-1 px-3 py-2 text-xs sm:flex-none sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
              onClick={openSend}
            >
              {lookSent[photo.id] === true ? 'Add note' : 'Send To Studio'}
            </button>
            <button
              type="button"
              className="btn-primary min-h-10 flex-1 px-3 py-2 text-xs sm:flex-none sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
              onClick={() => {
                onClose()
                openBooking('GLAM')
              }}
            >
              Book this look
            </button>
          </div>
        </aside>
      </div>
      </div>
      <SendLookSheet
        open={noteOpen}
        kind="look"
        refId={photo.id}
        image={photo.src}
        onClose={() => setNoteOpen(false)}
        onSent={() => setLookSent((current) => ({ ...current, [photo.id]: true }))}
      />
    </div>
  )
}

export default GlamGallery
