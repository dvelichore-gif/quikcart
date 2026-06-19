// pages/shop.js — QuikCart Shop Page
// ─────────────────────────────────────────────────────────

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import { getProducts } from '../lib/products'

const CATEGORIES = ['Electronics', 'Home & Living', 'Wellness', 'Fashion', 'Sports', 'Books']

export async function getStaticProps() {
  return { props: { products: getProducts() } }
}

export default function Shop({ products }) {
  const router  = useRouter()
  const [toast, setToast]   = useState('')
  const [search, setSearch] = useState('')
  const [cat,    setCat]    = useState('All')
  const [sort,   setSort]   = useState('featured')
  const [minP,   setMinP]   = useState('')
  const [maxP,   setMaxP]   = useState('')
  const [minRat, setMinRat] = useState(0)

  // Sync filters from URL query params
  useEffect(() => {
    if (router.query.q)   setSearch(router.query.q)
    if (router.query.cat) setCat(router.query.cat)
  }, [router.query])

  const filtered = useMemo(() => {
    let list = [...products]
    if (search)  list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    if (cat !== 'All') list = list.filter(p => p.category === cat)
    if (minP)    list = list.filter(p => p.price >= parseFloat(minP))
    if (maxP)    list = list.filter(p => p.price <= parseFloat(maxP))
    if (minRat)  list = list.filter(p => (p.rating || 0) >= minRat)
    if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a,b) => b.price - a.price)
    if (sort === 'rating')     list.sort((a,b) => (b.rating||0) - (a.rating||0))
    if (sort === 'reviews')    list.sort((a,b) => (b.reviews||0) - (a.reviews||0))
    return list
  }, [products, search, cat, sort, minP, maxP, minRat])

  return (
    <>
      <Head>
        <title>Shop — QuikCart</title>
        <meta name="description" content="Browse products on QuikCart" />
      </Head>

      <div className="page-wrap">
        <Navbar />

        {/* ── SHOP HEADER ──────────────────────────────── */}
        <div style={{ background: '#14549a', padding: '14px 16px', color: 'white' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              {cat === 'All' ? 'All Products' : cat}
            </h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{ flex: 1, minWidth: 180, padding: '8px 12px', border: 'none', borderRadius: 6, fontSize: 13, color: '#1a1f2e', fontFamily: 'inherit', outline: 'none' }}
              />
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ padding: '8px 12px', border: 'none', borderRadius: 6, fontSize: 13, color: '#1a1f2e', cursor: 'pointer', fontFamily: 'inherit', background: 'white' }}>
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low–High</option>
                <option value="price-desc">Price: High–Low</option>
                <option value="rating">Best rated</option>
                <option value="reviews">Most reviewed</option>
              </select>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginLeft: 'auto' }}>
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ── LAYOUT: SIDEBAR + GRID ───────────────────── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'start' }}>

          {/* Sidebar */}
          <aside style={{ background: 'white', padding: '16px 14px', borderRight: '1px solid #e0e6ef', minHeight: 600, position: 'sticky', top: 98 }}>

            <SbSection title="Category">
              <FilterBtn active={cat === 'All'} onClick={() => setCat('All')}>All</FilterBtn>
              {CATEGORIES.map(c => (
                <FilterBtn key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterBtn>
              ))}
            </SbSection>

            <SbSection title="Price range">
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <input type="number" value={minP} onChange={e => setMinP(e.target.value)} placeholder="£0"
                  style={{ flex: 1, padding: '5px 7px', border: '1px solid #dde3ec', borderRadius: 4, fontSize: 12, textAlign: 'center', fontFamily: 'inherit', color: '#1a1f2e' }} />
                <span style={{ color: '#6b7280', fontSize: 11 }}>–</span>
                <input type="number" value={maxP} onChange={e => setMaxP(e.target.value)} placeholder="£999"
                  style={{ flex: 1, padding: '5px 7px', border: '1px solid #dde3ec', borderRadius: 4, fontSize: 12, textAlign: 'center', fontFamily: 'inherit', color: '#1a1f2e' }} />
              </div>
            </SbSection>

            <SbSection title="Discount">
              <FilterBtn active={false} onClick={() => {}}>10%+ off</FilterBtn>
              <FilterBtn active={false} onClick={() => {}}>25%+ off</FilterBtn>
              <FilterBtn active={false} onClick={() => {}}>50%+ off</FilterBtn>
            </SbSection>

            </SbSection>

            {/* Reset */}
            {(cat !== 'All' || search || minP || maxP || minRat > 0) && (
              <button onClick={() => { setCat('All'); setSearch(''); setMinP(''); setMaxP(''); setMinRat(0) }}
                style={{ marginTop: 8, width: '100%', background: 'none', border: '1px solid #e0e6ef', borderRadius: 6, padding: '7px', fontSize: 12, color: '#6b7280', cursor: 'pointer', fontFamily: 'inherit' }}>
                ✕ Clear all filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div style={{ padding: '14px 16px', background: '#f5f7fa' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontSize: 16, marginBottom: 6 }}>No products found</h3>
                <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
                <button onClick={() => { setCat('All'); setSearch(''); setMinP(''); setMaxP(''); setMinRat(0) }}
                  style={{ marginTop: 16, background: '#1a6fc4', color: 'white', border: 'none', padding: '9px 20px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={msg => setToast(`✓ "${msg.slice(0,28)}..." added to cart`)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}

function SbSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', marginBottom: 7 }}>{title}</div>
      {children}
    </div>
  )
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left',
      padding: '5px 8px', border: 'none', borderRadius: 4,
      fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
      background: active ? '#1a6fc4' : 'none',
      color: active ? 'white' : '#1a1f2e',
      marginBottom: 2,
      transition: 'background 0.15s',
    }}>{children}</button>
  )
}
