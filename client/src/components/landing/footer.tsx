import React from 'react';
import { Link } from 'wouter';
import { CalendarCheck } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaDiscord, FaInstagram } from 'react-icons/fa';

const FooterLink = ({ href, children }) => (
  <li className="mb-2">
    <a 
      href={href} 
      className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
    >
      {children}
    </a>
  </li>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-950 text-white py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center mb-4">
              <CalendarCheck className="text-indigo-500 mr-2" size={28} />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">MeetMinder</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Intelligent meeting management powered by AI. Never miss another important meeting.
            </p>
            
            {/* Social icons */}
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-900 hover:bg-indigo-500 p-2 rounded-full transition-all duration-300">
                <FaTwitter className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="bg-gray-900 hover:bg-indigo-500 p-2 rounded-full transition-all duration-300">
                <FaLinkedin className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="bg-gray-900 hover:bg-indigo-500 p-2 rounded-full transition-all duration-300">
                <FaGithub className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="bg-gray-900 hover:bg-indigo-500 p-2 rounded-full transition-all duration-300">
                <FaDiscord className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="bg-gray-900 hover:bg-indigo-500 p-2 rounded-full transition-all duration-300">
                <FaInstagram className="h-5 w-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>
          
          {/* Product links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
            <ul>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#how-it-works">How It Works</FooterLink>
              <FooterLink href="#">Integrations</FooterLink>
              <FooterLink href="#">Roadmap</FooterLink>
            </ul>
          </div>
          
          {/* Resources links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API</FooterLink>
              <FooterLink href="#">Guides</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Support</FooterLink>
            </ul>
          </div>
          
          {/* Company links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul>
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Team</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to our newsletter for updates and new features.
            </p>
            <div className="flex">
              <Link href="/auth">
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} MeetMinder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400 transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
