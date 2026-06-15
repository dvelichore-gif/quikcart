// pages/checkout.js — QuikCart Checkout Page
// ─────────────────────────────────────────────────────────
// Collects delivery details and redirects to Stripe Checkout
// ─────────────────────────────────────────────────────────

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from './_app'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Checkout() {
  const { items, subtotal, totalItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form,    setForm]    = useState({
    email: '', firstName: '', lastName: '',
    line1: '', line2: '', city: '', postcode: '', country: 'GB',
  })

  const delivery = subtotal >= 25 ? 0 : 2.99
  const total    = subtotal + delivery

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validate() {
    const required = ['email', 'firstName', 'lastName', 'line1', 'city', 'postcode']
    for (const field of required) {
      if (!form[field].trim()) return `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address'
    if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(form.postcode)) return 'Please enter a valid UK postcode'
    return null
  }

  async function handleCheckout() {
    setError('')
    const validationError = validate()
    if (validationError) return setError(validationError)
    if (items.length === 0) return setError('Your cart is empty')

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            emoji: i.emoji,
            price: i.price,
            quantity: i.quantity,
            amazon_asin: i.amazon_asin,
            amazon_url: i.amazon_url,
          })),
          customerEmail: form.email,
          deliveryAddress: {
            name: `${form.firstName} ${form.lastName}`,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            postcode: form.postcode,
            country: form.country,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        const stripe = await stripePromise
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Head><title>Checkout — QuikCart</title></Head>
        <div className="page-wrap">
          <Navbar />
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <h1 style={{ fontSize: 20, marginBottom: 10, color: '#1a1f2e' }}>Your cart is empty</h1>
            <Link href="/shop"><button className="btn-primary">Shop now</button></Link>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <>
      <Head><title>Checkout — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />

        {/* Breadcrumb */}
        <div style={{ background: 'white', borderBottom: '1px solid #e0e6ef', padding: '8px 16px', fontSize: 12, color: '#6b7280' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Link href="/">Home</Link> › <Link href="/cart">Cart</Link> › <span style={{ color: '#1a1f2e' }}>Checkout</span>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '20px auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* ── LEFT: Delivery form ── */}
          <div>

            {/* Step indicator */}
            <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: '14px 20px', marginBottom: 14, display: 'flex', gap: 0, alignItems: 'center' }}>
              {[['1','Delivery'],['2','Payment'],['3','Confirmation']].map(([n, label], i) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#1a6fc4' : '#e0e6ef', color: i === 0 ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{n}</div>
                    <span style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#1a1f2e' : '#6b7280' }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: '#e0e6ef', margin: '0 12px' }} />}
                </div>
              ))}
            </div>

            {/* Contact info */}
            <FormSection title="Contact information">
              <FormField label="Email address *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </FormSection>

            {/* Delivery address */}
            <FormSection title="Delivery address">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <FormField label="First name *" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" noMargin />
                <FormField label="Last name *"  name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Smith" noMargin />
              </div>
              <FormField label="Address line 1 *" name="line1" value={form.line1} onChange={handleChange} placeholder="123 High Street" />
              <FormField label="Address line 2 (optional)" name="line2" value={form.line2} onChange={handleChange} placeholder="Flat 4, Building B" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <FormField label="City / Town *" name="city" value={form.city} onChange={handleChange} placeholder="London" noMargin />
                <FormField label="Postcode *" name="postcode" value={form.postcode} onChange={handleChange} placeholder="EC1A 1BB" noMargin />
              </div>
              <FormField label="Country" name="country" value={form.country} onChange={handleChange} type="select" options={[['GB','United Kingdom'],['IE','Ireland']]} />
            </FormSection>

            {/* Payment note */}
            <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                🔒 Payment
              </h3>
              <div style={{ background: '#e8f1fb', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#14549a', lineHeight: 1.6 }}>
                After clicking "Pay now" you'll be taken to our secure Stripe payment page. Your card details are never stored on QuikCart — handled entirely by Stripe.
                <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>Accepts: Visa · Mastercard · Amex · Apple Pay · Google Pay</div>
              </div>
            </div>

            {/* Refund policy */}
            <div style={{ background: '#fff8e8', border: '1px solid #f0d080', borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 12, color: '#5a3e00', lineHeight: 1.6 }}>
              <strong>Returns & Refund Policy:</strong> All refund requests must be submitted to orders@quikcart.co.uk within 14 days of delivery. Refunds are processed at QuikCart's sole discretion. By placing an order you agree to these terms.
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fce8e8', border: '1px solid #f09595', borderRadius: 8, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#a32d2d', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '⏳ Redirecting to payment...' : '🔒 Pay now — £' + total.toFixed(2)}
            </button>

            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: '#6b7280' }}>
              Powered by <strong>Stripe</strong> — your payment is fully encrypted and secure
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, overflow: 'hidden', position: 'sticky', top: 105 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e0e6ef', background: '#f5f7fa' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e' }}>Your order ({totalItems} item{totalItems !== 1 ? 's' : ''})</h2>
            </div>
            <div style={{ padding: '14px 18px' }}>
              {/* Items */}
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f0f2f5' }}>
                  <div style={{ width: 44, height: 44, background: '#f5f7fa', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, border: '1px solid #e0e6ef', position: 'relative' }}>
                    {item.emoji}
                    <span style={{ position: 'absolute', top: -6, right: -6, background: '#1a6fc4', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#1a1f2e', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e02020', whiteSpace: 'nowrap' }}>£{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              {/* Totals */}
              <div style={{ marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#6b7280' }}>
                  <span>Subtotal</span><span>£{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: delivery === 0 ? '#81B29A' : '#6b7280' }}>
                  <span>Delivery</span><span>{delivery === 0 ? 'FREE' : `£${delivery.toFixed(2)}`}</span>
                </div>
                <div style={{ borderTop: '2px solid #1a1f2e', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e' }}>Total</span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#e02020' }}>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Auto-fulfillment notice */}
              <div style={{ marginTop: 14, background: '#e8f1fb', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#14549a', lineHeight: 1.5 }}>
                ⚡ <strong>Auto-fulfilled:</strong> Your Amazon order is placed the moment payment is confirmed. Tracking details emailed to you instantly.
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

/* ── FORM HELPER COMPONENTS ────────────────────────────── */
function FormSection({ title, children }) {
  return (
    <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e', marginBottom: 14 }}>{title}</h3>
      {children}
    </div>
  )
}

function FormField({ label, name, type = 'text', value, onChange, placeholder, options, noMargin }) {
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #dde3ec', borderRadius: 6, fontSize: 13, color: '#1a1f2e', fontFamily: 'inherit', outline: 'none', background: 'white' }
  return (
    <div style={{ marginBottom: noMargin ? 0 : 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1a1f2e', marginBottom: 4 }}>{label}</label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} style={inputStyle}>
          {options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle}
          onFocus={e  => e.target.style.borderColor = '#1a6fc4'}
          onBlur={e => e.target.style.borderColor = '#dde3ec'}
        />
      )}
    </div>
  )
}
