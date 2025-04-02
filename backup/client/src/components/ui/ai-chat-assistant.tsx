import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

const dummyResponses = [
  "I've analyzed your calendar and found a potential conflict between your 2 PM meeting with Marketing and your 3 PM call with the client tomorrow. Would you like me to suggest alternate times?",
  "Based on your past preferences, I notice you usually decline meetings after 4 PM on Fridays. There's a team sync scheduled this Friday at 4:30 PM. Would you like me to suggest rescheduling?",
  "I've analyzed the email from Sarah about the project kickoff. It seems like a high-priority meeting. Should I add it to your calendar and send a notification 30 minutes before?",
  "Good morning! You have 3 meetings today: Team standup at 9 AM, Client presentation at 11 AM, and 1:1 with your manager at 3 PM. Would you like a summary of relevant documents for these meetings?",
  "I've detected a new meeting invitation from john@example.com about 'Q2 Strategy Review' for next Tuesday at 10 AM. This conflicts with your 'Focus Time' block. How would you like to proceed?",
  "Your meeting with the Design team is starting in 15 minutes. Based on past interactions, you might want to review the latest mockups shared by Alex yesterday. Would you like me to find them for you?"
];

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m your MeetMinder assistant. How can I help manage your meetings today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full shadow-lg"
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="absolute bottom-16 right-0"
          >
            <Card className="w-80 sm:w-96 h-96 shadow-xl">
              <div className="flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-t-lg">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  <span className="font-medium">MeetMinder Assistant</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 overflow-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "mb-3 max-w-[80%] rounded-lg p-3",
                        message.sender === 'user' 
                          ? "bg-primary text-primary-foreground ml-auto" 
                          : "bg-muted"
                      )}
                    >
                      {message.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="bg-muted max-w-[80%] rounded-lg p-3 mb-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-3 border-t">
                  <div className="flex items-center">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 mr-2"
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AiChatAssistant;