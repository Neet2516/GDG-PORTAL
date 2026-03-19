import React from 'react';
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-poppins font-bold text-lg mb-2">
              CSI <span className="text-indigo-400"> AKGEC </span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Empowering students through high-impact technical workshops and community building.
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 flex items-center justify-center text-sm mb-4 gap-1">
              Contact us at: <FaInstagram></FaInstagram> <a href="https://www.instagram.com/csi_akgec/" className="text-indigo-400 hover:underline">CSI AKGEC</a>
            </p>
            <div className="flex flex-wrap items-center gap-3 py-3 text-sm justify-center md:justify-end mt-4">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-indigo-400 transition">
                Privacy Policy
              </Link>

              <Link to="/refund-policy" className="text-gray-400 hover:text-indigo-400 transition">
                Refund Policy
              </Link>

              <Link to="/terms" className="text-gray-400 hover:text-indigo-400 transition">
                Terms & Conditions
              </Link>

              <Link to="/contact-us" className="text-gray-400 hover:text-indigo-400 transition">
                Contact Us
              </Link>
            </div>

            <p className="text-gray-600 text-xs">
              © 2025 AKGEC Tech Society. Made with 💙 by CSI MEMBERS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;