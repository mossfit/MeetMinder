import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { AiSettings } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const AiSettingsCard = () => {
  const { toast } = useToast();
  
  // Default user for demo mode
  let user = { id: 1, username: 'demo@example.com' };
  
  // Try to get auth context but handle gracefully if it fails
  try {
    const auth = useAuth();
    user = auth.user || user;
    console.log("Auth loaded successfully in AiSettingsCard");
  } catch (error) {
    console.log("Auth not available in AiSettingsCard, using demo mode");
  }
  
  // For demo mode, use local state to track settings
  const [demoSettings, setDemoSettings] = useState({
    autoDetectMeetings: true,
    smartNotifications: true,
    learnFromPreferences: true
  });
  
  // For real implementation, we would use this:
  const { data: apiSettings, isLoading } = useQuery<AiSettings>({
    queryKey: ['/api/ai-settings'],
    enabled: false, // Disabled for demo
  });
  
  // Use demo settings instead of API settings
  const aiSettings = apiSettings || demoSettings;
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<AiSettings>) => {
      const res = await apiRequest('PATCH', '/api/ai-settings', settings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-settings'] });
      toast({
        title: 'Settings updated',
        description: 'Your AI assistant settings have been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleToggle = (setting: keyof Omit<AiSettings, 'id' | 'userId'>, value: boolean) => {
    // For demo mode, update local state
    setDemoSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Show toast for feedback
    toast({
      title: 'Settings updated',
      description: 'Your AI assistant settings have been updated.',
    });
    
    // In a real implementation, we would call the mutation
    /*
    if (!user) return;
    
    updateSettingsMutation.mutate({
      userId: user.id,
      [setting]: value,
    });
    */
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Auto-detect meetings</span>
              <Switch 
                checked={aiSettings?.autoDetectMeetings ?? true}
                onCheckedChange={(checked) => handleToggle('autoDetectMeetings', checked)}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Let AI detect meetings from emails and chats</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Smart notifications</span>
              <Switch 
                checked={aiSettings?.smartNotifications ?? true}
                onCheckedChange={(checked) => handleToggle('smartNotifications', checked)}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Receive context-aware reminders</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Learn from preferences</span>
              <Switch 
                checked={aiSettings?.learnFromPreferences ?? true}
                onCheckedChange={(checked) => handleToggle('learnFromPreferences', checked)}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">AI adapts to your meeting habits</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiSettingsCard;
