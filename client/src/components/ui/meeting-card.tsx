import React from 'react';
import { Meeting } from '@shared/schema';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useMeetings } from '@/hooks/use-meetings';
import { MoreHorizontal, MapPin, Video, Mail, MessageSquare } from 'lucide-react';
import { FaSlack, FaTelegram, FaMicrosoft } from 'react-icons/fa';

interface MeetingCardProps {
  meeting: Meeting;
  type?: 'pending' | 'scheduled';
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, type = 'scheduled' }) => {
  const { updateMeetingStatus } = useMeetings();
  
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'EEE, MMM d');
  };
  
  const getLocationIcon = () => {
    if (meeting.meetingUrl) {
      return <Video className="mr-1 h-4 w-4" />;
    }
    return <MapPin className="mr-1 h-4 w-4" />;
  };
  
  const getSourceIcon = () => {
    switch (meeting.source) {
      case 'gmail':
      case 'outlook':
      case 'yahoo':
        return <Mail className="mr-1 h-4 w-4" />;
      case 'slack':
        return <FaSlack className="mr-1 h-4 w-4" />;
      case 'telegram':
        return <FaTelegram className="mr-1 h-4 w-4" />;
      case 'teams':
        return <FaMicrosoft className="mr-1 h-4 w-4" />;
      default:
        return <MessageSquare className="mr-1 h-4 w-4" />;
    }
  };
  
  const getSourceLabel = () => {
    switch (meeting.source) {
      case 'gmail':
        return 'From Gmail';
      case 'outlook':
        return 'From Outlook';
      case 'yahoo':
        return 'From Yahoo';
      case 'slack':
        return 'From Slack';
      case 'telegram':
        return 'From Telegram';
      case 'teams':
        return 'From Teams';
      default:
        return `From ${meeting.source}`;
    }
  };
  
  const handleAccept = async () => {
    await updateMeetingStatus(meeting.id, 'accepted');
  };
  
  const handleDecline = async () => {
    await updateMeetingStatus(meeting.id, 'declined');
  };
  
  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 text-center">
              {type === 'scheduled' ? (
                <>
                  <div className="text-sm font-semibold text-gray-800">{formatTime(meeting.startTime).split(' ')[0]}</div>
                  <div className="text-xs text-gray-500">{formatTime(meeting.startTime).split(' ')[1]}</div>
                </>
              ) : (
                <div className="text-primary text-lg">
                  <i className="fas fa-calendar-alt"></i>
                </div>
              )}
            </div>
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">{meeting.title}</p>
            <p className="text-sm text-gray-600">
              {type === 'pending' 
                ? `${formatDate(meeting.startTime)}, ${formatTime(meeting.startTime)} - ${formatTime(meeting.endTime)}`
                : meeting.description
              }
            </p>
            <div className="mt-1 flex items-center text-xs text-gray-500">
              {meeting.location || meeting.meetingUrl ? (
                <span className="flex items-center mr-3">
                  {getLocationIcon()}
                  {meeting.location || 'Virtual Meeting'}
                </span>
              ) : null}
              {meeting.source ? (
                <span className="flex items-center mr-3">
                  {getSourceIcon()}
                  {getSourceLabel()}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {type === 'pending' ? (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="bg-green-100 text-green-700 hover:bg-green-200"
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button 
              size="sm" 
              className="bg-red-100 text-red-700 hover:bg-red-200"
              onClick={handleDecline}
            >
              Decline
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="bg-primary text-white text-xs py-1 px-2 rounded-full">
              {format(new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime(), 'h\'h\' mm\'m\'')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
