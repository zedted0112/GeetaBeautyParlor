const KINDS = [
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'heart', emoji: '❤️', label: 'Heart' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'eyes', emoji: '😍', label: 'Love eyes' },
]

const GalleryReactions = ({ tally, onReact }) => (
  <div className="gallery-react shrink-0 px-3 py-2 sm:px-5 sm:py-2.5">
    <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory/40">
      Parlor reactions
    </p>
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
  </div>
)

export default GalleryReactions
