import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const API = import.meta.env.VITE_API_BASE_URL + '/home/footer';

const Footer = () => {
  const [footer, setFooter] = useState(null);

  const fetchFooter = async () => {
    try {
      const res = await axios.get(API);
      if (res.data && res.data.data) {
        setFooter(res.data.data);
      }
    } catch (err) {
      console.error('Footer fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchFooter();
    const interval = setInterval(fetchFooter, 10000); // Live updates
    return () => clearInterval(interval);
  }, []);

  if (!footer) {
    return <footer className="bg-black text-white text-center py-8">Loading footer...</footer>;
  }

  return (
    <footer className="bg-gradient-to-tr from-[#2B2E4A] to-[#1E202E] text-white pt-16 pb-8 px-6 md:px-20 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-600 pb-10">
        {/* Logo and tagline */}
        <div className="flex flex-col items-start">
          {footer.logo && (
            <img
              src={`data:image/png;base64,${footer.logo}`}
              alt="HPR Infra Logo"
className="h-32 w-auto mb-4"
            />
          )}
          <p className="text-white text-sm">{footer.tagline}</p>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Address</h4>
          <p className="text-white text-sm leading-6 whitespace-pre-line">
            {footer.address}
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Contact</h4>
          <p className="text-white text-sm flex items-center gap-2">
            <FaPhoneAlt /> {footer.phone}
          </p>
          <p className="text-white text-sm flex items-center gap-2 mt-1">
            <FaEnvelope />
            <a href={`mailto:${footer.email}`} className="hover:text-[#56CCF2] underline">
              {footer.email}
            </a>
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-white">Connect With Us</h4>
          <div className="flex space-x-4 text-xl text-white">
            <a
              href={footer.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#56CCF2] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href={footer.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E1306C] transition"
            >
              <FaInstagram />
            </a>
            <a
              href={footer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0e76a8] transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white mt-6">
        <p>© {new Date().getFullYear()} HPR Infra LLP. All rights reserved.</p>
        <a href="#" className="hover:text-[#56CCF2] mt-2 md:mt-0">Privacy Policy</a>
      </div>
    </footer>
  );
};

export default Footer;
