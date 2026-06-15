// components/Navbar.js
// ─────────────────────────────────────────────────────────
// Shared navigation bar — used on every page
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from '../pages/_app'

const CATEGORIES = ['Electronics', 'Home & Living', 'Wellness', 'Fashion', 'Sports', 'Books']

export default function Navbar() {
  const { totalItems } = useCart()
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      {/* ── TOP BAR ── */}
      <div style={{ background: '#1a1f2e', color: 'rgba(255,255,255,0.65)', fontSize: 11, padding: '5px 16px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span>🇬🇧 United Kingdom</span>
        <span>Free delivery on orders over £25</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 14 }}>
          <Link href="/orders" style={{ color: 'rgba(255,255,255,0.65)' }}>My Orders</Link>
          <span>|</span>
          <Link href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Help Centre</Link>
          <span>|</span>
          <span>£ GBP</span>
        </span>
      </div>

      {/* ── MAIN NAV ── */}
      <nav style={{ background: '#1a6fc4', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Logo */}
        <Link href="/" style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: -0.5, whiteSpace: 'nowrap', flexShrink: 0 }}>
          Quik<span style={{ color: '#ff6b00' }}>Cart</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 580, borderRadius: 6, overflow: 'hidden', border: '2px solid #ff6b00', background: 'white' }}>
          <select style={{ background: '#f3f3f3', border: 'none', borderRight: '1px solid #ddd', padding: '0 8px', fontSize: 11, color: '#1a1f2e', cursor: 'pointer', minWidth: 90 }}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, brands and more..."
            style={{ flex: 1, border: 'none', padding: '0 10px', fontSize: 13, outline: 'none', color: '#1a1f2e' }}
          />
          <button type="submit" style={{ background: '#ff6b00', border: 'none', padding: '0 14px', cursor: 'pointer', color: 'white', fontSize: 15, fontWeight: 700 }}>🔍</button>
        </form>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto', color: 'white', fontSize: 12, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, cursor: 'pointer' }}>
            <small style={{ fontSize: 10, opacity: 0.7 }}>Hello, sign in</small>
            <strong style={{ fontSize: 12 }}>Account</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, cursor: 'pointer' }}>
            <small style={{ fontSize: 10, opacity: 0.7 }}>My</small>
            <strong style={{ fontSize: 12 }}>Wishlist ♡</strong>
          </div>
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ff6b00', padding: '6px 12px', borderRadius: 6, color: 'white', textDecoration: 'none' }}>
            🛒
            <span style={{ fontWeight: 700, fontSize: 14 }}>{totalItems}</span>
            <span style={{ fontSize: 12 }}>Cart</span>
          </Link>
        </div>
      </nav>

      {/* ── SUBNAV ── */}
      <div style={{ background: '#14549a', display: 'flex', gap: 2, padding: '0 16px', overflowX: 'auto', height: 34, alignItems: 'center' }}>
        <Link href="/shop" style={snStyle}>☰ All Categories</Link>
        {CATEGORIES.map(cat => (
          <Link key={cat} href={`/shop?cat=${encodeURIComponent(cat)}`} style={snStyle}>
            {cat}
          </Link>
        ))}
        <Link href="/shop?badge=deal" style={{ ...snStyle, color: '#ff6b00' }}>⚡ Flash Deals</Link>
        <Link href="/shop?free=true"  style={snStyle}>🚚 Free Shipping</Link>
      </div>
    </>
  )
}

const snStyle = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: 12,
  padding: '0 10px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  height: 34,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 4,
  textDecoration: 'none',
}
