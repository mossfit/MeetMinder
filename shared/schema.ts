import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  plan: text("plan").default("free"),
});

export const emailSources = pgTable("email_sources", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(), // gmail, outlook, etc.
  email: text("email").notNull(),
  active: boolean("active").default(true),
});

export const chatSources = pgTable("chat_sources", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(), // slack, telegram, etc.
  username: text("username").notNull(),
  active: boolean("active").default(true),
});

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  meetingUrl: text("meeting_url"),
  source: text("source"), // email, slack, etc.
  sourceId: text("source_id"), // ID from the original source
  status: text("status").default("pending"), // pending, accepted, declined
  metadata: jsonb("metadata"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  meetingId: integer("meeting_id").references(() => meetings.id),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  read: boolean("read").default(false),
});

export const aiSettings = pgTable("ai_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  autoDetectMeetings: boolean("auto_detect_meetings").default(true),
  smartNotifications: boolean("smart_notifications").default(true),
  learnFromPreferences: boolean("learn_from_preferences").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  plan: true,
});

export const insertEmailSourceSchema = createInsertSchema(emailSources).pick({
  userId: true,
  provider: true,
  email: true,
  active: true,
});

export const insertChatSourceSchema = createInsertSchema(chatSources).pick({
  userId: true,
  provider: true,
  username: true,
  active: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).pick({
  userId: true,
  title: true,
  description: true,
  startTime: true,
  endTime: true,
  location: true,
  meetingUrl: true,
  source: true,
  sourceId: true,
  status: true,
  metadata: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  meetingId: true,
  message: true,
});

export const insertAiSettingsSchema = createInsertSchema(aiSettings).pick({
  userId: true,
  autoDetectMeetings: true,
  smartNotifications: true,
  learnFromPreferences: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type EmailSource = typeof emailSources.$inferSelect;
export type ChatSource = typeof chatSources.$inferSelect;
export type Meeting = typeof meetings.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AiSettings = typeof aiSettings.$inferSelect;

// Additional specific types
export type MeetingStatus = 'pending' | 'accepted' | 'declined';
export type SourceProvider = 'gmail' | 'outlook' | 'yahoo' | 'slack' | 'telegram' | 'teams';
