import { useRef, useState } from 'react'

const PEEK = [
  { y: 0, scale: 1, rotate: 0 },
  { y: 18, scale: 0.95, rotate: -6 },
  { y: 34, scale: 0.9, rotate: 7 },
]

const ServiceDeck = ({ items, renderCard }) => {
  const [order, setOrder] = useState(() => items.map((_, index) => index))
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [exit, setExit] = useState(0)
  const live = useRef({ x: 0, y: 0, vx: 0, sx: 0, sy: 0, lx: 0, t: 0, down: false })

  const visible = order.slice(0, 3)
  const frontId = items[order[0]]?.id

  const flyOff = (dir) => {
    setDragging(false)
    setExit(dir)
    window.setTimeout(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]])
      setDrag({ x: 0, y: 0 })
      setExit(0)
      live.current = { ...live.current, x: 0, y: 0, vx: 0, down: false }
    }, 320)
  }

  const onPointerDown = (event) => {
    if (exit || event.target.closest('button')) return
    event.preventDefault()
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* untrusted or unsupported */
    }
    const now = performance.now()
    live.current = {
      x: 0,
      y: 0,
      vx: 0,
      sx: event.clientX,
      sy: event.clientY,
      lx: event.clientX,
      t: now,
      down: true,
    }
    setDragging(true)
  }

  const onPointerMove = (event) => {
    if (!live.current.down || exit) return
    const x = event.clientX - live.current.sx
    const y = (event.clientY - live.current.sy) * 0.38
    const now = performance.now()
    const dt = Math.max(now - live.current.t, 8)
    live.current.vx = (event.clientX - live.current.lx) / dt
    live.current.lx = event.clientX
    live.current.t = now
    live.current.x = x
    live.current.y = y
    setDrag({ x, y })
  }

  const onPointerUp = () => {
    if (!live.current.down || exit) return
    live.current.down = false
    const { x, vx } = live.current
    const dir = x > 0 || (Math.abs(x) < 8 && vx > 0) ? 1 : -1
    if (Math.abs(x) > 88 || Math.abs(vx) > 0.55) flyOff(x === 0 ? (vx >= 0 ? 1 : -1) : dir)
    else {
      setDragging(false)
      setDrag({ x: 0, y: 0 })
    }
  }

  return (
    <div className="sm:hidden">
      <div className="service-deck" aria-live="polite">
        {visible.map((itemIndex, stackPos) => {
          const service = items[itemIndex]
          const leaving = exit !== 0 && stackPos === 0
          const depth = exit !== 0 ? stackPos - 1 : stackPos
          const peek = PEEK[Math.max(depth, 0)] || PEEK[PEEK.length - 1]
          const isFront = depth === 0 && !leaving
          const rotate = leaving ? exit * 22 : isFront ? drag.x / 12 : peek.rotate
          const x = leaving ? exit * 460 : isFront ? drag.x : 0
          const y = leaving ? drag.y - 18 : isFront ? drag.y : peek.y
          const scale = leaving ? 1 : isFront ? 1 : peek.scale

          return (
            <div
              key={service.id}
              className={`service-deck-card ${isFront ? 'is-front' : ''} ${leaving ? 'is-exit' : ''}`}
              style={{
                zIndex: leaving ? 6 : 4 - stackPos,
                opacity: leaving ? 0 : 1,
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
                transition:
                  dragging && isFront
                    ? 'none'
                    : 'transform 0.38s cubic-bezier(0.22, 1.05, 0.32, 1), opacity 0.28s ease',
              }}
              onPointerDown={isFront ? onPointerDown : undefined}
              onPointerMove={isFront ? onPointerMove : undefined}
              onPointerUp={isFront ? onPointerUp : undefined}
              onPointerCancel={isFront ? onPointerUp : undefined}
            >
              {renderCard(service, { glass: true })}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((service) => (
          <span
            key={service.id}
            className={`h-1.5 rounded-full transition ${
              service.id === frontId ? 'w-5 bg-brand-400' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ServiceDeck
