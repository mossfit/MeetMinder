import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  CalendarCheck,
  LayoutDashboard, 
  Calendar, 
  Inbox, 
  Bell, 
  Settings,
  LogOut
} from 'lucide-react';
import { FaGoogle, FaMicrosoft, FaSlack } from 'react-icons/fa';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

const SidebarLink = ({ 
  href, 
  icon: Icon, 
  children 
}: { 
  href: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
}) => {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href}>
      <div className={`flex items-center px-2 py-2 ${isActive ? 'bg-indigo-50 text-primary' : 'text-gray-700 hover:bg-indigo-50 hover:text-primary'} rounded group cursor-pointer`}>
        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}`} />
        <span className="font-medium">{children}</span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Default values for demo mode
  let user = { id: 1, fullName: 'Demo User', username: 'demo@example.com', password: 'hashed', plan: 'free' };
  let logoutMutation = { 
    mutate: () => console.log('Demo logout'), 
    isPending: false 
  };
  
  // Try to get auth context but handle gracefully if it fails
  try {
    const auth = useAuth();
    if (auth.user) {
      user = {
        id: auth.user.id,
        username: auth.user.username,
        fullName: auth.user.fullName || 'Demo User',
        password: auth.user.password,
        plan: auth.user.plan || 'free'
      };
    }
    logoutMutation = auth.logoutMutation;
    console.log("Auth loaded successfully in Sidebar");
  } catch (error) {
    console.log("Auth not available in Sidebar, using demo mode");
  }
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        id="sidebar-toggle" 
        className="md:hidden fixed top-4 left-4 z-30 text-gray-700 hover:text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md z-20 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b flex items-center">
            <CalendarCheck className="text-primary text-2xl mr-2" />
            <span className="font-bold text-xl">MeetMinder</span>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <SidebarLink href="/dashboard" icon={LayoutDashboard}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/dashboard/calendar" icon={Calendar}>
              Calendar
            </SidebarLink>
            <SidebarLink href="/dashboard/integrations" icon={Inbox}>
              Integrations
            </SidebarLink>
            <SidebarLink href="/dashboard/notifications" icon={Bell}>
              Notifications
            </SidebarLink>
            <SidebarLink href="/dashboard/settings" icon={Settings}>
              Settings
            </SidebarLink>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Connected Services
              </h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center px-2 py-2 text-gray-700 rounded">
                  <FaGoogle className="mr-3 text-gray-500" />
                  <span className="font-medium">Gmail</span>
                </div>
                <div className="flex items-center px-2 py-2 text-gray-700 rounded">
                  <FaMicrosoft className="mr-3 text-gray-500" />
                  <span className="font-medium">Outlook</span>
                </div>
                <div className="flex items-center px-2 py-2 text-gray-700 rounded">
                  <FaSlack className="mr-3 text-gray-500" />
                  <span className="font-medium">Slack</span>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="px-4 py-4 border-t">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.fullName ? user.fullName.charAt(0) : user?.username.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500">{user?.plan === 'free' ? 'Free Plan' : `${user?.plan} Plan`}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="mt-4 w-full flex items-center justify-start px-2 py-2 text-gray-700 hover:bg-indigo-50 hover:text-primary rounded"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              <span className="font-medium">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
