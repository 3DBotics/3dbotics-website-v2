import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema, chatMessageSchema, insertStudentChatSchema } from "@shared/schema";
import { librarian } from "./librarian";
import { searchPhotos } from "./pexels";
import { getEducationalVideos } from "./educationalVideos";
import { createProxyMiddleware } from "http-proxy-middleware";
import { sendContactEmail } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactMessageSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      // Send email notification to 3dbotics.LC@gmail.com
      sendContactEmail(validatedData.name, validatedData.email, validatedData.message).catch((err) => {
        console.error("[Email] Failed to send contact email:", err);
      });
      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, error: error.message });
      } else {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  });

  // NUCLEAR OVERRIDE: Franchise questions bypass AI entirely
  const FRANCHISE_RESPONSE = `✅ **3DBotics Franchise Package - ₱660,000 All-In**

**What's Included:**
• 5 Brand New 3D Printers (calibrated & ready to use)
• 7 Kilos of 3D Filament (assorted colors)
• 43" Smart TV for classroom instructions
• 5 Complete 3DPrinting Toolkits
• 5 Storage Devices for file transfers
• 3 Major Apps for 3D modeling & robotics
• Per Course Level Robot Projects for marketing & Display
• Best Selling "ready-to-3DPrint" Files as immediate products
• Official Marketing Materials (HD logos, editable posters)

**Plus:**
✅ INTENSIVE Training for Branch Owner + Facilitators (face-to-face and weekly Zoom)
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from 3DBotics Main Office
✅ Instant ACCESS to state-of-the-art AI web-platform for branch operations
✅ Rental Space Security Deposit
✅ 1st Two Months Rent fee

**Payment Schedule:**
📌 **Reservation (10%) - ₱66,000** — Secures your promo and city target
📌 **After 2 Weeks (40%) - ₱264,000** — Equipment placement begins
📌 **After 3 Weeks (50%) - ₱330,000** — Full payment before delivery of equipment

**Contact us:** 3DBotics.LC@gmail.com | 0995-836-2249`;

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, category = 'chat' } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // NUCLEAR OVERRIDE FOR CONCIERGE: Franchise questions bypass AI entirely
      // IMPORTANT: Keep keywords specific to FRANCHISE/BUSINESS inquiries only.
      // Generic words like 'fee', 'price', 'how much', 'cost', 'payment' must NOT be here
      // because they also match student/parent enrollment and tuition questions.
      if (category === 'concierge') {
        const lowerMessage = message.toLowerCase();

        // Enrollment-related keywords that should NOT trigger the franchise override
        const enrollmentKeywords = ['tuition', 'enrollment', 'enroll', 'monthly fee', 'session fee', 'student fee', 'course fee', 'per month', 'per session', 'registration fee', 'how much is the tuition', 'how much to enroll', 'how much for the class', 'how much per month', 'how much is enrollment'];
        const isEnrollmentQuestion = enrollmentKeywords.some(kw => lowerMessage.includes(kw));

        // Franchise-specific keywords only
        const franchiseKeywords = ['franchise', 'franchising', 'open a branch', 'open branch', 'start a branch', 'become a franchisee', 'franchise package', 'franchise cost', 'franchise fee', 'franchise investment', 'franchise price', 'all-in cost', 'all-in package', 'cash out', 'downpayment', 'startup cost', 'initial investment', 'reservation fee', '660', 'partnership opportunity', 'branch owner'];
        const isFranchiseQuestion = !isEnrollmentQuestion && franchiseKeywords.some(kw => lowerMessage.includes(kw));
        
        if (isFranchiseQuestion) {
          console.log(`[NUCLEAR OVERRIDE] Franchise question detected: "${message}"`);
          return res.json({ response: FRANCHISE_RESPONSE });
        }
      }
      
      // For non-franchise questions or /chat, use normal Librarian
      let response = await librarian.generateResponse(message, category as 'chat' | 'concierge');
      
      // FINAL SAFETY FILTER: Block ALL incorrect prices in /concierge
      if (category === 'concierge') {
        // List of WRONG prices that must be blocked
        const blockedPrices = [
          '1,995,000', '1995000', '1.995 million', '1.995m',
          '500,000', '500000',
          '1,500,000', '1500000', '1.5 million', '1.5m',
          '750,000', '750000',
          '200,000', '200000',
          '1,200,000', '1200000',
          '2,000,000', '2000000',
          '2.5 million', '2.5m',
          '350,000', '350000',
          '350', '200'
        ];
        
        for (const wrongPrice of blockedPrices) {
          // Create a case-insensitive regex for each wrong price
          const regex = new RegExp(
            wrongPrice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'gi'
          );
          if (regex.test(response)) {
            console.log(`[FINAL SAFETY FILTER] BLOCKED WRONG PRICE: ${wrongPrice}`);
            response = response.replace(regex, '₱660,000');
          }
        }
        
        // Also catch any PHP/₱ followed by numbers (except 660,000)
        const currencyPattern = /(?:PHP|₱)\s*([0-9,]+(?:\.[0-9]{2})?)/gi;
        response = response.replace(currencyPattern, (match, price) => {
          const cleanPrice = price.replace(/[^0-9]/g, '');
          if (cleanPrice !== '660000') {
            console.log(`[FINAL SAFETY FILTER] Replacing ${match} with ₱660,000`);
            return '₱660,000';
          }
          return match;
        });
        
        // Also catch written-out numbers like "one million nine hundred ninety five thousand"
        const writtenPattern = /(?:one|two|three|four|five|six|seven|eight|nine)\s+(?:million|thousand|hundred)/gi;
        if (writtenPattern.test(response)) {
          console.log(`[FINAL SAFETY FILTER] Detected written-out price, replacing with ₱660,000`);
          response = response.replace(writtenPattern, '₱660,000');
        }
        
        // EMERGENCY: If response contains "partnership" or "non-refundable", it's definitely wrong - replace entire response
        if (response.toLowerCase().includes('partnership') || response.toLowerCase().includes('non-refundable')) {
          console.log(`[EMERGENCY OVERRIDE] Detected hallucinated partnership/non-refundable response - replacing with correct franchise info`);
          return res.json({ response: FRANCHISE_RESPONSE });
        }
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
      res.json({ info: FRANCHISE_RESPONSE });
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
