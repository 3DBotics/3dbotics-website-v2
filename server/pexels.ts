/**
 * Pexels API Integration
 * Free stock photos for educational content
 * Docs: https://www.pexels.com/api/documentation/
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "YOUR_API_KEY_HERE";
const PEXELS_API_BASE = "https://api.pexels.com/v1";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
}

/**
 * Search for photos on Pexels
 * @param query - Search term (e.g., "circulatory system", "heart anatomy")
 * @param perPage - Number of results (default: 5, max: 80)
 * @returns Array of photo objects with URLs and metadata
 */
export async function searchPhotos(
  query: string,
  perPage: number = 5
): Promise<PexelsPhoto[]> {
  try {
    const url = `${PEXELS_API_BASE}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PexelsSearchResponse = await response.json();
    return data.photos;
  } catch (error) {
    console.error("Error fetching photos from Pexels:", error);
    return [];
  }
}

/**
 * Get curated photos (high-quality, hand-picked)
 * @param perPage - Number of results (default: 5)
 * @returns Array of curated photo objects
 */
export async function getCuratedPhotos(perPage: number = 5): Promise<PexelsPhoto[]> {
  try {
    const url = `${PEXELS_API_BASE}/curated?per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PexelsSearchResponse = await response.json();
    return data.photos;
  } catch (error) {
    console.error("Error fetching curated photos from Pexels:", error);
    return [];
  }
}
