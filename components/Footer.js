// components/Footer.js

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#1a1f2e', color: 'rgba(255,255,255,0.5)', padding: '32px 16px 20px', marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>
              Quik<span style={{ color: '#ff6b00' }}>Cart</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7 }}>Every order placed instantly the moment you pay.</p>
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Shop</h4>
            {['Electronics', 'Home & Living', 'Wellness', 'Fashion', 'Sports', 'Books'].map(c => (
              <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{c}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Help</h4>
            {['My Orders', 'Returns & Refunds', 'Delivery Info', 'Contact Us', 'FAQ'].map(l => (
              <Link key={l} href="#" style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Trust & Safety</h4>
            <div style={{ fontSize: 12, lineHeight: 1.9 }}>
              <div>🔒 Secure payments</div>
              <div>⚡ Auto fulfillment</div>
              <div>📧 Instant email confirmation</div>
              <div>🚚 Free UK delivery over £25</div>
              <div>↩️ 14-day return policy</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 11 }}>
          <span>© 2026 QuikCart. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 16 }}>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy Policy</Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms of Service</Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Cookie Policy</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
