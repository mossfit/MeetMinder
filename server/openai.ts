// OpenAI integration for MeetMinder
// Simulated version that doesn't require actual API key

// Type definitions for extracted meeting data from email
type EmailMeetingData = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingUrl?: string;
  attendees?: string[];
  confidence: number;
};

// Type definitions for extracted meeting data from chat
type ChatMeetingData = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingUrl?: string;
  attendees?: string[];
  confidence: number;
};

// Helper function to check if text contains meeting-related keywords
function containsMeetingKeywords(text: string): boolean {
  const keywords = [
    'meeting', 'call', 'sync', 'discussion', 'huddle', 'standup',
    'review', 'planning', 'retrospective', 'demo', 'presentation',
    'webinar', 'conference', 'workshop', 'session', 'appointment',
    'scheduled', 'calendar', 'agenda', 'invite', 'join'
  ];
  
  const lowercaseText = text.toLowerCase();
  return keywords.some(keyword => lowercaseText.includes(keyword));
}

// Helper function to get a future time for simulated meetings
function getFutureMeetingTime(hoursFromNow = 24): { start: string, end: string } {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() + hoursFromNow);
  
  // Round to nearest 30 minutes
  startDate.setMinutes(Math.round(startDate.getMinutes() / 30) * 30);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 60); // Default 1-hour meeting
  
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  };
}

// Simulate extracting meeting details from an email
export async function extractMeetingFromEmail(emailContent: string): Promise<EmailMeetingData | null> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if the email has meeting-related content
  if (!containsMeetingKeywords(emailContent)) {
    return null;
  }
  
  const { start, end } = getFutureMeetingTime();
  
  // Extract potential title from first line or use default
  const lines = emailContent.split('\n');
  const potentialTitle = lines[0].trim().length > 5 && lines[0].length < 100 
    ? lines[0].trim() 
    : 'Meeting detected from email';
  
  // Generate some attendees from common names
  const commonNames = ['john@example.com', 'sarah@example.com', 'mike@example.com', 'lisa@example.com'];
  const attendees = [...Array(Math.floor(Math.random() * 3) + 1)].map(() => 
    commonNames[Math.floor(Math.random() * commonNames.length)]
  );
  
  // Calculate a confidence score (higher if more meeting keywords are found)
  let confidence = 0.7 + (Math.random() * 0.3); // Base confidence between 0.7-1.0
  
  return {
    title: potentialTitle,
    description: emailContent.length > 100 ? emailContent.substring(0, 100) + '...' : emailContent,
    startTime: start,
    endTime: end,
    location: Math.random() > 0.5 ? 'Conference Room A' : undefined,
    meetingUrl: Math.random() > 0.5 ? 'https://meet.example.com/abc123' : undefined,
    attendees,
    confidence
  };
}

// Simulate extracting meeting details from a chat message
export async function extractMeetingFromChat(chatMessages: string): Promise<ChatMeetingData | null> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check if the chat has meeting-related content
  if (!containsMeetingKeywords(chatMessages)) {
    return null;
  }
  
  const { start, end } = getFutureMeetingTime(12); // Chat meetings tend to be sooner
  
  // Generate a descriptive title based on keywords in the chat
  const chatLower = chatMessages.toLowerCase();
  let title = 'Chat Meeting';
  
  if (chatLower.includes('standup')) {
    title = 'Daily Standup';
  } else if (chatLower.includes('review')) {
    title = 'Project Review';
  } else if (chatLower.includes('planning')) {
    title = 'Sprint Planning';
  } else if (chatLower.includes('demo')) {
    title = 'Product Demo';
  }
  
  // Generate some attendees from common names
  const commonNames = ['john', 'sarah', 'mike', 'lisa'];
  const attendees = [...Array(Math.floor(Math.random() * 3) + 1)].map(() => 
    commonNames[Math.floor(Math.random() * commonNames.length)]
  );
  
  // Calculate a confidence score (higher if more meeting keywords are found)
  let confidence = 0.6 + (Math.random() * 0.4); // Base confidence between 0.6-1.0
  
  return {
    title,
    description: chatMessages.length > 100 ? chatMessages.substring(0, 100) + '...' : chatMessages,
    startTime: start,
    endTime: end,
    location: Math.random() > 0.7 ? 'Virtual Meeting Room' : undefined,
    meetingUrl: Math.random() > 0.3 ? 'https://meet.example.com/' + Math.random().toString(36).substring(2, 8) : undefined,
    attendees,
    confidence
  };
}

// Generate a meeting reminder
export async function generateMeetingReminder(meeting: {
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}): Promise<string> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const startDate = new Date(meeting.startTime);
  const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = startDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  
  const locationInfo = meeting.location 
    ? `Location: ${meeting.location}` 
    : 'This is a virtual meeting';
  
  return `Reminder: "${meeting.title}" is scheduled for ${timeStr} on ${dateStr}. ${locationInfo}. ${meeting.description ? 'Notes: ' + meeting.description : ''}`;
}