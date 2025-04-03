import React, { useState } from "react";
import LOGO from "../images/TripLogo.png";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaInstagram, FaInstagramSquare, FaTimes, FaWhatsapp } from "react-icons/fa"; // For the hamburger icon
import { RiMenu3Line } from "react-icons/ri";
import { FaSquareInstagram } from "react-icons/fa6";
import { IoIosMail, IoLogoWhatsapp } from "react-icons/io";
import { PiInstagramLogoFill } from "react-icons/pi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const location = useLocation(); // Get the current route

  // Function to determine active link class
  const getNavLinkClass = (path) =>
    location.pathname === path
      ? "text-white font-semibold text-[18px] bg-topHeader p-2 rounded-md" // Active link styling
      : "text-white hover:text-white hover:bg-topHeader hover:p-2 hover:rounded-md text-[18px]"; // Default link styling
  return (
    <>
    <div className="bg-topHeader h-[33px] text-white mb-1 font-inria pr-5 flex justify-end gap-6 items-center ">
      <div className="flex items-center gap-1 ">
        <PiInstagramLogoFill className="h-[25px]"/>
        <p>tripotrail_find_me</p>
      </div>
      <div className="flex items-center gap-1 ">
        <IoLogoWhatsapp className="h-[25px]" />
        <p>+1-404-987-999</p>
      </div>
      <div className="flex items-center gap-1">
        <IoIosMail className="h-[25px]"/>
        <p>support@tripotrail.com</p>
      </div>

    </div>
    <header className="bg-headerBG  font-dmSans h-[42px] ml-0" >
      <div className=" flex justify-between items-start text-headerText">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="">
            <img src={LOGO} alt="Logo" className="h-[72px]" />
          </Link>
        </div>

        {/* Hamburger Menu Icon (visible only on mobile) */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-white pr-4 pt-2">
            {isMobileMenuOpen ? (
              <FaTimes
                size={18}
                className="transition-transform duration-300 ease-in-out transform rotate-180"
              />
            ) : (
              <RiMenu3Line
                size={24}
                className="transition-transform duration-300 ease-in-out transform"
              />
            )}
          </button>
        </div>

        {/* Desktop Navigation (Horizontal) */}
        <nav className="lg:flex lg:space-x-4 hidden font-inria w-[88%] text-[16px] ml-8 items-start pt-2">
          <div >
            <ul className="lg:flex lg:space-x-4 space-y-4 lg:space-y-0  ">
              <li>
                <Link to="/" className={getNavLinkClass("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/plan"
                  className={getNavLinkClass("/plan")}
                >
                  Plan your Trip
                </Link>
              </li>
              <li>
                <Link
                  to="/myTrip"
                  className={getNavLinkClass("/myTrip")}
                >
                  My Trips
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className={getNavLinkClass("/destinations")}
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/about" className={getNavLinkClass("/about")}>
                About
                </Link>
              </li>
              <li>
                <Link to="/blog" className={getNavLinkClass("/blog")}>
                Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className={getNavLinkClass("/contact")}>
                Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Buttons (Register/Login) */}
         
        </nav>
      </div>

      {/* Mobile Sidebar Menu (Vertical Navigation) */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`lg:hidden fixed top-9 right-0 w-64 bg-darkBG h-full z-50 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* <div className="flex justify-end items-right p-4 border-b">
          <button onClick={toggleMobileMenu} className="text-gray-600">
            <FaTimes size={15} />
          </button>
        </div> commented by Ashwani */}

        {/* Menu Items */}
        <ul className="flex flex-col space-y-4 p-4">
          <li>
            <Link to="/" className="text-subTitle hover:text-white hover:font-semibold" >
            Home
            </Link>
          </li>
          <li>
            <Link
              to="/plan"
              className="text-subTitle hover:text-white hover:font-semibold"
            >
              Plan your Trip
            </Link>
          </li>
          <li>
            <Link
              to="/myTrip"
              className="text-subTitle hover:text-white hover:font-semibold"
            >
              My Trips
            </Link>
          </li>

          <li>
            <Link
              to="/destinations"
              className="text-subTitle hover:text-white hover:font-semibold"
            >
              Destinations
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-subTitle hover:text-white hover:font-semibold"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="text-subTitle hover:text-white hover:font-semibold"
            >
              Blog
            </Link>
          </li>

          <li>
            <Link to="/contact" className="text-topHeader hover:font-semibold ">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Buttons (Register/Login) */}
        <div className="flex flex-col space-y-2 p-4 border-t">
          <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded">
            Register
          </button>
          <button className="bg-topHeader text-white px-4 py-1 rounded">
            Login
          </button>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;

