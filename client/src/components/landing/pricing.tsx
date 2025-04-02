import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Users, Globe } from 'lucide-react';
import { Link } from 'wouter';

const PricingCard = ({ 
  title, 
  description,
  icon: Icon,
  price, 
  features, 
  popular, 
  buttonText, 
  gradient,
  delay,
  isVisible
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  price: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  gradient: string;
  delay: string;
  isVisible: boolean;
}) => {
  return (
    <div 
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col transform transition-all duration-1000 ease-out ${
        isVisible ? `translate-y-0 opacity-100 delay-${delay}` : 'translate-y-12 opacity-0'
      } relative ${popular ? 'md:scale-105 md:-translate-y-2 z-10' : ''}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-1 px-6 text-sm font-medium rounded-full shadow-lg">
          MOST POPULAR
        </div>
      )}
      
      <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-4 ${gradient}`}>
        <Icon size={24} className="text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="flex items-end mb-6">
        <div className="text-4xl font-bold text-white">{price}</div>
        {price !== 'Free' && <span className="text-gray-400 ml-2 pb-1">/month</span>}
      </div>
      
      <ul className="mb-8 flex-1 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="bg-indigo-500/20 rounded-full p-0.5 mr-3 mt-0.5">
              <Check className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link href="/auth" className="mt-auto w-full">
        <Button 
          className={`w-full h-12 text-white rounded-xl ${
            popular 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg' 
              : 'bg-transparent border border-gray-700 hover:bg-gray-800'
          }`}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });
    
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      observer.observe(pricingSection);
    }
    
    return () => {
      if (pricingSection) {
        observer.unobserve(pricingSection);
      }
    };
  }, []);
  
  const plans = [
    {
      title: "Free",
      description: "Perfect for individuals getting started with meeting management",
      icon: Globe,
      price: "Free",
      features: [
        "Connect 2 email accounts",
        "Basic meeting detection",
        "Email notifications",
        "7-day meeting history"
      ],
      popular: false,
      buttonText: "Get Started",
      gradient: "bg-gradient-to-br from-blue-600 to-indigo-600",
      delay: "100"
    },
    {
      title: "Pro",
      description: "For professionals who need advanced features and integrations",
      icon: Sparkles,
      price: "$9",
      features: [
        "Connect unlimited email accounts",
        "Advanced AI meeting detection",
        "Connect 2 messaging platforms",
        "Push & SMS notifications",
        "Custom notification timing",
        "Unlimited meeting history"
      ],
      popular: true,
      buttonText: "Try 14 Days Free",
      gradient: "bg-gradient-to-br from-indigo-600 to-purple-600",
      delay: "300"
    },
    {
      title: "Team",
      description: "For teams that need to coordinate and collaborate",
      icon: Users,
      price: "$19",
      features: [
        "Everything in Pro",
        "Team calendar sharing",
        "Connect unlimited messaging platforms",
        "Meeting analytics dashboard",
        "Team availability coordination",
        "Collaborative meeting notes",
        "Admin controls and user management"
      ],
      popular: false,
      buttonText: "Contact Sales",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-600",
      delay: "500"
    }
  ];
  
  return (
    <div id="pricing" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-20 transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <p className="text-indigo-400 font-semibold mb-3">PRICING</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plans that grow with your needs, starting with a generous free tier.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index}
              title={plan.title}
              description={plan.description}
              icon={plan.icon}
              price={plan.price}
              features={plan.features}
              popular={plan.popular}
              buttonText={plan.buttonText}
              gradient={plan.gradient}
              delay={plan.delay}
              isVisible={isVisible}
            />
          ))}
        </div>
        
        <div className={`mt-16 text-center transform transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100 delay-700' : 'translate-y-12 opacity-0'
        }`}>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Need a custom plan for your enterprise? <Link href="/auth"><span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Contact our sales team</span></Link> for a tailored solution to fit your organization's specific needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
