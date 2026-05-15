import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { price } = req.body
    const cleanPrice = String(price).replace(/[^0-9]/g, '')
    if (cleanPrice === '660000') {
      res.json({ valid: true, message: 'Price is correct' })
    } else {
      res.json({ valid: false, message: 'Invalid price. The correct 3DBotics franchise cost is ₱660,000' })
    }
  } catch (e: any) {
    res.status(500).json({ error: 'Validation failed' })
  }
}
