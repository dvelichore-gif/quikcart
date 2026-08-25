import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import Toast from '../../components/Toast'
import { useCart, useCurrency } from '../_app'
import { getProducts, getProductById } from '../../lib/products'

export async function getStaticPaths() {
  const products = await getProducts()
  return { paths: products.map(p => ({ params: { id: String(p.id) } })), fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const product = await getProductById(params.id)
  const all     = await getProducts()
  const related = all.filter(p => p.category === product?.category && String(p.id) !== params.id).slice(0, 5)
  return { props: { product, related }, revalidate: 60 }
}

export default function ProductPage({ product, related }) {
  const { addItem }    = useCart()
  const { formatPrice } = useCurrency()
  const [qty, setQty]   = useState(1)
  const [toast, setToast] = useState('')

  if (!product) return <div style={{ padding:40, textAlign:'center' }}>Product not found</div>

  const save = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0

  return (
    <>
      <Head><title>{product.name} — QuikCart</title><meta name="description" content={product.description} /></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ background:'white',borderBottom:'1px solid #e0e6ef',padding:'8px 16px',fontSize:12,color:'#6b7280' }}>
          <div style={{ maxWidth:1200,margin:'0 auto' }}>
            <Link href="/">Home</Link> › <Link href="/shop">Shop</Link> › {product.name.slice(0,40)}...
          </div>
        </div>

        <div style={{ maxWidth:1200,margin:'0 auto',padding:'20px 16px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 280px',gap:24 }}>
            {/* Image */}
            <div style={{ background:'white',border:'1px solid #e0e6ef',borderRadius:10,padding:24,display:'flex',alignItems:'center',justifyContent:'center',minHeight:340 }}>
              {product.image_url
                ? <img src={product.image_url} alt={product.name} style={{ maxWidth:'100%',maxHeight:300,objectFit:'contain' }} />
                : <span style={{ fontSize:120 }}>{product.emoji||'📦'}</span>
              }
            </div>

            {/* Details */}
            <div>
              <h1 style={{ fontSize:20,fontWeight:700,color:'#1a1f2e',lineHeight:1.3,marginBottom:10 }}>{product.name}</h1>
              <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12,fontSize:13 }}>
                <span style={{ color:'#ff6b00',fontSize:16 }}>{'★'.repeat(Math.floor(product.rating||4))}{'☆'.repeat(5-Math.floor(product.rating||4))}</span>
                <span style={{ color:'#1a6fc4' }}>{product.rating}</span>
                <span style={{ color:'#6b7280' }}>({(product.reviews||0).toLocaleString()} reviews)</span>
              </div>
              <div style={{ marginBottom:14,paddingBottom:14,borderBottom:'1px solid #e0e6ef' }}>
                <span style={{ fontSize:28,fontWeight:800,color:'#e02020' }}>{formatPrice(product.price)}</span>
                {product.original_price && <span style={{ fontSize:15,color:'#6b7280',textDecoration:'line-through',marginLeft:8 }}>{formatPrice(product.original_price)}</span>}
                {save > 0 && <span style={{ marginLeft:8,fontSize:13,color:'#e02020',fontWeight:600 }}>({save}% off)</span>}
              </div>
              <div style={{ background:'#e8f1fb',borderRadius:8,padding:'10px 14px',marginBottom:14,fontSize:13 }}>
                <div style={{ color:'#14549a',fontWeight:600,marginBottom:4 }}>🚚 Delivery</div>
                <div style={{ color:'#444' }}>{product.price >= 25 ? '✓ FREE standard delivery — 7–14 working days' : '£2.99 delivery — or FREE on orders over £25'}</div>
              </div>
              {product.description && (
                <div style={{ marginBottom:16 }}>
                  <h2 style={{ fontSize:15,fontWeight:700,marginBottom:8,color:'#1a1f2e' }}>About this item</h2>
                  <p style={{ fontSize:13,color:'#444',lineHeight:1.7 }}>{product.description}</p>
                </div>
              )}
              <div style={{ fontSize:12,color:'#6b7280' }}>
                Category: <Link href={`/shop?cat=${encodeURIComponent(product.category)}`} style={{ color:'#1a6fc4' }}>{product.category}</Link>
              </div>
            </div>

            {/* Buy box */}
            <div style={{ background:'white',border:'1px solid #e0e6ef',borderRadius:10,padding:'18px 16px',alignSelf:'start',position:'sticky',top:105 }}>
              <div style={{ fontSize:24,fontWeight:800,color:'#e02020',marginBottom:4 }}>{formatPrice(product.price)}</div>
              {product.original_price && <div style={{ fontSize:12,color:'#6b7280',textDecoration:'line-through',marginBottom:8 }}>{formatPrice(product.original_price)}</div>}
              <div style={{ fontSize:12,color:'#81B29A',fontWeight:600,marginBottom:12 }}>✓ In stock · Free delivery</div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:12,color:'#6b7280',marginBottom:5 }}>Quantity:</div>
                <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width:32,height:32,border:'1px solid #e0e6ef',borderRadius:4,background:'white',fontSize:16,cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:15,fontWeight:600,minWidth:24,textAlign:'center' }}>{qty}</span>
                  <button onClick={() => setQty(q => q+1)}             style={{ width:32,height:32,border:'1px solid #e0e6ef',borderRadius:4,background:'white',fontSize:16,cursor:'pointer' }}>+</button>
                </div>
              </div>
              <button onClick={() => { addItem(product, qty); setToast(`✓ "${product.name.slice(0,28)}..." added`) }} className="btn-primary" style={{ width:'100%',justifyContent:'center',marginBottom:8,padding:11 }}>
                🛒 Add to cart
              </button>
              <Link href="/checkout"><button onClick={() => addItem(product, qty)} className="btn-blue" style={{ width:'100%',padding:11 }}>Buy now</button></Link>
              <div style={{ marginTop:14,borderTop:'1px solid #e0e6ef',paddingTop:12 }}>
                {[['🔒','Secure payment via Stripe'],['📧','Email confirmation sent to you'],['↩️','14-day return policy']].map(([icon,label]) => (
                  <div key={label} style={{ display:'flex',gap:7,marginBottom:5,fontSize:11,color:'#6b7280',alignItems:'center' }}><span>{icon}</span>{label}</div>
                ))}
              </div>
              <div style={{ marginTop:10,background:'#fff8e8',border:'1px solid #f0d080',borderRadius:6,padding:'8px 10px',fontSize:11,color:'#5a3e00',lineHeight:1.5 }}>
                Refunds at QuikCart's discretion. Contact us within 14 days of delivery.
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ padding:'0 16px 20px' }}>
            <div style={{ maxWidth:1200,margin:'0 auto' }}>
              <h2 style={{ fontSize:16,fontWeight:700,color:'#1a1f2e',marginBottom:14,display:'flex',alignItems:'center',gap:8 }}>
                <span style={{ display:'inline-block',width:4,height:18,background:'#1a6fc4',borderRadius:2 }} />Related products
              </h2>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10 }}>
                {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={n => setToast(`✓ "${n.slice(0,28)}..." added`)} />)}
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
