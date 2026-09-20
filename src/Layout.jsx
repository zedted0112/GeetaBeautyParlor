import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Dock from './components/Dock'
import BookingModal from './components/BookingModal'
import BridalGallery from './components/Home/BridalGallery'
import BehindTheScenes from './components/Home/BehindTheScenes'
import GoatCounter from './components/GoatCounter'
import MobileGate from './components/MobileGate'
import ParlorSignup from './components/ParlorSignup'
import { BookingProvider } from './context/BookingContext'
import { GalleryProvider, useGallery } from './context/GalleryContext'
import { ParlorProvider } from './context/ParlorContext'

const Shell = () => {
  const { open, kind, phase, origin, startId, closeGallery } = useGallery()

  return (
    <>
      <GoatCounter />
      <MobileGate />
      <Header />
      <Outlet />
      <Dock />
      <BookingModal />
      <ParlorSignup />
      {kind === 'bts' ? (
        <BehindTheScenes open={open} phase={phase} origin={origin} startId={startId} onClose={closeGallery} />
      ) : (
        <BridalGallery open={open} phase={phase} origin={origin} startId={startId} onClose={closeGallery} />
      )}
    </>
  )
}

const Layout = () => (
  <BookingProvider>
    <GalleryProvider>
      <ParlorProvider>
        <Shell />
      </ParlorProvider>
    </GalleryProvider>
  </BookingProvider>
)

export default Layout
