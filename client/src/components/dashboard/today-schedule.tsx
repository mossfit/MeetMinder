import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMeetings } from '@/hooks/use-meetings';
import MeetingCard from '@/components/ui/meeting-card';

const TodaySchedule = () => {
  const { todayMeetings, isLoading } = useMeetings();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : todayMeetings.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No meetings scheduled for today</div>
          ) : (
            todayMeetings.map(meeting => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                type="scheduled" 
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;
