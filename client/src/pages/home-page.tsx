import React from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import DashboardStats from '@/components/dashboard/stats';
import CalendarView from '@/components/ui/calendar-view';
import PendingApprovals from '@/components/dashboard/pending-approvals';
import TodaySchedule from '@/components/dashboard/today-schedule';
import SourceSelector from '@/components/ui/source-selector';
import AiSettingsCard from '@/components/ui/ai-settings';
import AiChatAssistant from '@/components/ui/ai-chat-assistant';
import { MeetingsProvider } from '@/hooks/use-meetings';

const HomePage = () => {
  return (
    <MeetingsProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        
        {/* Main Content */}
        <div className="md:pl-64">
          {/* Top bar */}
          <div className="bg-white shadow-sm z-10 relative">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
              <h1 className="text-xl font-semibold text-gray-800 md:ml-0 ml-10">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                </div>
                <div className="relative">
                  <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="px-4 md:px-6 py-6">
            <DashboardStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CalendarView meetings={[]} /* This is now provided by MeetingsProvider */ />
                <PendingApprovals />
              </div>
              
              <div className="space-y-6">
                <TodaySchedule />
                <SourceSelector />
                <AiSettingsCard />
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Chat Assistant */}
        <AiChatAssistant />
      </div>
    </MeetingsProvider>
  );
};

export default HomePage;
