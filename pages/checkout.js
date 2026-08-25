// pages/checkout.js
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
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ email:'', firstName:'', lastName:'', line1:'', line2:'', city:'', postcode:'', country:'GB' })
  const delivery = subtotal >= 25 ? 0 : 2.99
  const total    = subtotal + delivery

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function validate() {
    for (const field of ['email','firstName','lastName','line1','city','postcode']) {
      if (!form[field].trim()) return `Please fill in your ${field.replace(/([A-Z])/g,' $1').toLowerCase()}`
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address'
    if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(form.postcode)) return 'Please enter a valid UK postcode'
    return null
  }

  async function handleCheckout() {
    setError('')
    const err = validate()
    if (err) return setError(err)
    if (items.length === 0) return setError('Your cart is empty')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id:i.id, name:i.name, emoji:i.emoji, description:i.description, price:i.price, quantity:i.quantity, ali_product_id:i.ali_product_id, ali_url:i.ali_url })),
          customerEmail: form.email,
          deliveryAddress: { name:`${form.firstName} ${form.lastName}`, line1:form.line1, line2:form.line2, city:form.city, postcode:form.postcode, country:form.country },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
      else { const stripe = await stripePromise; await stripe.redirectToCheckout({ sessionId: data.sessionId }) }
    } catch (err) { setError(err.message); setLoading(false) }
  }

  if (items.length === 0) return (
    <>
      <Head><title>Checkout — QuikCart</title></Head>
      <div className="page-wrap"><Navbar />
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
          <h1 style={{ fontSize:20, marginBottom:10 }}>Your cart is empty</h1>
          <Link href="/shop"><button className="btn-primary">Shop now</button></Link>
        </div>
        <Footer />
      </div>
    </>
  )

  return (
    <>
      <Head><title>Checkout — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:1100, margin:'20px auto', padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
          <div>
            <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'16px 20px', marginBottom:14 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Contact information</h3>
              <Field label="Email address *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'16px 20px', marginBottom:14 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Delivery address</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <Field label="First name *" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" noMargin />
                <Field label="Last name *"  name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Smith" noMargin />
              </div>
              <Field label="Address line 1 *" name="line1" value={form.line1} onChange={handleChange} placeholder="123 High Street" />
              <Field label="Address line 2 (optional)" name="line2" value={form.line2} onChange={handleChange} placeholder="Flat 4" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <Field label="City *"     name="city"     value={form.city}     onChange={handleChange} placeholder="London" noMargin />
                <Field label="Postcode *" name="postcode" value={form.postcode} onChange={handleChange} placeholder="EC1A 1BB" noMargin />
              </div>
            </div>
            <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'16px 20px', marginBottom:14 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>🔒 Payment</h3>
              <div style={{ background:'#e8f1fb', borderRadius:8, padding:'12px 14px', fontSize:13, color:'#14549a', lineHeight:1.6 }}>
                After clicking "Pay now" you will be taken to our secure Stripe payment page. Your card details are never stored on QuikCart.
                <div style={{ marginTop:8, fontSize:12, color:'#6b7280' }}>Accepts: Visa · Mastercard · Amex · Apple Pay · Google Pay</div>
              </div>
            </div>
            <div style={{ background:'#fff8e8', border:'1px solid #f0d080', borderRadius:8, padding:'12px 14px', marginBottom:14, fontSize:12, color:'#5a3e00', lineHeight:1.6 }}>
              <strong>Returns & Refund Policy:</strong> All refund requests must be submitted to quikcarttoday@gmail.com within 14 days of delivery. Refunds are processed at QuikCart sole discretion.
            </div>
            {error && <div style={{ background:'#fce8e8', border:'1px solid #f09595', borderRadius:8, padding:'12px 14px', marginBottom:14, fontSize:13, color:'#a32d2d', fontWeight:600 }}>⚠️ {error}</div>}
            <button onClick={handleCheckout} disabled={loading} className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:16, opacity:loading?0.7:1, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? '⏳ Redirecting to payment...' : `🔒 Pay now — £${total.toFixed(2)}`}
            </button>
            <div style={{ marginTop:10, textAlign:'center', fontSize:12, color:'#6b7280' }}>Powered by <strong>Stripe</strong> — your payment is fully encrypted</div>
          </div>
          <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, overflow:'hidden', position:'sticky', top:105 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid #e0e6ef', background:'#f5f7fa' }}>
              <h2 style={{ fontSize:15, fontWeight:700 }}>Your order ({totalItems} item{totalItems!==1?'s':''})</h2>
            </div>
            <div style={{ padding:'14px 18px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, paddingBottom:10, borderBottom:'1px solid #f0f2f5' }}>
                  <div style={{ width:44, height:44, background:'#f5f7fa', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, border:'1px solid #e0e6ef', overflow:'hidden', position:'relative' }}>
                    {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'contain' }} /> : item.emoji}
                    <span style={{ position:'absolute', top:-6, right:-6, background:'#1a6fc4', color:'white', borderRadius:'50%', width:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700 }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, color:'#1a1f2e', lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{item.name}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#e02020', whiteSpace:'nowrap' }}>£{(item.price*item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ marginTop:4 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, color:'#6b7280' }}><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13, color:delivery===0?'#81B29A':'#6b7280' }}><span>Delivery</span><span>{delivery===0?'FREE':`£${delivery.toFixed(2)}`}</span></div>
                <div style={{ borderTop:'2px solid #1a1f2e', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:15, fontWeight:700 }}>Total</span>
                  <span style={{ fontSize:17, fontWeight:800, color:'#e02020' }}>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

function Field({ label, name, type='text', value, onChange, placeholder, noMargin }) {
  return (
    <div style={{ marginBottom:noMargin?0:12 }}>
      <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#1a1f2e', marginBottom:4 }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:'100%', padding:'9px 12px', border:'1px solid #dde3ec', borderRadius:6, fontSize:13, color:'#1a1f2e', outline:'none', background:'white' }}
        onFocus={e => e.target.style.borderColor='#1a6fc4'} onBlur={e => e.target.style.borderColor='#dde3ec'} />
    </div>
  )
}
