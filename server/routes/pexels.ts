import { Router } from "express";
import { searchPhotos } from "../pexels";

const router = Router();

router.get("/search", async (req, res) => {
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

export default router;
