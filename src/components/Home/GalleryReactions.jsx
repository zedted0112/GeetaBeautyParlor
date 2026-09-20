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

const lineFor = (row) => `${row.name} ${REACTION_EMOJI[row.kind] || ''} this look`

const GalleryReactions = ({ tally, onReact, presence = [] }) => {
  const { profile } = useParlor()
  const navigate = useNavigate()
  const lines = presence.slice(0, 2)

  return (
    <div className="gallery-react shrink-0 px-3 py-2 sm:px-5 sm:py-2.5">
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
          const on = tally.picked === kind.id
          return (
            <button
              key={kind.id}
              type="button"
              aria-pressed={on}
              aria-label={`${kind.label}, ${tally[kind.id] || 0}`}
              className={`gallery-react-btn ${on ? 'is-on' : ''}`}
              onClick={() => onReact(kind.id)}
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
