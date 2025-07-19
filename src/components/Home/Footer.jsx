import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-[#2B2E4A] to-[#1E202E] text-white pt-16 pb-8 px-6 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-600 pb-10">

        {/* Logo and tagline */}
        <div className="flex flex-col items-start">
          <img src="/logo.png" alt="HPR Infra" className="h-16 mb-4" />
          <p className="text-gray-400 text-sm">
            HPR Infra — Building tomorrow’s legacy today with trust and innovation.
          </p>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Address</h4>
          <p className="text-gray-300 text-sm leading-6">
            101, Silicon Towers,<br />
            Image Garden Road,<br />
            Madhapur, Hyderabad - 500081
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <p className="text-gray-300 text-sm">📞 040-40036841</p>
          <p className="text-gray-300 text-sm">📧 <a href="mailto:hprinfrallp@gmail.com" className="hover:text-white underline">hprinfrallp@gmail.com</a></p>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-[#56CCF2] transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#E1306C] transition"><FaInstagram /></a>
            <a href="#" className="hover:text-[#0e76a8] transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 mt-6">
        <p>© {new Date().getFullYear()} HPR Infra LLP. All rights reserved.</p>
        <a href="#" className="hover:text-white mt-2 md:mt-0">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
