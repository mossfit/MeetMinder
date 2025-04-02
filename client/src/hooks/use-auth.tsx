import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

// Create a mock user for demo purposes
const createMockUser = (data: LoginData | InsertUser): SelectUser => {
  // Use the fullName if provided, otherwise extract from username
  const fullName = 'fullName' in data && data.fullName 
    ? data.fullName 
    : data.username.split('@')[0];
    
  return {
    id: 1,
    username: data.username,
    password: 'hashed-password', // We need this in the schema but it would never be exposed to client
    fullName, // This is nullable in the schema, so it's fine
    plan: 'free'
  };
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [demoUser, setDemoUser] = useState<SelectUser | null>(null);
  const [demoIsLoading, setDemoIsLoading] = useState(true);
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setDemoIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // We'll disable the real API query for demo purposes
  const {
    data: apiUser,
    error,
    isLoading: apiIsLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: false // Disable for demo
  });
  
  // Use the demo user instead of the API user
  const user = demoUser;
  const isLoading = demoIsLoading;

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // For demo purposes, log the credentials
      console.log("Demo login attempt with:", credentials);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always return a successful login with a mock user
      return createMockUser(credentials);
    },
    onSuccess: (mockUser: SelectUser) => {
      // Set the demo user
      setDemoUser(mockUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.fullName || mockUser.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always return a successful registration with a mock user
      return createMockUser(credentials);
    },
    onSuccess: (mockUser: SelectUser) => {
      // Set the demo user
      setDemoUser(mockUser);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      // Clear the demo user
      setDemoUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
