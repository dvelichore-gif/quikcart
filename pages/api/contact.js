// pages/api/contact.js
// ─────────────────────────────────────────────────────────
// Receives Help Centre messages from customers and emails
// them straight to the QuikCart owner's inbox.
// ─────────────────────────────────────────────────────────

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, message } = req.body

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' })
  }

  try {
    await resend.emails.send({
      from: `QuikCart Help Centre <${process.env.EMAIL_FROM}>`,
      to: 'quikcarttoday@gmail.com',
      reply_to: email || undefined,
      subject: `New Help Centre message from ${name || 'a customer'}`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1a6fc4;padding:16px 22px;border-radius:10px 10px 0 0">
            <span style="font-size:20px;font-weight:800;color:white">Quik<span style="color:#ff6b00">Cart</span></span>
            <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px">New Help Centre message</div>
          </div>
          <div style="background:white;border:1px solid #e0e6ef;border-top:none;border-radius:0 0 10px 10px;padding:22px">
            <table cellpadding="0" cellspacing="0" width="100%" style="font-size:13px;color:#1a1f2e">
              <tr><td style="padding:4px 0;color:#6b7280;width:80px">From</td><td style="padding:4px 0;font-weight:600">${name || 'Not provided'}</td></tr>
              <tr><td style="padding:4px 0;color:#6b7280">Email</td><td style="padding:4px 0;font-weight:600">${email || 'Not provided'}</td></tr>
            </table>
            <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f0f2f5">
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Message</div>
              <div style="font-size:14px;color:#1a1f2e;line-height:1.6;white-space:pre-wrap">${message}</div>
            </div>
          </div>
        </div>
      `,
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact email failed:', err)
    res.status(500).json({ error: 'Failed to send message. Please try again.' })
  }
}
