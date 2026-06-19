// pages/product/[id].js — QuikCart Product Detail Page

import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import Toast from '../../components/Toast'
import { useCart } from '../_app'
import { getProducts, getProductById } from '../../lib/products'

export async function getStaticPaths() {
  const products = getProducts()
  return {
    paths: products.map(p => ({ params: { id: p.id } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const product  = getProductById(params.id)
  const related  = getProducts().filter(p => p.category === product?.category && p.id !== params.id).slice(0, 5)
  return { props: { product, related } }
}

export default function ProductPage({ product, related }) {
  const { addItem } = useCart()
  const [qty,   setQty]   = useState(1)
  const [toast, setToast] = useState('')

  if (!product) return <div>Product not found</div>

  const save = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0

  function handleAdd() {
    addItem(product, qty)
    setToast(`✓ "${product.name.slice(0, 28)}..." added to cart`)
  }

  return (
    <>
      <Head>
        <title>{product.name} — QuikCart</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="page-wrap">
        <Navbar />

        {/* Breadcrumb */}
        <div style={{ background: 'white', borderBottom: '1px solid #e0e6ef', padding: '8px 16px', fontSize: 12, color: '#6b7280' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Link href="/">Home</Link> › <Link href="/shop">Shop</Link> › <Link href={`/shop?cat=${encodeURIComponent(product.category)}`}>{product.category}</Link> › <span style={{ color: '#1a1f2e' }}>{product.name.slice(0, 40)}...</span>
          </div>
        </div>

        {/* ── MAIN PRODUCT SECTION ─────────────────────── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 24 }}>

            {/* LEFT: Product image */}
            <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 120, display: 'block', marginBottom: 16 }}>{product.emoji}</span>
                {save > 0 && (
                  <span style={{ background: '#fff0f0', color: '#e02020', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 4 }}>
                    Save {save}% — was £{product.original_price}
                  </span>
                )}
              </div>
            </div>

            {/* CENTRE: Product details */}
            <div>
              {product.badge && (
                <span className={`badge badge-${product.badge === 'best seller' ? 'best' : product.badge}`} style={{ marginBottom: 8, display: 'inline-block' }}>
                  {product.badge === 'best seller' ? 'Best Seller' : product.badge === 'hot' ? 'Hot Deal' : product.badge === 'new' ? 'New' : 'Deal'}
                </span>
              )}
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a1f2e', lineHeight: 1.3, marginBottom: 10 }}>{product.name}</h1>

              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13 }}>
                <span style={{ color: '#ff6b00', fontSize: 16 }}>{'★'.repeat(Math.floor(product.rating || 4))}{'☆'.repeat(5 - Math.floor(product.rating || 4))}</span>
                <span style={{ color: '#1a6fc4' }}>{product.rating}</span>
                <span style={{ color: '#6b7280' }}>({(product.reviews || 0).toLocaleString()} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #e0e6ef' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#e02020' }}>£{product.price}</span>
                {product.original_price && (
                  <span style={{ fontSize: 15, color: '#6b7280', textDecoration: 'line-through', marginLeft: 8 }}>£{product.original_price}</span>
                )}
                {save > 0 && <span style={{ marginLeft: 8, fontSize: 13, color: '#e02020', fontWeight: 600 }}>({save}% off)</span>}
              </div>

              {/* Delivery info */}
              <div style={{ background: '#e8f1fb', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
                <div style={{ color: '#14549a', fontWeight: 600, marginBottom: 4 }}>🚚 Delivery</div>
                <div style={{ color: '#444' }}>
                  {product.price >= 25
                    ? '✓ FREE Standard delivery — Estimated 3–5 Working Days'
                    : '£2.99 standard delivery — or FREE on orders over £25'}
                </div>
                <div style={{ color: '#444', marginTop: 4 }}>📦  Dispatched instantly when you pay</div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#1a1f2e' }}>About this item</h2>
                <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7 }}>{product.description}</p>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 14 }}>
                {['Ordered the Moment you Pay', 'Full Email Confirmation with tracking number', '14-day return policy via QuikCart support'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#1a1f2e', alignItems: 'flex-start' }}>
                    <span style={{ color: '#81B29A', flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>

              {/* Category tag */}
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Category: <Link href={`/shop?cat=${encodeURIComponent(product.category)}`} style={{ color: '#1a6fc4' }}>{product.category}</Link>
              </div>
            </div>

            {/* RIGHT: Buy box */}
            <div style={{ background: 'white', border: '1px solid #e0e6ef', borderRadius: 10, padding: '18px 16px', alignSelf: 'start', position: 'sticky', top: 105 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#e02020', marginBottom: 4 }}>£{product.price}</div>
              {product.original_price && <div style={{ fontSize: 12, color: '#6b7280', textDecoration: 'line-through', marginBottom: 8 }}>£{product.original_price}</div>}

              <div style={{ fontSize: 12, color: '#81B29A', fontWeight: 600, marginBottom: 12 }}>✓ In stock · Free delivery</div>

              {/* Quantity selector */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 5 }}>Quantity:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 32, height: 32, border: '1px solid #e0e6ef', borderRadius: 4, background: 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontSize: 15, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    style={{ width: 32, height: 32, border: '1px solid #e0e6ef', borderRadius: 4, background: 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
              </div>

              <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 8, padding: '11px' }}>
                🛒 Add to cart
              </button>
              <Link href="/checkout">
                <button onClick={() => addItem(product, qty)} className="btn-blue" style={{ width: '100%', padding: '11px' }}>
                  Buy now
                </button>
              </Link>

              {/* Trust signals */}
              <div style={{ marginTop: 14, borderTop: '1px solid #e0e6ef', paddingTop: 12 }}>
                {[['🔒','Secure Payment'],['⚡','Order placed instantly'],['📧','Email confirmation sent to you'],['↩️','14-day return policy']].map(([icon, label]) => (
                  <div key={label} style={{ display: 'flex', gap: 7, marginBottom: 5, fontSize: 11, color: '#6b7280', alignItems: 'center' }}>
                    <span>{icon}</span> {label}
                  </div>
                ))}
              </div>

              {/* Refund notice */}
              <div style={{ marginTop: 10, background: '#fff8e8', border: '1px solid #f0d080', borderRadius: 6, padding: '8px 10px', fontSize: 11, color: '#5a3e00', lineHeight: 1.5 }}>
                Refunds processed at QuikCart's discretion. Contact orders@quikcart.co.uk within 14 days.
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ─────────────────────────── */}
        {related.length > 0 && (
          <div style={{ padding: '0 16px 20px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ display: 'inline-block', width: 4, height: 18, background: '#1a6fc4', borderRadius: 2 }} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1f2e' }}>Other products</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={msg => setToast(`✓ "${msg.slice(0,28)}..." added to cart`)} />)}
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
