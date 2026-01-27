import { randomUUID } from "crypto";
import { type User, type InsertUser, type ContactMessage, type ContactSubmission, type StudentChat, type InsertStudentChat } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(message: ContactMessage): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  logStudentChat(chat: InsertStudentChat): Promise<StudentChat>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private studentChats: Map<string, StudentChat>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.studentChats = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(message: ContactMessage): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  async logStudentChat(chat: InsertStudentChat): Promise<StudentChat> {
    const id = randomUUID();
    const studentChat: StudentChat = {
      ...chat,
      id,
      createdAt: new Date().toISOString(),
    };
    this.studentChats.set(id, studentChat);
    return studentChat;
  }
}

export const storage = new MemStorage();
