import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, message } = req.body
  if (!message?.trim()) return res.status(400).json({ error: 'Message empty' })
  try {
    await resend.emails.send({
      from: `QuikCart Help <${process.env.EMAIL_FROM}>`,
      to: 'quikcarttoday@gmail.com',
      reply_to: email || undefined,
      subject: `Help Centre message from ${name || 'a customer'}`,
      html: `<div style="font-family:sans-serif"><h2>Help Centre Message</h2><p><strong>From:</strong> ${name||'Not given'}</p><p><strong>Email:</strong> ${email||'Not given'}</p><hr/><p>${message}</p></div>`,
    })
    res.status(200).json({ success: true })
  } catch (err) { res.status(500).json({ error: 'Failed to send' }) }
}
