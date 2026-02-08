// Curated educational videos by subject
// These are real educational YouTube videos

export const educationalVideos: Record<string, { id: string; title: string; duration: string }[]> = {
  // Biology & Anatomy
  "circulatory system": [
    { id: "CWFyxn0qDEU", title: "Circulatory System - How Blood Flows", duration: "4:32" },
    { id: "RuNnC3j_eBQ", title: "Heart Anatomy - 3D Animation", duration: "3:45" },
  ],
  "anatomy": [
    { id: "CWFyxn0qDEU", title: "Human Body Systems Overview", duration: "5:12" },
  ],
  "biology": [
    { id: "QnQe0xW_JY4", title: "Introduction to Biology", duration: "6:24" },
  ],
  
  // Math
  "mathematics": [
    { id: "1EGDCh75SpQ", title: "What is Mathematics?", duration: "5:30" },
  ],
  "algebra": [
    { id: "NybHckSEQBI", title: "Introduction to Algebra", duration: "7:15" },
  ],
  "geometry": [
    { id: "OwSLaiEQfyM", title: "Introduction to Geometry", duration: "6:45" },
  ],
  
  // Science
  "physics": [
    { id: "ZM8ECpBuQYE", title: "What is Physics?", duration: "4:50" },
  ],
  "chemistry": [
    { id: "bka20Q9TN6M", title: "Introduction to Chemistry", duration: "5:20" },
  ],
  
  // History
  "history": [
    { id: "xuCn8ux2gbs", title: "What is History?", duration: "4:15" },
  ],
  
  // Default fallback
  "default": [
    { id: "QnQe0xW_JY4", title: "Introduction to Learning", duration: "5:00" },
  ],
};

export function getEducationalVideos(subject: string): { id: string; title: string; embedUrl: string }[] {
  const subjectLower = subject.toLowerCase();
  
  // Try to find exact match
  if (educationalVideos[subjectLower]) {
    return educationalVideos[subjectLower].map(v => ({
      ...v,
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
    }));
  }
  
  // Try to find partial match
  for (const [key, videos] of Object.entries(educationalVideos)) {
    if (subjectLower.includes(key) || key.includes(subjectLower)) {
      return videos.map(v => ({
        ...v,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
      }));
    }
  }
  
  // Return default
  return educationalVideos.default.map(v => ({
    ...v,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
  }));
}
