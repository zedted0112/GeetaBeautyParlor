import { useEffect } from 'react'
import { scrollToHash } from '../../utils/scroll'
import HeroHome from './HeroHome'
import About from './About'
import Services from './Services'
import Cta from './Cta'

const Home = () => {
  useEffect(() => {
    scrollToHash()
  }, [])

  return (
    <main>
      <HeroHome />
      <About />
      <Services />
      <Cta />
    </main>
  )
}

export default Home
