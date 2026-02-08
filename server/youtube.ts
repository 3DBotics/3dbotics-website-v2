/**
 * YouTube Video Integration
 * Search and embed educational videos
 * Note: Using YouTube Data API requires API key
 * Alternative: Generate search URLs for client-side embedding
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  channelTitle: string;
}

/**
 * Search for educational videos on YouTube
 * @param query - Search term (e.g., "circulatory system explained")
 * @param maxResults - Number of results (default: 3)
 * @returns Array of video objects with embed URLs
 */
export async function searchVideos(
  query: string,
  maxResults: number = 3
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured");
    return [];
  }

  try {
    const url = `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodeURIComponent(
      query + " educational"
    )}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`YouTube API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error("Error fetching videos from YouTube:", error);
    return [];
  }
}

/**
 * Generate YouTube search URL for client-side embedding
 * This is a fallback when API key is not available
 * @param query - Search term
 * @returns YouTube search URL
 */
export function generateYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " educational")}`;
}

/**
 * Get embed URL for a specific video ID
 * @param videoId - YouTube video ID
 * @returns Embed URL
 */
export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Generate curated video recommendations for common subjects
 * These are hand-picked educational videos
 */
export const curatedVideos: Record<string, YouTubeVideo[]> = {
  "circulatory system": [
    {
      id: "CWFyxn0qDEU",
      title: "Circulatory System - The Heart and Blood Vessels",
      description: "Learn about the circulatory system",
      thumbnail: "https://img.youtube.com/vi/CWFyxn0qDEU/mqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/CWFyxn0qDEU",
      channelTitle: "Crash Course",
    },
  ],
  "heart anatomy": [
    {
      id: "K-T8qu2M5Ug",
      title: "Heart Anatomy - How the Heart Works",
      description: "Detailed explanation of heart anatomy",
      thumbnail: "https://img.youtube.com/vi/K-T8qu2M5Ug/mqdefault.jpg",
      embedUrl: "https://www.youtube.com/embed/K-T8qu2M5Ug",
      channelTitle: "Nucleus Medical Media",
    },
  ],
  // Add more curated videos for common subjects
};

/**
 * Get videos for a subject (tries curated first, then API)
 * @param subject - Subject/topic to search for
 * @param maxResults - Number of results
 * @returns Array of video objects
 */
export async function getVideosForSubject(
  subject: string,
  maxResults: number = 3
): Promise<YouTubeVideo[]> {
  // Try curated videos first
  const subjectLower = subject.toLowerCase();
  if (curatedVideos[subjectLower]) {
    return curatedVideos[subjectLower].slice(0, maxResults);
  }

  // Fall back to API search
  return searchVideos(subject, maxResults);
}
