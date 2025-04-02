import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Inbox, Clock, Hourglass } from 'lucide-react';
import { useMeetings } from '@/hooks/use-meetings';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconBg 
}: { 
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
          </div>
          <div className={`h-12 w-12 ${iconBg} rounded-full flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${iconBg.split('-')[0]}-500`} />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const { meetings, pendingMeetings } = useMeetings();
  
  // Calculate upcoming meetings (next 48 hours)
  const now = new Date();
  const in48Hours = new Date(now);
  in48Hours.setHours(in48Hours.getHours() + 48);
  
  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    return meetingDate >= now && meetingDate <= in48Hours && meeting.status === 'accepted';
  });
  
  // Calculate today's meetings
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  
  const todayMeetings = upcomingMeetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    return meetingDate <= todayEnd;
  });
  
  // Calculate meeting sources (unique)
  const sources = new Set(meetings.map(meeting => meeting.source).filter(Boolean));
  
  // Calculate total meeting hours this week
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  
  const weekMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    return meetingDate >= startOfWeek && 
           meetingDate < endOfWeek && 
           meeting.status === 'accepted';
  });
  
  const meetingHours = weekMeetings.reduce((total, meeting) => {
    const start = new Date(meeting.startTime);
    const end = new Date(meeting.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return total + hours;
  }, 0);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard 
        title="Upcoming Meetings"
        value={upcomingMeetings.length}
        subtitle={`${todayMeetings.length} today, ${upcomingMeetings.length - todayMeetings.length} tomorrow`}
        icon={Calendar}
        iconBg="bg-indigo-50"
      />
      
      <StatsCard 
        title="Meeting Sources"
        value={sources.size}
        subtitle={Array.from(sources).join(', ')}
        icon={Inbox}
        iconBg="bg-blue-50"
      />
      
      <StatsCard 
        title="Pending Approvals"
        value={pendingMeetings.length}
        subtitle="Requires your attention"
        icon={Clock}
        iconBg="bg-yellow-50"
      />
      
      <StatsCard 
        title="Meeting Hours"
        value={meetingHours.toFixed(1)}
        subtitle="This week"
        icon={Hourglass}
        iconBg="bg-green-50"
      />
    </div>
  );
};

export default DashboardStats;
