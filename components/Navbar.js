// components/Navbar.js
// ─────────────────────────────────────────────────────────
// Shared navigation bar — used on every page
// ─────────────────────────────────────────────────────────

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart, useCurrency, CURRENCIES } from '../pages/_app'
import HelpCentreModal from './HelpCentreModal'

const CATEGORIES = ['Electronics', 'Home & Living', 'Wellness', 'Fashion', 'Sports', 'Books']

export default function Navbar() {
  const { totalItems } = useCart()
  const { currency, changeCurrency } = useCurrency()
  const [query, setQuery] = useState('')
  const [helpOpen, setHelpOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
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
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center', position: 'relative' }}>
          <Link href="/cart" style={{ color: 'rgba(255,255,255,0.65)' }}>My Orders</Link>
          <span>|</span>
          <span onClick={() => setHelpOpen(true)} style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>Help Centre</span>
          <span>|</span>
          <span style={{ position: 'relative' }}>
            <span onClick={() => setCurrencyOpen(o => !o)} style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
              {CURRENCIES[currency].symbol} {currency} ▾
            </span>
            {currencyOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 6,
                background: 'white', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                overflow: 'hidden', minWidth: 170, zIndex: 200,
              }}>
                {Object.entries(CURRENCIES).map(([code, info]) => (
                  <div
                    key={code}
                    onClick={() => { changeCurrency(code); setCurrencyOpen(false) }}
                    style={{
                      padding: '9px 14px', fontSize: 12, color: '#1a1f2e', cursor: 'pointer',
                      background: code === currency ? '#e8f1fb' : 'white',
                      fontWeight: code === currency ? 600 : 400,
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#f5f7fa'}
                    onMouseOut={e  => e.currentTarget.style.background = code === currency ? '#e8f1fb' : 'white'}
                  >
                    {info.symbol} {info.label}
                  </div>
                ))}
              </div>
            )}
          </span>
        </span>
      </div>

      {helpOpen && <HelpCentreModal onClose={() => setHelpOpen(false)} />}

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
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 2.3, cursor: 'pointer' }}>
            <strong style={{ fontSize: 16 }}>Sign in</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 2.3, cursor: 'pointer' }}>
            <strong style={{ fontSize: 16 }}>Wishlist</strong>
          </div>
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ff6b00', padding: '6px 12px', borderRadius: 6, color: 'white', textDecoration: 'none' }}>
            🛒
            <span style={{ fontWeight: 700, fontSize: 14 }}>{totalItems}</span>
            <span style={{ fontSize: 14 }}>Cart</span>
          </Link>
        </div>
      </nav>

      {/* ── SUBNAV ── */}
      <div style={{ background: '#14549a', display: 'flex', gap: 2, padding: '0 16px', overflowX: 'auto', height: 34, alignItems: 'center' }}>
        <span style={{ ...snStyle, cursor: 'default' }}>☰ Categories</span>
        {CATEGORIES.map(cat => (
          <Link key={cat} href={`/shop?cat=${encodeURIComponent(cat)}`} style={snStyle}>
            {cat}
          </Link>
        ))}
        <Link href="/shop?badge=deal" style={{ ...snStyle, color: '#ff6b00' }}>⚡ Flash Deals</Link>
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
