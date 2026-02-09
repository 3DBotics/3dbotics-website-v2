import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema, chatMessageSchema, insertStudentChatSchema } from "@shared/schema";
import { librarian } from "./librarian";
import { searchPhotos } from "./pexels";
import { getEducationalVideos } from "./educationalVideos";
import { createProxyMiddleware } from "http-proxy-middleware";

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
      const { message, category = 'chat' } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Use the Librarian to generate a factual, curriculum-based response
      const response = await librarian.generateResponse(message, category as 'chat' | 'concierge');
      
      res.json({ response });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/learn", async (req, res) => {
    try {
      const { category, question, answer } = req.body;
      if (!category || !question || !answer) {
        return res.status(400).json({ error: "Category, question, and answer are required" });
      }

      await librarian.learn(category, question, answer);
      res.json({ success: true, message: "Wisdom saved successfully!" });
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

  app.get("/api/pexels/search", async (req, res) => {
    try {
      const { query, per_page = "5" } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query parameter is required" });
      }

      const perPage = parseInt(per_page as string, 10);
      if (isNaN(perPage) || perPage < 1 || perPage > 80) {
        return res.status(400).json({ error: "per_page must be between 1 and 80" });
      }

      const results = await searchPhotos(query, perPage);
      res.json(results);
    } catch (error) {
      console.error("Pexels API error:", error);
      res.status(500).json({ error: "Failed to fetch images from Pexels" });
    }
  });

  app.get("/api/videos/search", async (req, res) => {
    try {
      const { subject } = req.query;
      
      if (!subject || typeof subject !== "string") {
        return res.status(400).json({ error: "Subject parameter is required" });
      }

      const videos = getEducationalVideos(subject);
      res.json(videos);
    } catch (error) {
      console.error("Video search error:", error);
      res.status(500).json({ error: "Failed to fetch educational videos" });
    }
  });

  // Proxy /laila requests to LAILA service on Railway
  app.use(
    "/laila",
    createProxyMiddleware({
      target: "http://laila-education-platform.railway.internal:3000",
      changeOrigin: true,
      pathRewrite: {
        "^/laila": "", // Remove /laila prefix when forwarding to LAILA service
      },
      ws: true, // Support WebSocket connections
    })
  );

  return httpServer;
}
