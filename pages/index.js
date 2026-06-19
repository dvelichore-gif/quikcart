// pages/index.js — QuikCart Homepage
// ─────────────────────────────────────────────────────────

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import { getProducts } from '../lib/products'

const CATEGORIES = [
  { name: 'Electronics',   emoji: '💻',  slug: 'Electronics' },
  { name: 'Home & Living', emoji: '🏡',  slug: 'Home & Living' },
  { name: 'Wellness',      emoji: '🌿',  slug: 'Wellness' },
  { name: 'Fashion',       emoji: '👗',  slug: 'Fashion' },
  { name: 'Sports',        emoji: '⚽',  slug: 'Sports' },
  { name: 'Books',         emoji: '📚',  slug: 'Books' },
  { name: 'Gaming',        emoji: '🎮',  slug: 'Electronics' },
  { name: 'Gifts',         emoji: '🎁',  slug: 'Gifts' },
]

const ICON_CATS = [
  { emoji: '📱', label: 'Phones',  slug: 'Electronics' },
  { emoji: '💻', label: 'Laptops', slug: 'Electronics' },
  { emoji: '🍲', label: 'Kitchen', slug: 'Home & Living' },
  { emoji: '🌿', label: 'Wellness',slug: 'Wellness' },
  { emoji: '👟', label: 'Shoes',   slug: 'Fashion' },
  { emoji: '🏃', label: 'Sports',  slug: 'Sports' },
  { emoji: '📚', label: 'Books',   slug: 'Books' },
  { emoji: '🎁', label: 'Gifts',   slug: '' },
]

export async function getStaticProps() {
  const products = getProducts()
  return { props: { products } }
}

export default function Home({ products }) {
  const router = useRouter()
  const [toast, setToast] = useState('')

  const featured   = products.slice(0, 5)
  const bestSellers = products.slice(5, 10)
  const flashDeals = products.filter(p => p.badge === 'hot' || p.badge === 'deal').slice(0, 5)

  return (
    <>
      <Head>
        <title>QuikCart — Shop for anything, auto-delivered</title>
        <meta name="description" content="Browse endless products. We place your order automatically the moment you pay." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-wrap">
        <Navbar />

        {/* ── HERO SECTION ─────────────────────────────── */}
        <div style={{ background: '#1a6fc4', padding: '10px 16px', display: 'grid', gridTemplateColumns: '160px 1fr 185px', gap: 8, alignItems: 'start' }}>

          {/* Left: Category menu */}
          <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden' }}>
            {CATEGORIES.map(cat => (
              <div
                key={cat.name}
                onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat.slug || cat.name)}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', cursor: 'pointer', fontSize: 12, color: '#1a1f2e', borderBottom: '1px solid #f0f2f5', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = '#e8f1fb'}
                onMouseOut={e  => e.currentTarget.style.background = 'white'}
              >
                <span style={{ fontSize: 17 }}>{cat.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{cat.name}</div>
                  <div style={{ fontSize: 10, color: '#6b7280' }}>{cat.count} items</div>
                </div>
              </div>
            ))}
          </div>

          {/* Centre: Main banner + mini banners */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: '#e8f1fb', borderRadius: 10, padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 170, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 180, height: 180, background: 'rgba(26,111,196,0.07)', borderRadius: '50%' }} />
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#14549a', lineHeight: 1.2, marginBottom: 6 }}>Shop anything.<br />Auto-delivered.</h1>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 14, maxWidth: 260, lineHeight: 1.6 }}>Browse millions of products. We place your Amazon order instantly the moment you pay.</p>
                <button className="btn-primary" onClick={() => router.push('/shop')}>Shop now →</button>
              </div>
              <span style={{ fontSize: 70, zIndex: 1 }}>🛒</span>
            </div>

            {/* Mini deal cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {[
                { bg: '#e8f4fd', color: '#14549a', emoji: '💻', title: 'Electronics', sub: 'Up to 40% off', slug: 'Electronics' },
                { bg: '#fef3e2', color: '#854F0B', emoji: '🍲', title: 'Home deals',   sub: 'From £9.99',   slug: 'Home & Living' },
                { bg: '#edf6f1', color: '#085041', emoji: '🌿', title: 'Wellness',     sub: 'Top picks',    slug: 'Wellness' },
                { bg: '#fce8e8', color: '#a32d2d', emoji: '⚡', title: 'Flash sale',   sub: 'Ends tonight', slug: '' },
              ].map(b => (
                <div key={b.title} onClick={() => router.push(`/shop${b.slug ? `?cat=${encodeURIComponent(b.slug)}` : ''}`)}
                  style={{ background: b.bg, borderRadius: 10, padding: '12px 10px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e  => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{b.emoji}</span>
                  <div style={{ fontSize: 11, fontWeight: 700, color: b.color, marginBottom: 2 }}>{b.title}</div>
                  <div style={{ fontSize: 10, color: b.color, opacity: 0.75 }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Flash deals panel */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#e02020', color: 'white', borderRadius: '10px 10px 0 0', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>⚡ Flash Deals</span>
              <span style={{ fontSize: 11, background: 'rgba(0,0,0,0.2)', padding: '2px 7px', borderRadius: 4 }}>03:47:22</span>
            </div>
            <div style={{ background: 'white', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
              {flashDeals.map(p => (
                <div key={p.id} onClick={() => router.push(`/product/${p.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid #f0f2f5', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f5f7fa'}
                  onMouseOut={e  => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{p.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#1a1f2e', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div>
                      <span style={{ color: '#e02020', fontSize: 13, fontWeight: 700 }}>£{p.price}</span>
                      {p.original_price && <span style={{ fontSize: 10, color: '#6b7280', textDecoration: 'line-through', marginLeft: 4 }}>£{p.original_price}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TRUST STRIP ──────────────────────────────── */}
        <div style={{ background: 'white', borderBottom: '1px solid #e0e6ef', padding: '8px 16px', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[['🔒','Buyer Protection'],['⚡','Auto Fulfillment'],['📧','Instant email confirmation'],['🚚','Free delivery over £25'],['↩️','14-day easy returns']].map(([icon, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7280' }}>
              <span style={{ color: '#1a6fc4', fontSize: 15 }}>{icon}</span> {label}
            </span>
          ))}
        </div>

        {/* ── ICON CATEGORY ROW ────────────────────────── */}
        <div style={{ padding: '14px 16px 4px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1f2e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 4, height: 18, background: '#1a6fc4', borderRadius: 2 }} />
              Browse categories
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 8 }}>
              {ICON_CATS.map(ic => (
                <div key={ic.label} onClick={() => router.push(`/shop${ic.slug ? `?cat=${encodeURIComponent(ic.slug)}` : ''}`)}
                  style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: '10px 6px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#1a6fc4'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseOut={e  => { e.currentTarget.style.borderColor = '#e0e6ef'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span style={{ fontSize: 22, display: 'block', marginBottom: 4 }}>{ic.emoji}</span>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#1a1f2e' }}>{ic.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FEATURED FOR YOU ─────────────────────────── */}
        <Section title="Featured for you" link="/shop">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={msg => setToast(`✓ "${msg.slice(0,28)}..." added to cart`)} />)}
          </div>
        </Section>

        {/* ── PROMO BANNERS ────────────────────────────── */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <PromoCard bg="#1a6fc4" color="white" emoji="💻" title="Electronics Sale" sub="Up to 40% off top brands" slug="Electronics" />
            <PromoCard bg="#fff3ec" color="#ff6b00" emoji="🌿" title="Wellness Week" sub="Self-care essentials from £9" slug="Wellness" />
          </div>
        </div>

        {/* ── BEST SELLERS ─────────────────────────────── */}
        <Section title="Best sellers" link="/shop">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
            {bestSellers.map(p => <ProductCard key={p.id} product={p} onAddToCart={msg => setToast(`✓ "${msg.slice(0,28)}..." added to cart`)} />)}
          </div>
        </Section>

        {/* ── FLASH DEALS ──────────────────────────────── */}
        <Section title="⚡ Flash deals — ends soon" link="/shop?badge=deal">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
            {flashDeals.map(p => <ProductCard key={p.id} product={p} onAddToCart={msg => setToast(`✓ "${msg.slice(0,28)}..." added to cart`)} />)}
          </div>
        </Section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <div style={{ background: '#1a1f2e', padding: '32px 16px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 4 }}>How QuikCart works</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 24 }}>We handle everything — you just shop.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, maxWidth: 900, margin: '0 auto' }}>
            {[
              ['1','Browse & add to cart','Find products from our catalogue'],
              ['2','Secure Checkout',     'Pay via Stripe — encrypted end-to-end'],
              ['3','Order Placement',     'We place your order within seconds'],
              ['4','Email confirmation',  'Full receipt + tracking number sent instantly'],
            ].map(([n,t,d]) => (
              <div key={n} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '16px 12px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#ff6b00', marginBottom: 6 }}>{n}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}

/* ── HELPER COMPONENTS ───────────────────────────────────── */
function Section({ title, link, children }) {
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1f2e', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 4, height: 18, background: '#1a6fc4', borderRadius: 2 }} />
            {title}
          </h2>
          <Link href={link} style={{ fontSize: 12, color: '#1a6fc4' }}>See all →</Link>
        </div>
        {children}
      </div>
    </div>
  )
}

function PromoCard({ bg, color, emoji, title, sub, slug }) {
  const router = useRouter()
  return (
    <div onClick={() => router.push(`/shop?cat=${encodeURIComponent(slug)}`)}
      style={{ background: bg, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.15s' }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={e  => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 3 }}>{title}</h3>
        <p style={{ fontSize: 11, color, opacity: 0.75, marginBottom: 10 }}>{sub}</p>
        <button style={{ background: 'rgba(0,0,0,0.12)', color, border: 'none', padding: '6px 14px', borderRadius: 50, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Shop now</button>
      </div>
      <span style={{ fontSize: 44 }}>{emoji}</span>
    </div>
  )
}