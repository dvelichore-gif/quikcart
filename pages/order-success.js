// pages/order-success.js — Shown after successful Stripe payment

import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from './_app'

export default function OrderSuccess() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared && router.query.session_id) {
      clearCart()
      setCleared(true)
    }
  }, [router.query])

  const sessionId = router.query.session_id

  return (
    <>
      <Head><title>Order Confirmed! — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />

        <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px', textAlign: 'center' }}>

          {/* Success tick */}
          <div style={{ width: 72, height: 72, background: '#edf6f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>✅</div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1f2e', marginBottom: 8 }}>Order confirmed!</h1>
          <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
            Thank you for shopping with QuikCart. Your payment was successful and your Amazon order is being placed right now.
          </p>

          {/* What happens next */}
          <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: '20px 24px', marginBottom: 20, textAlign: 'left' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e', marginBottom: 14 }}>What happens next</h2>
            {[
              ['⚡', 'Amazon order placed',     'Your items are being ordered on Amazon right now — automatically.'],
              ['📧', 'Confirmation email sent',  'A full receipt with your order number has been emailed to you.'],
              ['📦', 'Dispatched from Amazon',   'Your order ships from Amazon's warehouse within 1–2 working days.'],
              ['🚚', 'Delivered to your door',   'Standard delivery 3–5 working days. Tracking number in your email.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1f2e', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ background: '#e8f1fb', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#14549a', lineHeight: 1.6 }}>
            Questions about your order? Email us at <strong>orders@quikcart.co.uk</strong>
          </div>

          {/* Refund reminder */}
          <div style={{ background: '#fff8e8', border: '1px solid #f0d080', borderRadius: 8, padding: '10px 14px', marginBottom: 24, fontSize: 12, color: '#5a3e00', lineHeight: 1.5 }}>
            Returns & refunds must be requested within 14 days of delivery by emailing orders@quikcart.co.uk. Refunds are issued at QuikCart's discretion.
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop"><button className="btn-primary">Continue shopping →</button></Link>
            <Link href="/"><button className="btn-blue">Back to home</button></Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
