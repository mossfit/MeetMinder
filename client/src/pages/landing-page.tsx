import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import Pricing from '@/components/landing/pricing';
import Footer from '@/components/landing/footer';
import { CalendarCheck, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const LandingPage = () => {
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // We'll try to get the auth context, but if it's not available, we'll just show the landing page
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // If useAuth fails, we'll just show the landing page
    console.log("Auth not available yet, showing landing page");
  }
  
  // Handle scroll effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];
  
  return (
    <div id="landing-page" className="min-h-screen">
      {/* Header/Navbar */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md py-2' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center">
                <CalendarCheck className="text-white text-2xl mr-2" />
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">MeetMinder</span>
              </div>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map(link => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link href="/auth">
                <Button variant="outline" className="border-gray-700 text-indigo-400 hover:bg-gray-800">
                  Log in
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                  Sign up
                </Button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                className="text-white p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu panel */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 flex flex-col space-y-4">
                  <Link href="/auth">
                    <Button variant="outline" className="w-full border-gray-700 text-indigo-400 hover:bg-gray-800">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                      Sign up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;
