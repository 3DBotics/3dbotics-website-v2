import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'crypto'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { studentId, message, response, category } = req.body
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' })
    // In-memory log (stateless in serverless — just acknowledge)
    const id = randomUUID()
    res.json({ success: true, id })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
}
