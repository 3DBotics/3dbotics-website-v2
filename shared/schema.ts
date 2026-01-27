import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required"),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export interface ContactSubmission extends ContactMessage {
  id: string;
  createdAt: Date;
}

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export interface ChatResponse {
  response: string;
}

export const studentChats = pgTable("student_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  response: text("response").notNull(),
  branch: text("branch").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertStudentChatSchema = createInsertSchema(studentChats).pick({
  message: true,
  response: true,
  branch: true,
});

export type InsertStudentChat = z.infer<typeof insertStudentChatSchema>;
export type StudentChat = typeof studentChats.$inferSelect;
