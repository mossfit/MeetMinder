import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMeetings } from '@/hooks/use-meetings';
import MeetingCard from '@/components/ui/meeting-card';

const PendingApprovals = () => {
  const { pendingMeetings, isLoading } = useMeetings();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : pendingMeetings.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No pending meetings to approve</div>
          ) : (
            pendingMeetings.map(meeting => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                type="pending" 
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
