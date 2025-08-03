import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoImages, heroImages } from '../../utils/imageImports';
import { FaBars } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const logoImage = logoImages.secondary;

// Get all hero images dynamically
const getAllHeroImages = () => {
  const heroImageArray = [];
  
  // Add only proper hero images (skip the background patterns)
  if (heroImages.homeMain) heroImageArray.push(heroImages.homeMain);
  if (heroImages.homeAlt) heroImageArray.push(heroImages.homeAlt);
  if (heroImages.aboutMain) heroImageArray.push(heroImages.aboutMain);
  
  return heroImageArray;
};

const HeroHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImageArray, setHeroImageArray] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize hero images
  useEffect(() => {
    const images = getAllHeroImages();
    setHeroImageArray(images);
    console.log(`Found ${images.length} hero images:`, images);
  }, []);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.offsetTop;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const scrollToAbout = () => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => smoothScrollTo('about'), 300);
    } else {
      smoothScrollTo('about');
    }
  };

  const scrollToServices = () => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => smoothScrollTo('services'), 300);
    } else {
      smoothScrollTo('services');
    }
  };

  const scrollToContact = () => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      setTimeout(() => smoothScrollTo('contact'), 300);
    } else {
      smoothScrollTo('contact');
    }
  };

  return (
          <section
        className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden transition-all duration-1500 ease-in-out"
        style={{ 
          backgroundImage: heroImageArray.length > 0 
            ? `url('${heroImageArray[currentImageIndex]}')` 
            : 'linear-gradient(to bottom right, #581c87, #be185d, #be123c)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Integrated Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="flex justify-between items-center w-[80%] max-w-[1200px] py-4 mx-auto">
          {/* Desktop Navigation Left */}
          <ul className="md:flex items-center hidden lg:gap-x-14 md:gap-x-8 gap-4 md:text-[17px] text-[15px] leading-5">
            <li className="nav-item">
              <button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}
                className="text-white hover:text-[#a76f52] transition-all duration-300"
              >
                HOME
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={scrollToAbout}
                className="text-white hover:text-[#a76f52] hover:font-extrabold transition-all duration-300"
              >
                ABOUT
              </button>
            </li>
          </ul>

          {/* Logo */}
          <div className="lg:ml-[9rem]">
            <Link to="/" className="block">
              <img
                src={logoImage}
                alt="Logo"
                className="logo-hover lg:w-[80px] lg:h-[80px] md:w-[70px] md:h-[70px] w-[60px] h-[60px] object-cover transition-all duration-300 hover:scale-110 hover:rotate-6 hover:drop-shadow-xl"
                width={80}
                height={80}
                loading="lazy"
              />
            </Link>
          </div>

          {/* Desktop Navigation Right */}
          <ul className="md:flex items-center hidden lg:gap-x-14 md:gap-x-8 gap-4 md:text-[17px] text-[15px] leading-5">
            <li className="nav-item">
              <button
                onClick={scrollToServices}
                className="text-white hover:text-[#a76f52] hover:font-extrabold transition-all duration-300"
              >
                SERVICES
              </button>
            </li>
            <li className="nav-item">
              <button
                onClick={scrollToContact}
                className="text-white hover:text-[#a76f52] hover:font-extrabold transition-all duration-300"
              >
                CONTACTS
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex justify-center items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg transition-all duration-300 text-white hover:bg-white/20 hover:scale-110 hover:rotate-3 hover:drop-shadow-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <IoIosCloseCircle className="w-8 h-8" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? "max-h-96 opacity-100" 
              : "max-h-0 opacity-0"
          } bg-black/30 backdrop-blur-lg shadow-lg border-t border-white/10`}
        >
          <nav className="py-4 px-6">
            <ul className="space-y-4">
              <li className="mobile-menu-item">
                <button
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                    setIsMenuOpen(false);
                  }}
                  className="block text-white text-lg font-medium w-full text-left"
                >
                  HOME
                </button>
              </li>
              <li className="mobile-menu-item">
                <button
                  onClick={scrollToAbout}
                  className="block text-white text-lg font-medium w-full text-left"
                >
                  ABOUT
                </button>
              </li>
              <li className="mobile-menu-item">
                <button
                  onClick={scrollToServices}
                  className="block text-white text-lg font-medium w-full text-left"
                >
                  SERVICES
                </button>
              </li>
              <li className="mobile-menu-item">
                <button
                  onClick={scrollToContact}
                  className="block text-white text-lg font-medium w-full text-left"
                >
                  CONTACTS
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </nav>

      {/* Carousel Navigation */}
      {heroImageArray.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
          {heroImageArray.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 hover:scale-125 ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-transparent hover:bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Carousel Controls */}
      {heroImageArray.length > 1 && (
        <div className="absolute top-1/2 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
          <button
            onClick={() => setCurrentImageIndex((prev) => 
              prev === 0 ? heroImageArray.length - 1 : prev - 1
            )}
            className="pointer-events-auto bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentImageIndex((prev) => 
              (prev + 1) % heroImageArray.length
            )}
            className="pointer-events-auto bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}





      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center px-4">
        {/* Tagline */}
        <div className="inline-block bg-black/40 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20 mb-8 mt-24">
          <p className="text-white text-sm font-medium tracking-wide uppercase">
            Where Beauty Finds Its True Expression
          </p>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
          GEEETA
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-2">
            MAKEOVERS
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-light mt-6">
          Artistry That Reflects Your True Beauty. From bridal elegance to personal glam, 
          Geeta Makeovers brings out the best in you with a touch of artistry and years of expertise.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <button 
            className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                const elementPosition = contactSection.offsetTop;
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth'
                });
              }
            }}
          >
            Book Appointment
          </button>
          <button 
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            onClick={() => {
              const servicesSection = document.getElementById('services');
              if (servicesSection) {
                const elementPosition = servicesSection.offsetTop;
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth'
                });
              }
            }}
          >
            Explore Services
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center space-x-8 pt-12 text-white/70">
          <div className="text-center">
            <p className="text-2xl font-bold">15+</p>
            <p className="text-sm">Years Experience</p>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <p className="text-2xl font-bold">1000+</p>
            <p className="text-sm">Happy Clients</p>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="text-center">
            <p className="text-2xl font-bold">50+</p>
            <p className="text-sm">Services</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
