import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { contact } from '../data/content'
import { PARLOR_ROLES } from '../lib/profile'
import { REACTION_EMOJI, loadVisitorVotes } from '../lib/reactions'
import { loadVisits, openVisitBooking, prettyVisitDate } from '../lib/visits'
import { useParlor } from '../context/ParlorContext'
import { useBooking } from '../context/BookingContext'
import { useGallery } from '../context/GalleryContext'
import { bridalPhotos } from './Home/BridalGallery'
import ParlorAvatar from './ParlorAvatar'

const looksById = Object.fromEntries(bridalPhotos.map((item) => [item.id, item]))
const reelsById = Object.fromEntries(contact.instagramReels.map((item) => [item.id, item]))

const ParlorSpace = () => {
  const navigate = useNavigate()
  const { profile, visitorId, openProfile } = useParlor()
  const { open: bookingOpen, openPlan } = useBooking()
  const { open: galleryOpen, openGallery } = useGallery()
  const [votes, setVotes] = useState([])
  const [visits, setVisits] = useState([])
  const role = PARLOR_ROLES.find((item) => item.id === profile?.role)

  useEffect(() => {
    if (!visitorId || galleryOpen) return undefined
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
  }, [visitorId, galleryOpen])

  useEffect(() => {
    if (!visitorId || bookingOpen) return undefined
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
  }, [visitorId, bookingOpen])

  const looks = useMemo(
    () => votes.filter((row) => looksById[row.photo_id]).map((row) => ({ ...looksById[row.photo_id], kind: row.kind })),
    [votes]
  )
  const reels = useMemo(
    () => votes.filter((row) => reelsById[row.photo_id]).map((row) => ({ ...reelsById[row.photo_id], kind: row.kind })),
    [votes]
  )

  if (!profile) return <Navigate to="/" replace />

  return (
    <main className="mx-auto min-h-[100svh] w-[min(94%,40rem)] px-1 pb-[calc(6.2rem+env(safe-area-inset-bottom))] pt-[calc(5.6rem+env(safe-area-inset-top))]">
      <header className="mb-6 flex items-center gap-3">
        <ParlorAvatar id={profile.avatar} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.16em] text-brand-200">Your parlor</p>
          <h1 className="font-display text-2xl leading-tight text-ivory">{profile.name}</h1>
          <p className="text-[12px] text-ivory/55">{role?.label || profile.role}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ivory/80"
          onClick={openProfile}
        >
          Edit
        </button>
      </header>

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
                  onClick={() => openVisitBooking(item, profile.name)}
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-[13px] text-ivory/50">
            Save a date — book it from here when you are ready.
          </p>
        )}
      </section>

      <button
        type="button"
        className="mt-8 w-full text-center text-[12px] text-ivory/40"
        onClick={() => navigate('/')}
      >
        Back to the studio
      </button>
    </main>
  )
}

export default ParlorSpace
