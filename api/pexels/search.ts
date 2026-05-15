import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { query, per_page = '5' } = req.query
    if (!query || typeof query !== 'string') return res.status(400).json({ error: 'Query parameter is required' })
    const perPage = parseInt(per_page as string, 10)
    if (isNaN(perPage) || perPage < 1 || perPage > 80) return res.status(400).json({ error: 'per_page must be between 1 and 80' })
    const apiKey = process.env.PEXELS_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Pexels API key not configured' })
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: { Authorization: apiKey }
    })
    if (!response.ok) return res.status(response.status).json({ error: 'Pexels API error' })
    const data = await response.json()
    res.json(data.photos)
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch images from Pexels' })
  }
}
