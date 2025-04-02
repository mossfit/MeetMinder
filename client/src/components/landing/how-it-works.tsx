import React, { useState, useEffect } from 'react';
import { Mail, Brain, Calendar, BellRing, Check, Clock, ChevronRight } from 'lucide-react';

const StepCard = ({ number, title, description, isVisible, delay }) => {
  return (
    <div className={`transform transition-all duration-1000 ease-out ${
      isVisible ? `translate-y-0 opacity-100 delay-${delay}` : 'translate-y-12 opacity-0'
    }`}>
      <div className="relative">
        {/* Step indicator */}
        <div className="absolute -left-4 -top-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {number}
        </div>
        
        {/* Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 pt-12 pl-16">
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-gray-400">{description}</p>
          
          {/* Connecting line for all but the last item */}
          {number < 4 && (
            <div className="absolute left-4 top-full h-12 w-0.5 bg-gradient-to-b from-purple-600 to-transparent"></div>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ author, role, company, quote, isVisible }) => {
  return (
    <div className={`transform transition-all duration-1000 ease-out ${
      isVisible ? 'translate-y-0 opacity-100 delay-700' : 'translate-y-12 opacity-0'
    }`}>
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        {/* Quote icon */}
        <div className="absolute -top-4 -left-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 8.5H5.5C4.4 8.5 3.5 9.4 3.5 10.5V14.5C3.5 15.6 4.4 16.5 5.5 16.5H7.5C8.6 16.5 9.5 15.6 9.5 14.5V8.5Z" fill="currentColor"/>
            <path d="M20.5 8.5H16.5C15.4 8.5 14.5 9.4 14.5 10.5V14.5C14.5 15.6 15.4 16.5 16.5 16.5H18.5C19.6 16.5 20.5 15.6 20.5 14.5V8.5Z" fill="currentColor"/>
          </svg>
        </div>
        
        <blockquote className="text-lg text-gray-300 italic mb-6">
          {quote}
        </blockquote>
        
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-white">{author}</p>
            <p className="text-gray-400">{role}, {company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });
    
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      observer.observe(howItWorksSection);
    }
    
    return () => {
      if (howItWorksSection) {
        observer.unobserve(howItWorksSection);
      }
    };
  }, []);
  
  const steps = [
    {
      number: 1,
      title: "Connect Your Accounts",
      description: "Link your email and messaging accounts through our secure OAuth integration. We support Gmail, Outlook, Slack, and more.",
      delay: "100"
    },
    {
      number: 2,
      title: "AI Scans Communications",
      description: "Our AI intelligently identifies meeting information from your emails and chat messages without you lifting a finger.",
      delay: "300"
    },
    {
      number: 3,
      title: "Review & Approve",
      description: "Receive notifications when meetings are detected. Approve or decline them with a single click.",
      delay: "500"
    },
    {
      number: 4,
      title: "Get Smart Reminders",
      description: "Get timely, context-aware reminders before meetings with all the information you need to be prepared.",
      delay: "700"
    }
  ];
  
  return (
    <div id="how-it-works" className="py-24 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <p className="text-indigo-400 font-semibold mb-3">HOW IT WORKS</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Simplify</span> Your Meeting Workflow
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Set up once and let our AI handle the rest. It's that simple.
          </p>
        </div>
        
        <div className="relative pl-8 space-y-12 mb-24">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-800"></div>
          
          {steps.map((step) => (
            <StepCard 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              isVisible={isVisible}
              delay={step.delay}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TestimonialCard 
            author="Sarah Chen"
            role="Product Manager"
            company="Acme Inc."
            quote="MeetMinder has completely transformed how our team manages meetings. No more digging through emails or missing important calls. It just works."
            isVisible={isVisible}
          />
          
          <TestimonialCard 
            author="Jason Rodriguez"
            role="CTO"
            company="Startup Labs"
            quote="The AI assistant is incredibly accurate. It finds meetings in emails that I would have missed, and the smart notifications ensure I'm always prepared."
            isVisible={isVisible}
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
