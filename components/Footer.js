import { useState } from 'react'
import Link from 'next/link'
import HelpCentreModal from './HelpCentreModal'

export default function Footer() {
  const [helpOpen, setHelpOpen] = useState(false)
  return (
    <footer style={{ background:'#1a1f2e',color:'rgba(255,255,255,0.5)',padding:'32px 16px 20px',marginTop:40 }}>
      <div style={{ maxWidth:1200,margin:'0 auto' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:24,marginBottom:28 }}>
          <div>
            <div style={{ fontSize:24,fontWeight:800,color:'white',marginBottom:8 }}>Quik<span style={{ color:'#ff6b00' }}>Cart</span></div>
            <p style={{ fontSize:12,lineHeight:1.7 }}>Everything you need, delivered to your door.</p>
          </div>
          <div>
            <h4 style={{ color:'rgba(255,255,255,0.8)',fontSize:13,fontWeight:600,marginBottom:10 }}>Shop</h4>
            {['Electronics','Home & Living','Wellness','Fashion','Sports','Books'].map(c => (
              <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} style={{ display:'block',fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:5 }}>{c}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color:'rgba(255,255,255,0.8)',fontSize:13,fontWeight:600,marginBottom:10 }}>Help</h4>
            <Link href="/cart" style={{ display:'block',fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:5 }}>My Orders</Link>
            <span onClick={() => setHelpOpen(true)} style={{ display:'block',fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:5,cursor:'pointer' }}>Contact Us</span>
          </div>
          <div>
            <h4 style={{ color:'rgba(255,255,255,0.8)',fontSize:13,fontWeight:600,marginBottom:10 }}>Trust & Safety</h4>
            <div style={{ fontSize:12,lineHeight:1.9 }}>
              <div>🔒 Secure payments (Stripe)</div>
              <div>📧 Instant email confirmation</div>
              <div>🚚 Free UK delivery over £25</div>
              <div>↩️ 14-day return policy</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:16,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10,fontSize:11 }}>
          <span>© 2025 QuikCart. All rights reserved.</span>
          <span style={{ display:'flex',gap:16 }}>
            <Link href="/privacy-policy" style={{ color:'rgba(255,255,255,0.4)' }}>Privacy Policy</Link>
            <Link href="/terms-of-service" style={{ color:'rgba(255,255,255,0.4)' }}>Terms of Service</Link>
            <Link href="/cookie-policy" style={{ color:'rgba(255,255,255,0.4)' }}>Cookie Policy</Link>
          </span>
        </div>
      </div>
      {helpOpen && <HelpCentreModal onClose={() => setHelpOpen(false)} />}
    </footer>
  )
}
