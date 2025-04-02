import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CalendarCheck } from 'lucide-react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  username: z.string().min(1, { message: 'Username is required' }).email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(1, { message: 'Confirm your password' }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // We'll try to get the auth context, but if it's not available, we'll just show the login page
  let loginMutation: any = { mutate: () => {}, isPending: false };
  let registerMutation: any = { mutate: () => {}, isPending: false };
  let user = null;
  
  try {
    const auth = useAuth();
    loginMutation = auth.loginMutation;
    registerMutation = auth.registerMutation;
    user = auth.user;
  } catch (error) {
    console.log("Auth not available yet, showing auth page");
    
    // For demo purposes, provide a dummy login mutation
    loginMutation = {
      mutate: (credentials: any) => {
        console.log("Demo login attempt with:", credentials);
        // Navigate to dashboard after "login"
        setTimeout(() => navigate('/dashboard'), 1000);
      },
      isPending: false
    };
    
    // For demo purposes, provide a dummy register mutation
    registerMutation = { 
      mutate: (credentials: any) => {
        console.log("Demo register attempt with:", credentials);
        // Navigate to dashboard after "registration"
        setTimeout(() => navigate('/dashboard'), 1000);
      }, 
      isPending: false 
    };
  }
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });
  
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };
  
  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      username: values.username,
      password: values.password,
      fullName: values.fullName,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CalendarCheck className="text-primary h-10 w-10" />
            </div>
            <CardTitle className="text-2xl text-center">Welcome to MeetMinder</CardTitle>
            <CardDescription className="text-center">
              Manage all your meetings in one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <a href="#" className="text-sm font-medium text-primary hover:text-indigo-700">
                              Forgot password?
                            </a>
                          </div>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? 'Logging in...' : 'Log in'}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" type="button" className="w-full">
                        <FaGoogle className="mr-2" /> Google
                      </Button>
                      <Button variant="outline" type="button" className="w-full">
                        <FaMicrosoft className="mr-2" /> Microsoft
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              I agree to the{' '}
                              <a href="#" className="text-primary hover:text-indigo-700">Terms</a>
                              {' '}and{' '}
                              <a href="#" className="text-primary hover:text-indigo-700">Privacy Policy</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" type="button" className="w-full">
                        <FaGoogle className="mr-2" /> Google
                      </Button>
                      <Button variant="outline" type="button" className="w-full">
                        <FaMicrosoft className="mr-2" /> Microsoft
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-indigo-100 to-blue-100 p-6 flex items-center justify-center hidden md:flex">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Unified Meeting Management
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Extract meeting information from emails and chat platforms. Never miss an important meeting with our AI-powered reminders.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Connect Gmail, Outlook, Slack, and more</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>AI-powered meeting detection from conversations</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Smart notifications for upcoming meetings</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Beautiful, unified calendar view</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
