import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Toast from '../components/Toast'
import { getProducts } from '../lib/products'

const CATS = [
  { name:'Electronics',   emoji:'💻', count:'1,200+' },
  { name:'Home & Living', emoji:'🏡', count:'850+' },
  { name:'Wellness',      emoji:'🌿', count:'430+' },
  { name:'Fashion',       emoji:'👗', count:'620+' },
  { name:'Sports',        emoji:'⚽', count:'340+' },
  { name:'Books',         emoji:'📚', count:'2,000+' },
  { name:'Gaming',        emoji:'🎮', count:'290+' },
  { name:'Gifts',         emoji:'🎁', count:'500+' },
]

const ICONS = [
  { emoji:'📱', label:'Phones',  cat:'Electronics' },
  { emoji:'💻', label:'Laptops', cat:'Electronics' },
  { emoji:'🍲', label:'Kitchen', cat:'Home & Living' },
  { emoji:'🌿', label:'Wellness',cat:'Wellness' },
  { emoji:'👟', label:'Shoes',   cat:'Fashion' },
  { emoji:'🏃', label:'Sports',  cat:'Sports' },
  { emoji:'📚', label:'Books',   cat:'Books' },
  { emoji:'🎁', label:'Gifts',   cat:'' },
]

export async function getStaticProps() {
  const products = await getProducts()
  return { props: { products }, revalidate: 60 }
}

export default function Home({ products }) {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const featured   = products.slice(0, 5)
  const bestSellers = products.slice(5, 10)
  const flashDeals = products.filter(p => p.original_price && p.price < p.original_price).slice(0, 5)

  return (
    <>
      <Head>
        <title>QuikCart — Shop anything, delivered to your door</title>
        <meta name="description" content="Browse thousands of products on QuikCart. Fast UK delivery." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="page-wrap">
        <Navbar />

        {/* HERO */}
        <div style={{ background:'#1a6fc4',padding:'10px 16px',display:'grid',gridTemplateColumns:'160px 1fr 185px',gap:8,alignItems:'start' }}>
          {/* Left menu */}
          <div style={{ background:'white',borderRadius:10,overflow:'hidden' }}>
            {CATS.map(cat => (
              <div key={cat.name} onClick={() => router.push(`/shop?cat=${encodeURIComponent(cat.name)}`)}
                style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 10px',cursor:'pointer',fontSize:12,color:'#1a1f2e',borderBottom:'1px solid #f0f2f5' }}
                onMouseOver={e => e.currentTarget.style.background='#e8f1fb'}
                onMouseOut={e  => e.currentTarget.style.background='white'}
              >
                <span style={{ fontSize:17 }}>{cat.emoji}</span>
                <div><div style={{ fontWeight:600,fontSize:12 }}>{cat.name}</div><div style={{ fontSize:10,color:'#6b7280' }}>{cat.count} items</div></div>
              </div>
            ))}
          </div>

          {/* Main banner */}
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            <div style={{ background:'#e8f1fb',borderRadius:10,padding:'22px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:170,position:'relative',overflow:'hidden' }}>
              <div style={{ position:'absolute',right:-20,top:-20,width:180,height:180,background:'rgba(26,111,196,0.07)',borderRadius:'50%' }} />
              <div>
                <h1 style={{ fontSize:24,fontWeight:800,color:'#14549a',lineHeight:1.2,marginBottom:6 }}>Shop anything.<br/>Delivered to your door.</h1>
                <p style={{ fontSize:12,color:'#555',marginBottom:14,maxWidth:260,lineHeight:1.6 }}>Browse thousands of products with fast UK delivery and secure payment.</p>
                <button className="btn-primary" onClick={() => router.push('/shop')}>Shop now →</button>
              </div>
              <span style={{ fontSize:70,zIndex:1 }}>🛒</span>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8 }}>
              {[
                { bg:'#e8f4fd',color:'#14549a',emoji:'💻',title:'Electronics',sub:'Up to 40% off',cat:'Electronics' },
                { bg:'#fef3e2',color:'#854F0B',emoji:'🍲',title:'Home deals',  sub:'From £9.99',   cat:'Home & Living' },
                { bg:'#edf6f1',color:'#085041',emoji:'🌿',title:'Wellness',    sub:'Top picks',    cat:'Wellness' },
                { bg:'#fce8e8',color:'#a32d2d',emoji:'⚡',title:'Flash sale',  sub:'Ends tonight', cat:'' },
              ].map(b => (
                <div key={b.title} onClick={() => router.push(`/shop${b.cat?`?cat=${encodeURIComponent(b.cat)}`:''}`)}
                  style={{ background:b.bg,borderRadius:10,padding:'12px 10px',cursor:'pointer',textAlign:'center',transition:'transform 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseOut={e  => e.currentTarget.style.transform='translateY(0)'}
                >
                  <span style={{ fontSize:24,display:'block',marginBottom:4 }}>{b.emoji}</span>
                  <div style={{ fontSize:11,fontWeight:700,color:b.color,marginBottom:2 }}>{b.title}</div>
                  <div style={{ fontSize:10,color:b.color,opacity:0.75 }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Flash deals panel */}
          <div style={{ display:'flex',flexDirection:'column' }}>
            <div style={{ background:'#e02020',color:'white',borderRadius:'10px 10px 0 0',padding:'8px 12px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
              <span style={{ fontSize:13,fontWeight:700 }}>⚡ Flash Deals</span>
              <span style={{ fontSize:11,background:'rgba(0,0,0,0.2)',padding:'2px 7px',borderRadius:4 }}>Today only</span>
            </div>
            <div style={{ background:'white',borderRadius:'0 0 10px 10px',overflow:'hidden' }}>
              {flashDeals.length > 0 ? flashDeals.map(p => (
                <div key={p.id} onClick={() => router.push(`/product/${p.id}`)}
                  style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderBottom:'1px solid #f0f2f5',cursor:'pointer' }}
                  onMouseOver={e => e.currentTarget.style.background='#f5f7fa'}
                  onMouseOut={e  => e.currentTarget.style.background='white'}
                >
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} style={{ width:40,height:40,objectFit:'contain',flexShrink:0 }} />
                    : <span style={{ fontSize:24,flexShrink:0 }}>{p.emoji||'📦'}</span>
                  }
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:11,color:'#1a1f2e',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.name}</div>
                    <div>
                      <span style={{ color:'#e02020',fontSize:13,fontWeight:700 }}>£{p.price}</span>
                      {p.original_price && <span style={{ fontSize:10,color:'#6b7280',textDecoration:'line-through',marginLeft:4 }}>£{p.original_price}</span>}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ padding:'20px 12px',textAlign:'center',fontSize:12,color:'#6b7280' }}>No deals right now — check back soon!</div>
              )}
            </div>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div style={{ background:'white',borderBottom:'1px solid #e0e6ef',padding:'8px 16px',display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap' }}>
          {[['🔒','Buyer Protection'],['📧','Instant email confirmation'],['🚚','Free delivery over £25'],['↩️','30-day easy returns']].map(([icon,label]) => (
            <span key={label} style={{ display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#6b7280' }}>
              <span style={{ color:'#1a6fc4',fontSize:15 }}>{icon}</span>{label}
            </span>
          ))}
        </div>

        {/* ICON CATEGORY ROW */}
        <div style={{ padding:'14px 16px 4px' }}>
          <div style={{ maxWidth:1200,margin:'0 auto' }}>
            <div style={{ fontSize:15,fontWeight:700,color:'#1a1f2e',marginBottom:10,display:'flex',alignItems:'center',gap:6 }}>
              <span style={{ display:'inline-block',width:4,height:18,background:'#1a6fc4',borderRadius:2 }} />Browse categories
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:8 }}>
              {ICONS.map(ic => (
                <div key={ic.label} onClick={() => router.push(`/shop${ic.cat?`?cat=${encodeURIComponent(ic.cat)}`:''}`)}
                  style={{ background:'white',border:'1px solid #e0e6ef',borderRadius:10,padding:'10px 6px',textAlign:'center',cursor:'pointer',transition:'border-color 0.15s,transform 0.15s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='#1a6fc4'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseOut={e  => { e.currentTarget.style.borderColor='#e0e6ef'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <span style={{ fontSize:22,display:'block',marginBottom:4 }}>{ic.emoji}</span>
                  <p style={{ fontSize:10,fontWeight:600,color:'#1a1f2e' }}>{ic.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURED */}
        <Section title="Featured for you" link="/shop">
          <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onAddToCart={n => setToast(`✓ "${n.slice(0,28)}..." added to cart`)} />)}
          </div>
        </Section>

        {/* PROMO BANNERS */}
        <div style={{ padding:'0 16px 14px' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            {[
              { bg:'#1a6fc4',color:'white',    emoji:'💻',title:'Electronics Sale',sub:'Up to 40% off top products', cat:'Electronics' },
              { bg:'#fff3ec',color:'#ff6b00',  emoji:'🌿',title:'Wellness Week',   sub:'Self-care essentials from £9',cat:'Wellness' },
            ].map(b => (
              <div key={b.title} onClick={() => router.push(`/shop?cat=${encodeURIComponent(b.cat)}`)}
                style={{ background:b.bg,borderRadius:10,padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',transition:'transform 0.15s' }}
                onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseOut={e  => e.currentTarget.style.transform='translateY(0)'}
              >
                <div>
                  <h3 style={{ fontSize:14,fontWeight:700,color:b.color,marginBottom:3 }}>{b.title}</h3>
                  <p style={{ fontSize:11,color:b.color,opacity:0.75,marginBottom:10 }}>{b.sub}</p>
                  <button style={{ background:'rgba(0,0,0,0.12)',color:b.color,border:'none',padding:'6px 14px',borderRadius:50,fontSize:11,fontWeight:700,cursor:'pointer' }}>Shop now</button>
                </div>
                <span style={{ fontSize:44 }}>{b.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BEST SELLERS */}
        <Section title="Best sellers this week" link="/shop">
          <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10 }}>
            {bestSellers.map(p => <ProductCard key={p.id} product={p} onAddToCart={n => setToast(`✓ "${n.slice(0,28)}..." added to cart`)} />)}
          </div>
        </Section>

        {/* HOW IT WORKS */}
        <div style={{ background:'#1a1f2e',padding:'32px 16px',textAlign:'center' }}>
          <h2 style={{ fontSize:22,fontWeight:700,color:'white',marginBottom:4 }}>How QuikCart works</h2>
          <p style={{ color:'rgba(255,255,255,0.6)',fontSize:13,marginBottom:24 }}>We handle everything — you just shop.</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,maxWidth:900,margin:'0 auto' }}>
            {[['1','Browse & add to cart','Find products and add them to your cart'],['2','Secure checkout','Pay via Stripe — encrypted end-to-end'],['3','Order processed','Your order is placed and confirmed instantly'],['4','Email confirmation','Full receipt + tracking number sent to you']].map(([n,t,d]) => (
              <div key={n} style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'16px 12px' }}>
                <div style={{ fontSize:28,fontWeight:700,color:'#ff6b00',marginBottom:6 }}>{n}</div>
                <div style={{ fontSize:13,fontWeight:600,color:'white',marginBottom:4 }}>{t}</div>
                <div style={{ fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.5 }}>{d}</div>
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

function Section({ title, link, children }) {
  return (
    <div style={{ padding:'14px 16px' }}>
      <div style={{ maxWidth:1200,margin:'0 auto' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#1a1f2e',display:'flex',alignItems:'center',gap:8 }}>
            <span style={{ display:'inline-block',width:4,height:18,background:'#1a6fc4',borderRadius:2 }} />{title}
          </h2>
          <Link href={link} style={{ fontSize:12,color:'#1a6fc4' }}>See all →</Link>
        </div>
        {children}
      </div>
    </div>
  )
}
