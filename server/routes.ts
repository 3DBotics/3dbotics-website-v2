import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema, chatMessageSchema, insertStudentChatSchema } from "@shared/schema";
import { librarian } from "./librarian";

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
      const query = validatedData.message;
      
      // Use the Librarian to generate a factual, curriculum-based response
      const response = await librarian.generateResponse(query);
      
      res.json({ response });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/chat-log", async (req, res) => {
    try {
      const validatedData = insertStudentChatSchema.parse(req.body);
      const log = await storage.logStudentChat(validatedData);
      res.json({ success: true, id: log.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  });

  return httpServer;
}
