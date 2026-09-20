import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const GalleryContext = createContext(null)

const originFrom = (from) => {
  const rect = from?.getBoundingClientRect?.() || from
  if (rect && Number.isFinite(rect.left) && Number.isFinite(rect.top)) {
    return {
      x: rect.left + (rect.width || 0) / 2,
      y: rect.top + (rect.height || 0) / 2,
    }
  }
  if (rect && Number.isFinite(rect.x) && Number.isFinite(rect.y)) {
    return { x: rect.x, y: rect.y }
  }
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight - 36,
  }
}

export const GalleryProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [origin, setOrigin] = useState(null)
  const closeTimer = useRef(null)

  const openGallery = useCallback((from) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOrigin(originFrom(from))
    setPhase('in')
    setOpen(true)
  }, [])

  const closeGallery = useCallback(() => {
    setPhase('out')
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    closeTimer.current = window.setTimeout(
      () => {
        setOpen(false)
        setPhase('idle')
      },
      reduced ? 0 : 580
    )
  }, [])

  const value = useMemo(
    () => ({ open, phase, origin, openGallery, closeGallery }),
    [open, phase, origin, openGallery, closeGallery]
  )
  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export const useGallery = () => {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider')
  }
  return context
}
