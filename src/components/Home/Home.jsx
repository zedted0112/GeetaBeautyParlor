import React, { useEffect } from 'react'
import HeroHome from './HeroHome'
import Architect from './Mua'
import Results from './Results'
import Region from './Region'
import MahikazInfo from './Info'

const Home = () => {
  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #about)
    if (window.location.hash === '#about') {
      // Wait for the component to render, then scroll to the about section
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className=''>
        <HeroHome/>
        <Architect/>
        <Results/>
        <Region/>
        <MahikazInfo/>
    </div>
  )
}

export default Home