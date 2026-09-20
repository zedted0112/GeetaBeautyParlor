import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Dock from './components/Dock'
import BookingModal from './components/BookingModal'
import BridalGallery from './components/Home/BridalGallery'
import BehindTheScenes from './components/Home/BehindTheScenes'
import GoatCounter from './components/GoatCounter'
import { BookingProvider } from './context/BookingContext'
import { GalleryProvider, useGallery } from './context/GalleryContext'

const Shell = () => {
  const { open, kind, phase, origin, closeGallery } = useGallery()

  return (
    <>
      <GoatCounter />
      <Header />
      <Outlet />
      <Dock />
      <BookingModal />
      {kind === 'bts' ? (
        <BehindTheScenes open={open} phase={phase} origin={origin} onClose={closeGallery} />
      ) : (
        <BridalGallery open={open} phase={phase} origin={origin} onClose={closeGallery} />
      )}
    </>
  )
}

const Layout = () => (
  <BookingProvider>
    <GalleryProvider>
      <Shell />
    </GalleryProvider>
  </BookingProvider>
)

export default Layout
