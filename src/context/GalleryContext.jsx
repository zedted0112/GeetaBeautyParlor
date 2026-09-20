import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const GalleryContext = createContext(null)

export const GalleryProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const openGallery = useCallback(() => setOpen(true), [])
  const closeGallery = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ open, openGallery, closeGallery }), [open, openGallery, closeGallery])
  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export const useGallery = () => {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider')
  }
  return context
}
