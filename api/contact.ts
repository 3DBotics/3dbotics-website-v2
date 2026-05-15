import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Missing fields' })
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: '3DBotics Website <onboarding@resend.dev>',
      to: ['3dbotics.LC@gmail.com'],
      reply_to: email,
      subject: `New Contact Form Message from ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #7DD3D8;border-radius:12px;">
        <div style="background:#7DD3D8;padding:16px 20px;border-radius:8px 8px 0 0;margin:-20px -20px 20px -20px;">
          <h2 style="margin:0;color:#1a5a5a;">New Message from 3DBotics Website</h2>
        </div>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/><p><strong>Message:</strong></p>
        <p style="background:#f9f9f9;padding:14px;border-radius:8px;white-space:pre-wrap;">${message}</p>
      </div>`,
    })
    res.json({ success: true })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
}
