import { useState } from 'react'
import { REACTION_EMOJI } from '../../lib/reactions'
import { useNavigate } from 'react-router-dom'
import { useParlor } from '../../context/ParlorContext'
import ParlorAvatar from '../ParlorAvatar'

const KINDS = [
  { id: 'fire', emoji: REACTION_EMOJI.fire, label: 'Fire' },
  { id: 'heart', emoji: REACTION_EMOJI.heart, label: 'Heart' },
  { id: 'wow', emoji: REACTION_EMOJI.wow, label: 'Wow' },
  { id: 'eyes', emoji: REACTION_EMOJI.eyes, label: 'Love eyes' },
]

const timesFor = (hits) => {
  const n = Math.max(1, Number(hits) || 1)
  return n > 1 ? ` ${n} times` : ''
}

const lineFor = (row) => `${row.name} ${REACTION_EMOJI[row.kind] || ''} this look${timesFor(row.hits)}`

const GalleryReactions = ({ tally, onReact, presence = [] }) => {
  const { profile } = useParlor()
  const navigate = useNavigate()
  const [flies, setFlies] = useState([])
  const lines = presence.slice(0, 2)

  const burst = (emoji, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const pack = [0, 1, 2].map((i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      emoji,
      x,
      y,
      dx: `${i === 0 ? 0 : (i % 2 ? 22 : -22) + (Math.random() - 0.5) * 12}px`,
      dur: `${880 + i * 90}ms`,
      delay: `${i * 45}ms`,
      size: `${1.25 + i * 0.06}rem`,
    }))
    setFlies((current) => [...current, ...pack])
    window.setTimeout(() => {
      const gone = new Set(pack.map((item) => item.id))
      setFlies((current) => current.filter((item) => !gone.has(item.id)))
    }, 1400)
  }

  return (
    <div className="gallery-react shrink-0 px-3 py-2 sm:px-5 sm:py-2.5">
      <div className="pointer-events-none fixed inset-0 z-[130]" aria-hidden="true">
        {flies.map((item) => (
          <span
            key={item.id}
            className="parlor-fly"
            style={{
              left: item.x,
              top: item.y,
              '--dx': item.dx,
              '--dur': item.dur,
              '--delay': item.delay,
              fontSize: item.size,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ivory/40">Parlor reactions</p>
        {profile ? (
          <button type="button" className="parlor-you" onClick={() => navigate('/me')} aria-label="Open parlor space">
            <ParlorAvatar id={profile.avatar} size="sm" />
            <span className="max-w-[7rem] truncate text-[11px] text-ivory/70">{profile.name}</span>
          </button>
        ) : (
          <p className="text-[10px] text-ivory/35">React to join</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-1.5 sm:justify-start sm:gap-2">
        {KINDS.map((kind) => {
          const mine = tally.mine?.[kind.id] || 0
          const on = mine > 0 || tally.picked === kind.id
          return (
            <button
              key={kind.id}
              type="button"
              aria-pressed={on}
              aria-label={`${kind.label}, ${tally[kind.id] || 0}`}
              className={`gallery-react-btn ${on ? 'is-on' : ''}`}
              onClick={(event) => {
                burst(kind.emoji, event)
                onReact(kind.id)
              }}
            >
              <span className="text-base leading-none sm:text-lg">{kind.emoji}</span>
              <span className="text-[11px] tabular-nums text-ivory/70">{tally[kind.id] || 0}</span>
            </button>
          )
        })}
      </div>
      <p className="parlor-strip">
        {lines.length
          ? lines.map((row) => lineFor(row)).join(' · ')
          : 'Be the first in the parlor on this look.'}
      </p>
    </div>
  )
}

export default GalleryReactions
