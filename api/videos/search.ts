import type { VercelRequest, VercelResponse } from '@vercel/node'

const videoDatabase: Record<string, any[]> = {
  default: [
    { id: '1', title: '3D Printing Basics', url: 'https://www.youtube.com/watch?v=GJ98Lydc54k', thumbnail: 'https://img.youtube.com/vi/GJ98Lydc54k/mqdefault.jpg', channel: '3DBotics' },
    { id: '2', title: 'Introduction to Robotics', url: 'https://www.youtube.com/watch?v=_v8befkjnrI', thumbnail: 'https://img.youtube.com/vi/_v8befkjnrI/mqdefault.jpg', channel: '3DBotics' },
  ]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { subject } = req.query
    if (!subject || typeof subject !== 'string') return res.status(400).json({ error: 'Subject parameter is required' })
    const videos = videoDatabase[subject.toLowerCase()] ?? videoDatabase.default
    res.json(videos)
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch educational videos' })
  }
}
