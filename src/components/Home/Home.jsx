import React, { useEffect } from 'react'
import HeroHome from './HeroHome'
import Architect from './Mua'
import Results from './Results'
import Region from './Region'
import MahikazInfo from './Info'
import Contact from './Contact'

const Home = () => {
  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #about, #services, #contact)
    if (window.location.hash === '#about') {
      // Wait for the component to render, then scroll to the about section
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (window.location.hash === '#services') {
      // Wait for the component to render, then scroll to the services section
      setTimeout(() => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (window.location.hash === '#contact') {
      // Wait for the component to render, then scroll to the contact section
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
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
        <Contact/>
    </div>
  )
}

export default Home