import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Copyright from './components/Copyright'
import WhatsAppButton from './components/WhatsAppButton'
import BookingModal from './components/BookingModal'
import { BookingProvider } from './context/BookingContext'

const Layout = () => (
  <BookingProvider>
    <Header />
    <Outlet />
    <Copyright />
    <WhatsAppButton />
    <BookingModal />
  </BookingProvider>
)

export default Layout
