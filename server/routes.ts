import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  extractMeetingFromEmail, 
  extractMeetingFromChat, 
  generateMeetingReminder 
} from "./openai";
import { 
  insertEmailSourceSchema, 
  insertChatSourceSchema, 
  insertMeetingSchema, 
  insertAiSettingsSchema,
  insertNotificationSchema,
  Meeting
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // User authentication check middleware
  const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Meeting routes
  app.get("/api/meetings", isAuthenticated, async (req, res) => {
    try {
      const meetings = await storage.getMeetingsByUserId(req.user!.id);
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.post("/api/meetings", isAuthenticated, async (req, res) => {
    try {
      const meetingData = insertMeetingSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const meeting = await storage.createMeeting(meetingData);
      res.status(201).json(meeting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid meeting data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create meeting" });
      }
    }
  });

  app.patch("/api/meetings/:id", isAuthenticated, async (req, res) => {
    try {
      const meetingId = parseInt(req.params.id);
      const meeting = await storage.getMeeting(meetingId);
      
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      
      if (meeting.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to update this meeting" });
      }
      
      const updatedMeeting = await storage.updateMeeting(meetingId, req.body);
      res.json(updatedMeeting);
      
      // If meeting status is updated, generate a notification
      if (req.body.status && req.body.status !== meeting.status) {
        const message = req.body.status === 'accepted' 
          ? await generateMeetingReminder({
              title: meeting.title,
              startTime: meeting.startTime.toISOString(),
              endTime: meeting.endTime.toISOString(),
              location: meeting.location || undefined,
              description: meeting.description || undefined
            })
          : `Meeting "${meeting.title}" has been ${req.body.status}.`;
        
        await storage.createNotification({
          userId: req.user!.id,
          meetingId: meetingId,
          message
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update meeting" });
    }
  });

  app.delete("/api/meetings/:id", isAuthenticated, async (req, res) => {
    try {
      const meetingId = parseInt(req.params.id);
      const meeting = await storage.getMeeting(meetingId);
      
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      
      if (meeting.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this meeting" });
      }
      
      await storage.deleteMeeting(meetingId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meeting" });
    }
  });

  // Email sources routes
  app.get("/api/email-sources", isAuthenticated, async (req, res) => {
    try {
      const sources = await storage.getEmailSourcesByUserId(req.user!.id);
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email sources" });
    }
  });

  app.post("/api/email-sources", isAuthenticated, async (req, res) => {
    try {
      const sourceData = insertEmailSourceSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const source = await storage.createEmailSource(sourceData);
      res.status(201).json(source);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email source data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create email source" });
      }
    }
  });

  app.delete("/api/email-sources/:id", isAuthenticated, async (req, res) => {
    try {
      const sourceId = parseInt(req.params.id);
      const source = await storage.getEmailSource(sourceId);
      
      if (!source) {
        return res.status(404).json({ message: "Email source not found" });
      }
      
      if (source.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this source" });
      }
      
      await storage.deleteEmailSource(sourceId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete email source" });
    }
  });

  // Chat sources routes
  app.get("/api/chat-sources", isAuthenticated, async (req, res) => {
    try {
      const sources = await storage.getChatSourcesByUserId(req.user!.id);
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sources" });
    }
  });

  app.post("/api/chat-sources", isAuthenticated, async (req, res) => {
    try {
      const sourceData = insertChatSourceSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const source = await storage.createChatSource(sourceData);
      res.status(201).json(source);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid chat source data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create chat source" });
      }
    }
  });

  app.delete("/api/chat-sources/:id", isAuthenticated, async (req, res) => {
    try {
      const sourceId = parseInt(req.params.id);
      const source = await storage.getChatSource(sourceId);
      
      if (!source) {
        return res.status(404).json({ message: "Chat source not found" });
      }
      
      if (source.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this source" });
      }
      
      await storage.deleteChatSource(sourceId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete chat source" });
    }
  });

  // AI Settings routes
  app.get("/api/ai-settings", isAuthenticated, async (req, res) => {
    try {
      let settings = await storage.getAiSettingsByUserId(req.user!.id);
      
      // Create default settings if not found
      if (!settings) {
        settings = await storage.createAiSettings({
          userId: req.user!.id,
          autoDetectMeetings: true,
          smartNotifications: true,
          learnFromPreferences: true
        });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI settings" });
    }
  });

  app.patch("/api/ai-settings", isAuthenticated, async (req, res) => {
    try {
      let settings = await storage.getAiSettingsByUserId(req.user!.id);
      
      // Create settings if they don't exist
      if (!settings) {
        settings = await storage.createAiSettings({
          userId: req.user!.id,
          ...req.body
        });
        return res.status(201).json(settings);
      }
      
      // Update existing settings
      const updatedSettings = await storage.updateAiSettings(settings.id, req.body);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update AI settings" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUserId(req.user!.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.getNotification(notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      if (notification.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to update this notification" });
      }
      
      const updatedNotification = await storage.updateNotification(notificationId, { read: true });
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // AI-powered meeting extraction endpoints
  app.post("/api/extract-meeting-from-email", isAuthenticated, async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Email content is required" });
      }
      
      const meetingData = await extractMeetingFromEmail(content);
      
      if (!meetingData) {
        return res.json({ detected: false });
      }
      
      res.json({
        detected: true,
        meeting: {
          title: meetingData.title,
          description: meetingData.description,
          startTime: meetingData.startTime,
          endTime: meetingData.endTime,
          location: meetingData.location,
          meetingUrl: meetingData.meetingUrl,
          source: "email",
          status: "pending",
          metadata: {
            confidence: meetingData.confidence,
            attendees: meetingData.attendees
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to extract meeting information" });
    }
  });

  app.post("/api/extract-meeting-from-chat", isAuthenticated, async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Chat content is required" });
      }
      
      const meetingData = await extractMeetingFromChat(content);
      
      if (!meetingData) {
        return res.json({ detected: false });
      }
      
      res.json({
        detected: true,
        meeting: {
          title: meetingData.title,
          description: meetingData.description,
          startTime: meetingData.startTime,
          endTime: meetingData.endTime,
          location: meetingData.location,
          meetingUrl: meetingData.meetingUrl,
          source: "chat",
          status: "pending",
          metadata: {
            confidence: meetingData.confidence,
            attendees: meetingData.attendees
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to extract meeting information" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
