// pages/orders.js — My Orders page
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Orders() {
  return (
    <>
      <Head><title>My Orders — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:760, margin:'40px auto', padding:'0 16px' }}>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1f2e', marginBottom:6 }}>My Orders</h1>
          <p style={{ fontSize:13, color:'#6b7280', marginBottom:24 }}>
            To check your order status, please use the order number from your confirmation email and contact us at quikcarttoday@gmail.com
          </p>

          <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'28px 24px', textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#1a1f2e', marginBottom:8 }}>Track your order</h2>
            <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.7, marginBottom:20, maxWidth:400, margin:'0 auto 20px' }}>
              Once your order is dispatched you will receive a tracking number by email. You can use that number to track your delivery directly.
            </p>
            <div style={{ background:'#e8f1fb', borderRadius:8, padding:'14px 18px', fontSize:13, color:'#14549a', lineHeight:1.6, marginBottom:20, textAlign:'left' }}>
              <strong>Have a question about your order?</strong><br />
              Email us at <strong>quikcarttoday@gmail.com</strong> with your order number and we will get back to you within 24 hours.
            </div>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/shop"><button className="btn-primary">Continue shopping →</button></Link>
              <Link href="/"><button className="btn-blue">Back to home</button></Link>
            </div>
          </div>

          <div style={{ marginTop:20, background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'20px 24px' }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'#1a1f2e', marginBottom:14 }}>Delivery information</h3>
            {[
              ['📦','Standard delivery','7–14 working days'],
              ['📧','Tracking email','Sent once your order is dispatched'],
              ['↩️','Returns window','14 days from delivery — contact us first'],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'center' }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1a1f2e' }}>{title}</div>
                  <div style={{ fontSize:12, color:'#6b7280' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
