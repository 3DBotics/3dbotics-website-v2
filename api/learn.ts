import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { category, question, answer } = req.body
    if (!category || !question || !answer) return res.status(400).json({ error: 'Category, question, and answer are required' })
    if (category === 'concierge') {
      const priceMatch = answer.match(/[₱PHP]\s*([0-9,]+)/)
      if (priceMatch) {
        const price = priceMatch[1].replace(/,/g, '')
        if (price !== '660000') return res.status(400).json({ error: `Invalid price. The 3DBotics franchise cost is ₱660,000` })
      }
    }
    const supabase = createClient(
      'https://vwooykjymtuzxlmzggas.supabase.co',
      process.env.LIBRARIAN_SUPABASE_KEY || ''
    )
    await supabase.from('wisdom_log').insert({ category, question, answer, created_at: new Date().toISOString() })
    res.json({ success: true, message: 'Wisdom saved successfully!' })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
