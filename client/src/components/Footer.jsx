import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300">
      <div className="px-4 sm:px-8 lg:px-12 pt-10 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
            
            {/* Brand Column */}
            <div className="flex flex-col text-left lg:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-emerald-500/20 p-2 sm:p-2.5 rounded-xl">
                  <img src="/logo.jpeg" alt="" className='w-10 h-10 rounded-full' />
                </div>
                <span className="font-bold text-xl sm:text-2xl text-white tracking-tight">
                  Mourya Accadmy
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4 sm:mb-6 max-w-sm">
                Teaching, guidance, and best results since 2017.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/1H7BAtdnVq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 border border-gray-700 hover:bg-blue-500 hover:border-blue-500 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <Facebook className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>

          

           

                <a
                  href="https://www.instagram.com/mouryaacademy?igsh=NW15cWt6MzdsMzZy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 border border-gray-700 hover:bg-pink-500 hover:border-pink-500 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <Instagram className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="text-left lg:col-span-1">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="text-left lg:col-span-1">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                Get In Touch
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 8809193796</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="break-all">mouryadbg@gmail.com</span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Mourya Accadmy, Darbhanga, Bihar 846001</span>
                </li>
                <li className="flex gap-3">
+              <Link
                to="#contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
              </li>
              
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-800 flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
              <p className="text-xs text-gray-500">
                © {currentYear} Mourya Accadmy Darbhanga • Built for Success
              </p>
       
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
    </footer>
  );
};

export default Footer;