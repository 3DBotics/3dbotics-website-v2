import { describe, it, expect } from "vitest";
import { searchPhotos } from "./pexels";

describe("Pexels API Integration", () => {
  it("should fetch photos with valid API key", async () => {
    const photos = await searchPhotos("education", 1);
    
    expect(photos).toBeDefined();
    expect(Array.isArray(photos)).toBe(true);
    
    if (photos.length > 0) {
      const photo = photos[0];
      expect(photo).toHaveProperty("id");
      expect(photo).toHaveProperty("src");
      expect(photo.src).toHaveProperty("medium");
      expect(photo.src.medium).toMatch(/^https:\/\//);
    }
  }, 10000); // 10 second timeout for API call
});
