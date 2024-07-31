import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';  // Ensure to install react-icons library
const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h6 className="uppercase font-bold mb-2.5">Company</h6>
          <ul>
            <li><NavLink to="/about" className="hover:underline">About Us</NavLink></li>
            <li><NavLink to="/privacy" className="hover:underline">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="hover:underline">Terms of Service</NavLink></li>
          </ul>
        </div>
        <div>
          <h6 className="uppercase font-bold mb-2.5">Resources</h6>
          <ul>
            <li><NavLink to="/social" className="hover:underline">Blog</NavLink></li>
            <li><NavLink to="/support" className="hover:underline">Support</NavLink></li>
            <li><NavLink to="/faq" className="hover:underline">FAQ</NavLink></li>
          </ul>
        </div>
        <div>
          <h6 className="uppercase font-bold mb-2.5">Follow Us</h6>
          <div className="flex space-x-4 mt-2">
            <a href="https://facebook.com" className="hover:text-blue-500"><FaFacebook size="20"/></a>
            <a href="https://instagram.com" className="hover:text-pink-500"><FaInstagram size="20"/></a>
            <a href="https://linkedin.com" className="hover:text-blue-700"><FaLinkedin size="20"/></a>
          </div>
        </div>
        <div>
          <h6 className="uppercase font-bold mb-2.5">Contact</h6>
          <ul>
            <li>
              Gauripur,Assam
            </li>
            <li>
              India
            </li>
            <li>
              Pin-783331
            </li>
            
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Assam Employment. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
/**
 import React from 'react';


const Footer = () => {
  return (
    <div className={`bg-slate-50 dark:bg-slate-700 h-32 w-full`}>Footer</div>
  )
}

export default Footer;
 */