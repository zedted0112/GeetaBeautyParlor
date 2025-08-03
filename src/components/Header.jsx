import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { logoImages } from '../utils/imageImports';

const logoImage = logoImages.secondary;
import { FaBars } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const Header = ({ transparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Smooth scroll function
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;
      
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

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Close mobile menu on scroll
      if (scrollTop > 100) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent && !isScrolled 
          ? 'bg-transparent' 
          : 'bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10'
      }`}
    >
      <div className="flex justify-between items-center w-[80%] max-w-[1200px] py-4 mx-auto">
        {/* Desktop Navigation Left */}
        <ul className="md:flex items-center hidden lg:gap-x-14 md:gap-x-8 gap-4 md:text-[17px] text-[15px] leading-5">
          <li className="transition-all duration-300 ease-in-out hover:scale-95">
            <NavLink
              to="/"
                             className={({ isActive }) => 
                 `${isActive ? "font-extrabold" : ""} ${
                   transparent && !isScrolled ? "text-white" : "text-white"
                 } hover:text-[#a76f52] transition-colors duration-300`
               }
            >
              HOME
            </NavLink>
          </li>
          <li className="transition-all duration-300 ease-in-out hover:scale-95">
            <button
              onClick={scrollToAbout}
              className={`${
                transparent && !isScrolled ? "text-white" : "text-white"
              } hover:text-[#a76f52] hover:font-extrabold transition-all duration-300`}
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
              className="lg:w-[80px] lg:h-[80px] md:w-[70px] md:h-[70px] w-[60px] h-[60px] object-cover transition-transform duration-300 hover:scale-105"
              width={80}
              height={80}
              loading="lazy"
            />
          </Link>
        </div>

        {/* Desktop Navigation Right */}
        <ul className="md:flex items-center hidden lg:gap-x-14 md:gap-x-8 gap-4 md:text-[17px] text-[15px] leading-5">
          <li className="transition-all duration-300 ease-in-out hover:scale-95">
            <button
              onClick={scrollToServices}
              className={`${
                transparent && !isScrolled ? "text-white" : "text-white"
              } hover:text-[#a76f52] hover:font-extrabold transition-all duration-300`}
            >
              SERVICES
            </button>
          </li>
          <li className="transition-all duration-300 ease-in-out hover:scale-95">
            <button
              onClick={scrollToContact}
              className={`${
                transparent && !isScrolled ? "text-white" : "text-white"
              } hover:text-[#a76f52] hover:font-extrabold transition-all duration-300`}
            >
              CONTACTS
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-center items-center">
          <button
            onClick={toggleMenu}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              transparent && !isScrolled 
                ? "text-white hover:bg-white/20" 
                : "text-white hover:bg-white/20"
            }`}
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
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="bg-black/20 backdrop-blur-md shadow-lg border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#a76f52] text-white'
                    : 'text-white hover:bg-white/20'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </NavLink>
            
            <button
              onClick={scrollToAbout}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
            >
              ABOUT
            </button>
            
            <button
              onClick={scrollToServices}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
            >
              SERVICES
            </button>
            
            <button
              onClick={scrollToContact}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
            >
              CONTACTS
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
