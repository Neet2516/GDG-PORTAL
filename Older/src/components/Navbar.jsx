import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";

import CSI from '../assets/CSI.png'
// Removed NavbarProps interface and React.FC type
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleRegisterClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("register-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      document
        .getElementById("register-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-300 ${isScrolled ? 'bg-[#0B0F1A]/80 backdrop-blur-lg  py-3' : 'bg-black/80 py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold cursor-pointer text-xl" onClick={()=>{navigate("/");}}><img className="rounded-full " src={CSI} alt="" /></span>
          </div>
          <span className="font-poppins font-bold text-lg hidden sm:block tracking-tight">
            RENDER <span className="text-indigo-400">4.0</span>
          </span>
        </div>

        <button
          onClick={handleRegisterClick}

          className="bg-[#365de8] hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 cursor-pointer"
        >
          Register Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;