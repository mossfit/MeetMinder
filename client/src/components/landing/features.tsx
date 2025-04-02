import React, { useState, useEffect } from 'react';
import { FaGoogle, FaMicrosoft, FaSlack, FaTelegram, FaDiscord, FaVideo } from 'react-icons/fa';
import { BrainCircuit, Bell, CalendarCheck, Zap, Clock, Users, Globe, Mail } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color, delay, isVisible }) => {
  return (
    <div 
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-8 transform transition-all duration-700 ease-out ${
        isVisible ? `translate-y-0 opacity-100 delay-${delay}` : 'translate-y-12 opacity-0'
      }`}
    >
      <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-6 ${color}`}>
        <Icon size={26} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const IntegrationIcon = ({ icon: Icon, name, isVisible, delay }) => {
  return (
    <div 
      className={`flex flex-col items-center transform transition-all duration-700 ease-out ${
        isVisible ? `translate-y-0 opacity-100 delay-${delay}` : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="bg-gray-800 p-4 rounded-full mb-4 border border-gray-700">
        <Icon className="text-4xl text-white" />
      </div>
      <span className="font-medium text-gray-300">{name}</span>
    </div>
  );
};

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });
    
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      observer.observe(featuresSection);
    }
    
    return () => {
      if (featuresSection) {
        observer.unobserve(featuresSection);
      }
    };
  }, []);
  
  const integrations = [
    { Icon: FaGoogle, name: 'Gmail' },
    { Icon: FaMicrosoft, name: 'Outlook' },
    { Icon: FaSlack, name: 'Slack' },
    { Icon: FaTelegram, name: 'Telegram' },
    { Icon: FaDiscord, name: 'Discord' },
    { Icon: FaVideo, name: 'Zoom' },
  ];
  
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI Meeting Detection',
      description: 'Our AI automatically identifies and extracts meeting details from emails and chat messages, saving you time.',
      color: 'bg-gradient-to-br from-indigo-600 to-blue-600',
      delay: '100'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get context-aware reminders with just the right information at just the right time.',
      color: 'bg-gradient-to-br from-purple-600 to-indigo-600',
      delay: '200'
    },
    {
      icon: CalendarCheck,
      title: 'Unified Calendar',
      description: 'See all your meetings from multiple sources in one beautiful, easy-to-use calendar interface.',
      color: 'bg-gradient-to-br from-pink-600 to-rose-600',
      delay: '300'
    },
    {
      icon: Clock,
      title: 'Time Zone Management',
      description: 'Never get confused about meeting times again with automatic time zone detection and conversion.',
      color: 'bg-gradient-to-br from-sky-600 to-cyan-600',
      delay: '400'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share meeting schedules with your team and coordinate availabilities effortlessly.',
      color: 'bg-gradient-to-br from-emerald-600 to-green-600',
      delay: '500'
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Connect multiple email accounts to ensure you never miss a meeting invitation.',
      color: 'bg-gradient-to-br from-amber-600 to-orange-600',
      delay: '600'
    },
  ];
  
  return (
    <div id="features" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-20 transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <p className="text-indigo-400 font-semibold mb-3">INTEGRATIONS</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Connect All Your <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Communication</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            MeetMinder works with your favorite platforms to keep you organized across all your communication channels.
          </p>
        </div>
        
        {/* Integrations */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-24">
          {integrations.map((item, index) => (
            <IntegrationIcon 
              key={index} 
              icon={item.Icon} 
              name={item.name} 
              isVisible={isVisible}
              delay={(index + 1) * 100}
            />
          ))}
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={feature.delay}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
