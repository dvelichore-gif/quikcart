// pages/cookie-policy.js
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CookiePolicy() {
  return (
    <>
      <Head><title>Cookie Policy — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:760, margin:'32px auto', padding:'0 16px' }}>
          <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, padding:'32px 36px' }}>
            <h1 style={{ fontSize:24, fontWeight:800, color:'#1a1f2e', marginBottom:6 }}>Cookie Policy</h1>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:28 }}>Last updated: January 2025</p>
            {[
              ['What are cookies?', 'Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences and function correctly.'],
              ['What cookies do we use?', 'QuikCart only uses essential cookies that are strictly necessary for the website to function. These include session cookies that remember the contents of your shopping cart while you browse, and security cookies used by our payment provider Stripe to protect against fraud.'],
              ['What we do NOT use', 'We do not use advertising cookies, tracking cookies, or analytics cookies that monitor your behaviour across other websites. We do not share cookie data with third parties for marketing purposes.'],
              ['Managing cookies', 'You can control cookies through your browser settings. However, disabling essential cookies may prevent your shopping cart from working correctly. For help managing cookies, visit the help section of your browser.'],
              ['Contact', 'If you have any questions about our use of cookies, contact us at quikcarttoday@gmail.com.'],
            ].map(([title, body]) => (
              <div key={title} style={{ marginBottom:24 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:'#1a1f2e', marginBottom:8 }}>{title}</h2>
                <p style={{ fontSize:13, color:'#444', lineHeight:1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
