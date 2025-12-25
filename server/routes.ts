import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema, chatMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactMessageSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatMessageSchema.parse(req.body);
      const message = validatedData.message.toLowerCase();
      
      let response = "Thanks for your message! Our team will get back to you soon.";
      
      if (message.includes("program") || message.includes("course")) {
        response = "We offer three main programs: 3D Printing Mastery, AI & Machine Learning, and Robotics Engineering. Each program is designed for students of all ages and skill levels. Would you like to know more about any specific program?";
      } else if (message.includes("franchise") || message.includes("partner")) {
        response = "Interested in becoming a TechDojo franchisee? Our franchise program offers comprehensive support, training materials, and a proven curriculum. Please use the Franchisee Login portal or contact us for more details!";
      } else if (message.includes("student") || message.includes("enroll") || message.includes("sign up")) {
        response = "To enroll as a student, please visit your nearest TechDojo center or use the Student Login portal. You'll get access to courses, mentors, and hands-on projects!";
      } else if (message.includes("contact") || message.includes("reach")) {
        response = "You can reach us at hello@3dbotics.ph or call +63 123 456 7890. Our team is available Monday to Saturday, 9 AM to 6 PM.";
      } else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        response = "Hello! Welcome to 3DBotics. I'm here to help you learn about our 3D Printing, AI, and Robotics programs. What would you like to know?";
      }
      
      res.json({ response });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  return httpServer;
}
