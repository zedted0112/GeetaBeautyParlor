import Copyright from './components/Copyright';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
        <Outlet />
       <Copyright/>
    </>
  )
}

export default Layout;