import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Copyright from './components/Copyright'
import Dock from './components/Dock'
import BookingModal from './components/BookingModal'
import { BookingProvider } from './context/BookingContext'

const Layout = () => (
  <BookingProvider>
    <Header />
    <Outlet />
    <Copyright />
    <Dock />
    <BookingModal />
  </BookingProvider>
)

export default Layout
