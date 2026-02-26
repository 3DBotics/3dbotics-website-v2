import express, { type Express } from "express";
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
      
      // WHITELIST-ONLY MODE FOR CONCIERGE: Only show verified information
      if (category === 'concierge') {
        // Check if this is a franchise-related question
        const franchiseKeywords = ['franchise', 'cost', 'price', 'fee', 'investment', 'how much', 'package', 'included', 'what do i get', 'what is included'];
        const isFranchiseQuestion = franchiseKeywords.some(kw => message.toLowerCase().includes(kw));
        
        if (isFranchiseQuestion) {
          // ONLY use verified Founder's Wisdom for franchise questions
          const verifiedResponse = await librarian.getVerifiedFranchiseInfo(message);
          if (verifiedResponse && verifiedResponse.trim().length > 0) {
            console.log(`[WHITELIST MODE] Using verified franchise information`);
            return res.json({ response: verifiedResponse });
          } else {
            // If no verified info exists, show safe fallback
            console.log(`[WHITELIST MODE] No verified info found, using fallback`);
            const fallback = `For detailed franchise information, please contact us at 3DBotics.LC@gmail.com or call 0995-836-2249. The 3DBotics franchise package costs ₱660,000 all-in and includes everything you need to start your TechDojo location.`;
            return res.json({ response: fallback });
          }
        }
      }
      
      // For non-franchise questions or /chat, use normal Librarian
      let response = await librarian.generateResponse(message, category as 'chat' | 'concierge');
      
      // Additional safety filter for any remaining responses
      if (category === 'concierge') {
        // Block any number that looks like a price (except 660,000)
        const pricePattern = /₱\s*([0-9,]+)|PHP\s*([0-9,]+)/gi;
        response = response.replace(pricePattern, (match, p1, p2) => {
          const price = (p1 || p2).replace(/,/g, '');
          if (price !== '660000') {
            console.log(`[SAFETY FILTER] Replacing price ${price} with ₱660,000`);
            return '₱660,000';
          }
          return match;
        });
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

  // Get verified franchise information (whitelist-only)
  app.post("/api/franchise-info", async (req, res) => {
    try {
      const franchiseInfo = `✅ 3DBotics Franchise Package - ₱660,000 All-In

What's Included:
✔️ 5 Brand New 3D Printers (calibrated)
✔️ 7 Kilos of 3D Filament (assorted colors)
✔️ 43" Smart TV for classroom instructions
✔️ 5 Complete 3DPrinting Toolkits
✔️ 5 Storage Device for file transfers
✔️ 3 Major Apps for 3D modeling & robotics
✔️ Per Course Level Robot Projects for marketing & Display
✔️ Best Selling "ready-to-3DPrint" Files as immediate products
✔️ Official Marketing Materials (HD logos, editable posters)

Plus:
✅ INTENSIVE Training for Branch Owner + Facilitators (face-to-face and weekly Zoom)
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from 3DBotics Main Office
✅ Instant ACCESS to state-of-the-art AI web-platform for branch operations
✔️ Rental Space Security Deposit
✔️ 1st Two Months Rent fee

Contact us: 3DBotics.LC@gmail.com | 0995-836-2249`;
      res.json({ info: franchiseInfo });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve franchise information" });
    }
  });

  app.post("/api/learn", async (req, res) => {
    try {
      const { category, question, answer } = req.body;
      if (!category || !question || !answer) {
        return res.status(400).json({ error: "Category, question, and answer are required" });
      }

      // For concierge, validate that franchise info is accurate
      if (category === 'concierge') {
        const pricePattern = /₱\s*([0-9,]+)|PHP\s*([0-9,]+)/;
        const priceMatch = answer.match(pricePattern);
        if (priceMatch) {
          const price = (priceMatch[1] || priceMatch[2]).replace(/,/g, '');
          if (price !== '660000') {
            return res.status(400).json({ error: `Invalid price. The 3DBotics franchise cost is ₱660,000, not ₱${price}` });
          }
        }
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

  // Validate franchise pricing before allowing any wisdom to be saved
  app.post("/api/validate-franchise-price", async (req, res) => {
    try {
      const { price } = req.body;
      const cleanPrice = String(price).replace(/[^0-9]/g, '');
      if (cleanPrice === '660000') {
        res.json({ valid: true, message: "Price is correct" });
      } else {
        res.json({ valid: false, message: `Invalid price. The correct 3DBotics franchise cost is ₱660,000` });
      }
    } catch (error) {
      res.status(500).json({ error: "Validation failed" });
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
      target: "https://laila-education-platform-production.up.railway.app",
      changeOrigin: true,
      pathRewrite: {
        "^/laila": "", // Remove /laila prefix when forwarding to LAILA service
      },
      ws: true, // Support WebSocket connections
    })
  );

  return httpServer;
}
