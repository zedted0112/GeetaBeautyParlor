import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Dock from './components/Dock'
import BookingModal from './components/BookingModal'
import BridalGallery from './components/Home/BridalGallery'
import { BookingProvider } from './context/BookingContext'
import { GalleryProvider, useGallery } from './context/GalleryContext'

const Shell = () => {
  const { open, phase, origin, closeGallery } = useGallery()

  return (
    <>
      <Header />
      <Outlet />
      <Dock />
      <BookingModal />
      <BridalGallery open={open} phase={phase} origin={origin} onClose={closeGallery} />
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
