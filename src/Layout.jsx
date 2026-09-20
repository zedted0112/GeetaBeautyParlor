import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Copyright from './components/Copyright'
import WhatsAppButton from './components/WhatsAppButton'

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Copyright />
    <WhatsAppButton />
  </>
)

export default Layout
