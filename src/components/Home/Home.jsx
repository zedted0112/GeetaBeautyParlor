import { useEffect } from 'react'
import { scrollToHash } from '../../utils/scroll'
import HeroHome from './HeroHome'
import About from './About'
import Stats from './Stats'
import Services from './Services'
import Cta from './Cta'
import Contact from './Contact'

const Home = () => {
  useEffect(() => {
    scrollToHash()
  }, [])

  return (
    <main>
      <HeroHome />
      <About />
      <Stats />
      <Services />
      <Cta />
      <Contact />
    </main>
  )
}

export default Home
