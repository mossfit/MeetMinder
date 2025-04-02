import { 
  users, 
  emailSources, 
  chatSources, 
  meetings, 
  notifications, 
  aiSettings,
  type User, 
  type InsertUser,
  type EmailSource,
  type ChatSource,
  type Meeting,
  type Notification,
  type AiSettings
} from "@shared/schema";
import { z } from "zod";
import { insertUserSchema, insertEmailSourceSchema, insertChatSourceSchema, insertMeetingSchema, insertNotificationSchema, insertAiSettingsSchema } from "@shared/schema";

// Define types for inserting records using the Zod inference
type InsertEmailSource = z.infer<typeof insertEmailSourceSchema>;
type InsertChatSource = z.infer<typeof insertChatSourceSchema>;
type InsertMeeting = z.infer<typeof insertMeetingSchema>;
type InsertNotification = z.infer<typeof insertNotificationSchema>;
type InsertAiSettings = z.infer<typeof insertAiSettingsSchema>;
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Email sources methods
  getEmailSource(id: number): Promise<EmailSource | undefined>;
  getEmailSourcesByUserId(userId: number): Promise<EmailSource[]>;
  createEmailSource(source: InsertEmailSource): Promise<EmailSource>;
  deleteEmailSource(id: number): Promise<void>;
  
  // Chat sources methods
  getChatSource(id: number): Promise<ChatSource | undefined>;
  getChatSourcesByUserId(userId: number): Promise<ChatSource[]>;
  createChatSource(source: InsertChatSource): Promise<ChatSource>;
  deleteChatSource(id: number): Promise<void>;
  
  // Meeting methods
  getMeeting(id: number): Promise<Meeting | undefined>;
  getMeetingsByUserId(userId: number): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meetingData: Partial<Meeting>): Promise<Meeting>;
  deleteMeeting(id: number): Promise<void>;
  
  // Notification methods
  getNotification(id: number): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification>;
  
  // AI settings methods
  getAiSettingsByUserId(userId: number): Promise<AiSettings | undefined>;
  createAiSettings(settings: InsertAiSettings): Promise<AiSettings>;
  updateAiSettings(id: number, settingsData: Partial<AiSettings>): Promise<AiSettings>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emailSources: Map<number, EmailSource>;
  private chatSources: Map<number, ChatSource>;
  private meetings: Map<number, Meeting>;
  private notifications: Map<number, Notification>;
  private aiSettings: Map<number, AiSettings>;
  
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private emailSourceIdCounter: number;
  private chatSourceIdCounter: number;
  private meetingIdCounter: number;
  private notificationIdCounter: number;
  private aiSettingsIdCounter: number;

  constructor() {
    this.users = new Map();
    this.emailSources = new Map();
    this.chatSources = new Map();
    this.meetings = new Map();
    this.notifications = new Map();
    this.aiSettings = new Map();
    
    this.userIdCounter = 1;
    this.emailSourceIdCounter = 1;
    this.chatSourceIdCounter = 1;
    this.meetingIdCounter = 1;
    this.notificationIdCounter = 1;
    this.aiSettingsIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure fullName is never undefined
    const fullName = insertUser.fullName ?? null;
    const user: User = { 
      ...insertUser, 
      id, 
      plan: "free", 
      fullName 
    };
    this.users.set(id, user);
    return user;
  }

  // Email sources methods
  async getEmailSource(id: number): Promise<EmailSource | undefined> {
    return this.emailSources.get(id);
  }

  async getEmailSourcesByUserId(userId: number): Promise<EmailSource[]> {
    return Array.from(this.emailSources.values()).filter(
      (source) => source.userId === userId,
    );
  }

  async createEmailSource(insertSource: InsertEmailSource): Promise<EmailSource> {
    const id = this.emailSourceIdCounter++;
    const source: EmailSource = { 
      ...insertSource, 
      id,
      active: insertSource.active ?? true
    };
    this.emailSources.set(id, source);
    return source;
  }

  async deleteEmailSource(id: number): Promise<void> {
    this.emailSources.delete(id);
  }

  // Chat sources methods
  async getChatSource(id: number): Promise<ChatSource | undefined> {
    return this.chatSources.get(id);
  }

  async getChatSourcesByUserId(userId: number): Promise<ChatSource[]> {
    return Array.from(this.chatSources.values()).filter(
      (source) => source.userId === userId,
    );
  }

  async createChatSource(insertSource: InsertChatSource): Promise<ChatSource> {
    const id = this.chatSourceIdCounter++;
    const source: ChatSource = { 
      ...insertSource, 
      id,
      active: insertSource.active ?? true 
    };
    this.chatSources.set(id, source);
    return source;
  }

  async deleteChatSource(id: number): Promise<void> {
    this.chatSources.delete(id);
  }

  // Meeting methods
  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async getMeetingsByUserId(userId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(
      (meeting) => meeting.userId === userId,
    );
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.meetingIdCounter++;
    const meeting: Meeting = { 
      ...insertMeeting, 
      id,
      status: insertMeeting.status ?? 'pending',
      source: insertMeeting.source ?? null,
      sourceId: insertMeeting.sourceId ?? null,
      description: insertMeeting.description ?? null,
      location: insertMeeting.location ?? null,
      meetingUrl: insertMeeting.meetingUrl ?? null,
      metadata: insertMeeting.metadata ?? {}
    };
    this.meetings.set(id, meeting);
    return meeting;
  }

  async updateMeeting(id: number, meetingData: Partial<Meeting>): Promise<Meeting> {
    const meeting = this.meetings.get(id);
    if (!meeting) {
      throw new Error(`Meeting with id ${id} not found`);
    }
    const updatedMeeting = { ...meeting, ...meetingData };
    this.meetings.set(id, updatedMeeting);
    return updatedMeeting;
  }

  async deleteMeeting(id: number): Promise<void> {
    this.meetings.delete(id);
  }

  // Notification methods
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId,
    );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const sentAt = new Date();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      sentAt,
      meetingId: insertNotification.meetingId ?? null,
      read: false
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    const updatedNotification = { ...notification, ...notificationData };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  // AI settings methods
  async getAiSettingsByUserId(userId: number): Promise<AiSettings | undefined> {
    return Array.from(this.aiSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async createAiSettings(insertSettings: InsertAiSettings): Promise<AiSettings> {
    const id = this.aiSettingsIdCounter++;
    const settings: AiSettings = { 
      ...insertSettings, 
      id,
      autoDetectMeetings: insertSettings.autoDetectMeetings ?? true,
      smartNotifications: insertSettings.smartNotifications ?? true,
      learnFromPreferences: insertSettings.learnFromPreferences ?? true
    };
    this.aiSettings.set(id, settings);
    return settings;
  }

  async updateAiSettings(id: number, settingsData: Partial<AiSettings>): Promise<AiSettings> {
    const settings = this.aiSettings.get(id);
    if (!settings) {
      throw new Error(`AI settings with id ${id} not found`);
    }
    const updatedSettings = { ...settings, ...settingsData };
    this.aiSettings.set(id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
