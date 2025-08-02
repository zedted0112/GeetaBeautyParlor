import { useEffect, useState } from "react";
import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { logoImages } from '../utils/imageImports';

const logoImage = logoImages.secondary;
const menuImage = logoImages.menu;import { FaBars } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const Header = ({ transparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAbout = () => {
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
          window.location.hash = '#about';
        }
      }, 300);
    } else {
      // If we're already on homepage, just scroll and update URL
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
        window.location.hash = '#about';
      }
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full bg-transparent   ${transparent && "bg-[#1E1E1E82]"}`}
    >
      <div className="flex justify-between items-center w-[80%] max-w-[1200px]  py-8 mx-auto">
        <ul className="md:flex items-center hidden lg:gap-x-14 md:gap-x-8  gap-4 md:text-[17px] text-[15px] text-white leading-5">
          <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
            <NavLink
              to="/"
              className={({ isActive }) => `${isActive && "font-extrabold"}`}
            >
              HOME
            </NavLink>
          </li>
          <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
            <button
              onClick={scrollToAbout}
              className="text-white hover:font-extrabold transition-all duration-300"
            >
              ABOUT
            </button>
          </li>
        </ul>
        <div className="lg:ml-[9rem]">
          <Link to="/">
            <img
              src={logoImage}
              alt="Logo"
              className="lg:w-[80px] lg:h-[80px] md:w-[70px] md:h-[70px] w-[60px] h-[60px]  object-cover"
              width={80}
              height={80}
              loading="lazy"
            />
          </Link>
        </div>

        <ul className="md:flex  items-center hidden lg:gap-x-14 md:gap-x-8  gap-4 md:text-[17px] text-[15px] text-white leading-5">
          <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
            <NavLink
              to="/properties"
              className={({ isActive }) => `${isActive && "font-extrabold"}`}
            >
              SERVICES
            </NavLink>
          </li>
          <li className="transition-all duration-700 ease-in-out   hover:scale-95 ">
              <NavLink
                to="/blog"
                className={({ isActive }) => `${isActive && "font-extrabold"}`}
              >
                BLOG
              </NavLink>
            </li>
          <div>
            <NavLink to="/contacts">
              <img src={menuImage} width={60} height={60} alt="" />
            </NavLink>
          </div>
        </ul>

        <div className="md:hidden flex justify-center items-center">
          <div
            onClick={toggleMenu}
            className="text-[#FFFFFF] cursor-pointer focus:outline-none"
          >
            {isMenuOpen ? (
              <IoIosCloseCircle onClick={toggleMenu} className="w-10 h-10 " />
            ) : (
              <FaBars onClick={toggleMenu} className="w-6 h-6" />
            )}
          </div>
        </div>

        <div
          className={`space-y-4 w-[85%]  rounded-2xl max-w-[1200px] mx-auto px-4 md:hidden mt-16 py-32 bg-[#937D64] opacity-95 ${
            isMenuOpen ? "block fixed top-14 right-0 left-0" : "hidden"
          }`}
        >
          <ul className=" flex flex-col items-center  lg:gap-x-14 md:gap-x-8  gap-8 md:text-[17px] text-[15px] font-[700] text-white leading-5">
            <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
              <NavLink
                to="/"
                className={({ isActive }) => `${isActive && "text-underline"}`}
              >
                HOME
              </NavLink>
            </li>
            <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
              <button
                onClick={scrollToAbout}
                className="text-white hover:text-underline transition-all duration-300"
              >
                ABOUT
              </button>
            </li>
            <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
              <NavLink
                to="/properties"
                className={({ isActive }) => `${isActive && "text-underline"}`}
              >
                SERVICES
              </NavLink>
            </li>
            <li className="transition-all duration-700 ease-in-out  hover:scale-95 ">
              <NavLink
                to="/blog"
                className={({ isActive }) => `${isActive && "text-underline"}`}
              >
                BLOG
              </NavLink>
            </li>

            <NavLink to="/contacts">
              <img src={menuImage} width={60} height={60} alt="" />
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
