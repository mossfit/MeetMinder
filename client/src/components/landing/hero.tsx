import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calendar, Sparkles, Zap, Clock } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white py-20 md:py-32">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/20 blur-3xl"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/10 blur-3xl"></div>
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/10 blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left Column */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Where <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">meetings</span> become 
              <span className="relative inline-block ml-3">
                effortless
                <svg className="absolute bottom-2 left-0 w-full" viewBox="0 0 138 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C33 1.5 105 1.5 137 5.5" stroke="#FF5757" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              AI-powered meeting assistant that extracts, organizes, and reminds you about meetings across all your communication channels.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/auth">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl h-14 px-8 text-lg transition-all shadow-lg hover:shadow-indigo-500/30">
                  Start for free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-gray-700 text-pink-400 hover:bg-gray-800 rounded-xl h-14 px-8 text-lg">
                <span className="mr-2">Watch demo</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M15 12L10 15V9L15 12Z" fill="currentColor"/>
                </svg>
              </Button>
            </div>
            
            {/* Stats and testimonials */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-800 pt-6">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">2,000+</p>
                <p className="text-gray-400">Active users</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">97%</p>
                <p className="text-gray-400">Less missed meetings</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">4.9/5</p>
                <p className="text-gray-400">Customer rating</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Dashboard Preview */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Calendar card with floating elements */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-5 border border-gray-800">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold text-white">Your meetings</h3>
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="text-center text-gray-400 text-sm">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </div>
                ))}
                
                {[...Array(31)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`text-center py-1 text-sm rounded ${
                      i === 14 ? 'bg-indigo-500 text-white' : 
                      i === 22 ? 'bg-purple-500/30 text-white' : 
                      i === 18 ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 
                      'text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-indigo-500">
                  <div className="flex justify-between">
                    <p className="font-medium text-white">Team Standup</p>
                    <p className="text-gray-400 text-sm">9:00 AM</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Daily sync with engineering team</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-purple-500">
                  <div className="flex justify-between">
                    <p className="font-medium text-white">Product Review</p>
                    <p className="text-gray-400 text-sm">11:30 AM</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Monthly product planning</p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-pink-500">
                  <div className="flex justify-between">
                    <p className="font-medium text-white">Client Presentation</p>
                    <p className="text-gray-400 text-sm">2:00 PM</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Quarterly business review</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-10 -right-10 bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-2xl shadow-lg animate-float transform rotate-6">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-white mr-2" />
                <p className="text-white text-sm font-medium">AI extracted a new meeting</p>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-2xl shadow-lg animate-float-slow transform -rotate-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-white mr-2" />
                <p className="text-white text-sm font-medium">Time to prepare for your call</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
