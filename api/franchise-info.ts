import type { VercelRequest, VercelResponse } from '@vercel/node'

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
✅ INTENSIVE Training for Branch Owner + Facilitators (face-to-face and weekly Zoom)
✅ Full access to replicable module outlines, guides, and manuals
✅ Lifetime tech and business support from 3DBotics Main Office
✅ Instant ACCESS to state-of-the-art AI web-platform for branch operations
✅ Rental Space Security Deposit
✅ 1st Two Months Rent fee

**Payment Schedule:**
📌 **Reservation (10%) - ₱66,000** — Secures your promo and city target
📌 **After 2 Weeks (40%) - ₱264,000** — Equipment placement begins
📌 **After 3 Weeks (50%) - ₱330,000** — Full payment before delivery of equipment

**Contact us:** 3DBotics.LC@gmail.com | 0995-836-2249`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ info: FRANCHISE_RESPONSE })
}
