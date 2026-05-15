import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const FRANCHISE_RESPONSE = `✅ **3DBotics Franchise Package - ₱660,000 All-In**

**What's Included:**
• 5 Brand New 3D Printers (calibrated & ready to use)
• 7 Kilos of 3D Filament (assorted colors)
• 43" Smart TV for classroom instructions
• 5 Complete 3DPrinting Toolkits
• 5 Storage Devices for file transfers
• 3 Major Apps for 3D modeling & robotics
• Per Course Level Robot Projects for marketing & Display
• Best Selling "ready-to-3DPrint" Files as immediate products
• Official Marketing Materials (HD logos, editable posters)

**Plus:**
✅ INTENSIVE Training for Branch Owner + Facilitators
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from 3DBotics Main Office
✅ Instant ACCESS to state-of-the-art AI web-platform for branch operations
✅ Rental Space Security Deposit + 1st Two Months Rent

**Payment Schedule:**
📌 Reservation (10%) - ₱66,000
📌 After 2 Weeks (40%) - ₱264,000
📌 After 3 Weeks (50%) - ₱330,000

**Contact us:** 3DBotics.LC@gmail.com | 0995-836-2249`

async function callLibrarian(message: string, category: string): Promise<string> {
  // Fetch wisdom from Supabase
  const supabase = createClient(
    'https://vwooykjymtuzxlmzggas.supabase.co',
    process.env.LIBRARIAN_SUPABASE_KEY || ''
  )
  const { data: wisdom } = await supabase
    .from('wisdom_log')
    .select('question, answer')
    .eq('category', category)
    .limit(20)

  const wisdomContext = (wisdom ?? []).map((w: any) => `Q: ${w.question}\nA: ${w.answer}`).join('\n\n')

  const systemPrompt = category === 'concierge'
    ? `You are a friendly 3DBotics franchise concierge. The franchise package costs exactly ₱660,000 all-in. Never quote any other price. Use the wisdom below to answer questions.\n\n${wisdomContext}`
    : `You are LAILA, a helpful 3DBotics educational assistant. Use the wisdom below to answer questions.\n\n${wisdomContext}`

  const lmUrl = process.env.LM_STUDIO_URL || 'https://undeclarable-kandy-graspingly.ngrok-free.dev/v1/chat/completions'

  const response = await fetch(lmUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'local-model',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) throw new Error(`LM Studio error: ${response.status}`)
  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { message, category = 'chat' } = req.body
    if (!message) return res.status(400).json({ error: 'Message is required' })

    if (category === 'concierge') {
      const lower = message.toLowerCase()
      const enrollmentKw = ['tuition','enrollment','enroll','monthly fee','session fee','student fee','course fee','per month','per session']
      const isEnrollment = enrollmentKw.some(kw => lower.includes(kw))
      const franchiseKw = ['franchise','franchising','open a branch','franchise package','franchise cost','franchise fee','all-in cost','startup cost','initial investment','660','branch owner']
      const isFranchise = !isEnrollment && franchiseKw.some(kw => lower.includes(kw))
      if (isFranchise) return res.json({ response: FRANCHISE_RESPONSE })
    }

    let response = await callLibrarian(message, category)

    if (category === 'concierge') {
      const blockedPrices = ['1,995,000','500,000','1,500,000','750,000','200,000','2,000,000','350,000']
      for (const wrong of blockedPrices) {
        response = response.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '₱660,000')
      }
      if (response.toLowerCase().includes('partnership') || response.toLowerCase().includes('non-refundable')) {
        return res.json({ response: FRANCHISE_RESPONSE })
      }
    }

    res.json({ response })
  } catch (e: any) {
    // Fallback for LM Studio timeout/error
    if (req.body?.category === 'concierge') {
      return res.json({ response: FRANCHISE_RESPONSE })
    }
    res.status(500).json({ error: e.message ?? 'Internal server error' })
  }
}
