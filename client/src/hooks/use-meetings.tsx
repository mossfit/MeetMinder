import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Meeting, MeetingStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Define the context type
type MeetingsContextType = {
  meetings: Meeting[];
  pendingMeetings: Meeting[];
  todayMeetings: Meeting[];
  isLoading: boolean;
  error: Error | null;
  updateMeetingStatus: (id: number, status: MeetingStatus) => Promise<void>;
  createMeeting: (meeting: Omit<Meeting, "id">) => Promise<Meeting>;
};

// Create the context
const MeetingsContext = createContext<MeetingsContextType | null>(null);

// Sample data for demonstration
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

// Type assertion to ensure the mock data conforms to the Meeting type
const mockMeetings: Meeting[] = [
  {
    id: 1,
    userId: 1,
    title: "Weekly Team Sync",
    description: "Discuss progress on the MeetMinder project",
    startTime: today,
    endTime: today,
    status: "accepted" as MeetingStatus,
    location: "Conference Room A",
    meetingUrl: null,
    source: "email",
    sourceId: "1",
    metadata: { attendees: ["john@example.com", "sarah@example.com", "mike@example.com"] },
  },
  {
    id: 2,
    userId: 1,
    title: "Client Presentation",
    description: "Present the new design mockups",
    startTime: today,
    endTime: today,
    status: "accepted" as MeetingStatus,
    location: "Zoom Meeting",
    meetingUrl: "https://zoom.us/j/123456789",
    source: "email",
    sourceId: "2",
    metadata: { attendees: ["client@example.com", "design@example.com"] },
  },
  {
    id: 3,
    userId: 1,
    title: "Project Review",
    description: "Review the project timeline and milestones",
    startTime: tomorrow,
    endTime: tomorrow,
    status: "pending" as MeetingStatus,
    location: "Microsoft Teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/123",
    source: "chat",
    sourceId: "3",
    metadata: { attendees: ["team@example.com", "manager@example.com"] },
  },
  {
    id: 4,
    userId: 1,
    title: "Product Demo",
    description: "Demo the new features to the stakeholders",
    startTime: dayAfterTomorrow,
    endTime: dayAfterTomorrow,
    status: "pending" as MeetingStatus,
    location: "Conference Room B",
    meetingUrl: null,
    source: "email",
    sourceId: "4",
    metadata: { attendees: ["stakeholder@example.com", "product@example.com"] },
  }
];

// Provider component
export function MeetingsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Try to get auth context, but handle gracefully if it's not available
  let userId = 1; // Default user ID for demo
  
  try {
    const { user } = useAuth();
    userId = user?.id || 1;
  } catch (error) {
    console.log("Auth context not available in MeetingsProvider, using default user ID");
  }
  
  // For demonstration, use mock data instead of API call
  const {
    data: meetings = mockMeetings,
    isLoading = false,
    error = null,
  } = useQuery<Meeting[], Error>({
    queryKey: ["/api/meetings"],
    enabled: false // Disable the actual query since we're using mock data
  });

  // Mutation for updating meeting status
  const updateMeetingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: MeetingStatus }) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the meeting in our mock data
      const meetingIndex = mockMeetings.findIndex(m => m.id === id);
      if (meetingIndex !== -1) {
        mockMeetings[meetingIndex].status = status;
      }
      
      return mockMeetings[meetingIndex];
    },
    onSuccess: () => {
      // No need to invalidate queries since we're using mock data
      toast({
        title: "Meeting updated",
        description: "The meeting status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for creating new meetings
  const createMeetingMutation = useMutation({
    mutationFn: async (meeting: Omit<Meeting, "id">) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new meeting and add it to our mock data
      const newMeeting: Meeting = {
        ...meeting as any,
        id: mockMeetings.length + 1,
      };
      
      mockMeetings.push(newMeeting);
      return newMeeting;
    },
    onSuccess: () => {
      // No need to invalidate queries since we're using mock data
      toast({
        title: "Meeting created",
        description: "The meeting has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter pending meetings
  const pendingMeetings = meetings.filter(meeting => meeting.status === "pending");
  
  // Filter today's meetings
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  
  const todayMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    return meetingDate >= todayDate && meetingDate < tomorrowDate && meeting.status === "accepted";
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Wrapper functions
  const updateMeetingStatus = async (id: number, status: MeetingStatus) => {
    await updateMeetingStatusMutation.mutateAsync({ id, status });
  };

  const createMeeting = async (meeting: Omit<Meeting, "id">) => {
    return await createMeetingMutation.mutateAsync(meeting);
  };

  // Provide context value
  return (
    <MeetingsContext.Provider 
      value={{
        meetings,
        pendingMeetings,
        todayMeetings,
        isLoading,
        error,
        updateMeetingStatus,
        createMeeting,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  );
}

// Hook for consuming the meetings context
export function useMeetings() {
  const context = useContext(MeetingsContext);
  if (!context) {
    throw new Error("useMeetings must be used within a MeetingsProvider");
  }
  return context;
}
