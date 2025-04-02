import React, { useState } from 'react';
import { Meeting } from '@shared/schema';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useMeetings } from '@/hooks/use-meetings';

// For flexibility, we'll keep props but also use the meetings context
interface CalendarViewProps {
  meetings?: Meeting[]; // Now optional, will use context if not provided
}

const TimeSlot = ({ hour }: { hour: number }) => {
  const formattedHour = hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  return (
    <div className="border-r p-1 text-xs text-gray-500 text-center">{formattedHour}</div>
  );
};

const CalendarView: React.FC<CalendarViewProps> = ({ meetings: propMeetings }) => {
  // Get meetings from context if not provided as props
  const { meetings: contextMeetings } = useMeetings();
  const meetings = propMeetings?.length ? propMeetings : contextMeetings;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  
  // Calculate start of week
  const startDay = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Create week days
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(startDay, index);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameDay(date, new Date())
    };
  });
  
  // Create time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }).map((_, index) => index + 9);

  // Get meetings for the current week
  const weekMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    const weekEnd = addDays(startDay, 7);
    return meetingDate >= startDay && meetingDate < weekEnd;
  });
  
  // Previous and next week navigation
  const previousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const nextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get the color for a meeting based on source
  const getMeetingColor = (source: string | null | undefined) => {
    if (source === null) return 'bg-gray-500';
    
    switch (source) {
      case 'gmail':
        return 'bg-primary';
      case 'outlook':
        return 'bg-blue-500';
      case 'slack':
        return 'bg-purple-500';
      case 'teams':
        return 'bg-secondary';
      case 'telegram':
        return 'bg-sky-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Your Calendar</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setView('day')}
            className={`py-1 px-3 rounded text-sm font-medium ${
              view === 'day' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Day
          </button>
          <button 
            onClick={() => setView('week')}
            className={`py-1 px-3 rounded text-sm font-medium ${
              view === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setView('month')}
            className={`py-1 px-3 rounded text-sm font-medium ${
              view === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={previousWeek} 
              className="text-gray-500 hover:text-gray-700 mr-4"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <h3 className="text-lg font-medium text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button 
              onClick={nextWeek}
              className="text-gray-500 hover:text-gray-700 ml-4"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <button 
            onClick={goToToday}
            className="text-primary hover:text-indigo-700 text-sm font-medium"
          >
            Today
          </button>
        </div>
        
        {/* Week View */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-gray-500">{day.dayName}</div>
                  <div className={`text-lg font-semibold ${day.isToday ? 'bg-primary text-white' : ''} rounded-full w-8 h-8 flex items-center justify-center mx-auto mt-1`}>
                    {day.dayNumber}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Time Grid */}
            <div className="border rounded-lg overflow-hidden">
              {/* All-day events */}
              <div className="grid grid-cols-7 border-b">
                <div className="border-r h-10 flex items-center justify-center text-xs text-gray-500">All day</div>
                {weekDays.map((day, dayIndex) => {
                  const allDayMeetings = weekMeetings.filter(meeting => {
                    const meetingDate = new Date(meeting.startTime);
                    const meetingEndDate = new Date(meeting.endTime);
                    const hours = (meetingEndDate.getTime() - meetingDate.getTime()) / (1000 * 60 * 60);
                    
                    return isSameDay(meetingDate, day.date) && hours >= 8;
                  });
                  
                  return (
                    <div key={dayIndex} className={`border-r h-10 ${day.isToday ? 'bg-indigo-50' : ''}`}>
                      {allDayMeetings.map((meeting, meetingIndex) => (
                        <div 
                          key={meetingIndex}
                          className={`${getMeetingColor(meeting.source)} text-white text-xs px-2 py-1 rounded truncate`}
                        >
                          {meeting.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              
              {/* Time slots */}
              {timeSlots.map((hour, hourIndex) => (
                <div key={hourIndex} className="grid grid-cols-7 border-b">
                  <TimeSlot hour={hour} />
                  
                  {weekDays.map((day, dayIndex) => {
                    const hourMeetings = weekMeetings.filter(meeting => {
                      const meetingDate = new Date(meeting.startTime);
                      return isSameDay(meetingDate, day.date) && 
                        meetingDate.getHours() === hour;
                    });
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`border-r p-1 ${day.isToday ? 'bg-indigo-50' : ''} relative`}
                      >
                        {hourMeetings.map((meeting, meetingIndex) => (
                          <div 
                            key={meetingIndex}
                            className={`absolute top-0 left-0 right-0 ${getMeetingColor(meeting.source)} text-white text-xs p-1 rounded-t truncate`}
                          >
                            {meeting.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
