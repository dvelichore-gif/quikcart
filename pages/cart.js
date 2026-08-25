// pages/cart.js
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from './_app'

export default function Cart() {
  const router = useRouter()
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart()
  const delivery = subtotal >= 25 ? 0 : 2.99
  const total = subtotal + delivery

  if (items.length === 0) return (
    <>
      <Head><title>Your Cart — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:700, margin:'60px auto', textAlign:'center', padding:'0 16px' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
          <h1 style={{ fontSize:22, fontWeight:700, marginBottom:8, color:'#1a1f2e' }}>Your cart is empty</h1>
          <p style={{ color:'#6b7280', marginBottom:24, fontSize:14 }}>Browse our products and add something you love.</p>
          <button className="btn-primary" onClick={() => router.push('/shop')}>Start shopping →</button>
        </div>
        <Footer />
      </div>
    </>
  )

  return (
    <>
      <Head><title>Your Cart ({totalItems}) — QuikCart</title></Head>
      <div className="page-wrap">
        <Navbar />
        <div style={{ maxWidth:1100, margin:'20px auto', padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'start' }}>
          <div>
            <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, overflow:'hidden' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #e0e6ef', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <h1 style={{ fontSize:20, fontWeight:700, color:'#1a1f2e' }}>Shopping Cart</h1>
                <span style={{ fontSize:13, color:'#6b7280' }}>{totalItems} item{totalItems!==1?'s':''}</span>
              </div>
              {items.map((item, i) => {
                const save = item.original_price ? Math.round((1 - item.price/item.original_price)*100) : 0
                return (
                  <div key={item.id} style={{ padding:'16px 20px', borderBottom:i<items.length-1?'1px solid #e0e6ef':'none', display:'grid', gridTemplateColumns:'1fr 100px 100px 40px', gap:8, alignItems:'center' }}>
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <div style={{ width:64, height:64, background:'#f5f7fa', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, flexShrink:0, border:'1px solid #e0e6ef', overflow:'hidden' }}>
                        {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }} /> : item.emoji}
                      </div>
                      <div>
                        <Link href={`/product/${item.id}`} style={{ fontSize:13, fontWeight:600, color:'#1a1f2e', lineHeight:1.4, display:'block', marginBottom:3 }}>{item.name}</Link>
                        <div style={{ fontSize:11, color:'#81B29A', fontWeight:600 }}>✓ Free delivery</div>
                        {save > 0 && <div style={{ fontSize:11, color:'#e02020', marginTop:2 }}>You save {save}%</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                      <button onClick={() => updateQty(item.id, item.quantity-1)} style={{ width:26, height:26, border:'1px solid #e0e6ef', borderRadius:4, background:'white', cursor:'pointer', fontSize:13 }}>−</button>
                      <span style={{ fontSize:14, fontWeight:600, minWidth:16, textAlign:'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity+1)} style={{ width:26, height:26, border:'1px solid #e0e6ef', borderRadius:4, background:'white', cursor:'pointer', fontSize:13 }}>+</button>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:15, fontWeight:700, color:'#e02020' }}>£{(item.price*item.quantity).toFixed(2)}</div>
                      {item.quantity>1 && <div style={{ fontSize:11, color:'#6b7280' }}>£{item.price} each</div>}
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ width:28, height:28, border:'1px solid #e0e6ef', borderRadius:4, background:'white', cursor:'pointer', color:'#6b7280', fontSize:14 }}>✕</button>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop:12 }}><Link href="/shop" style={{ fontSize:13, color:'#1a6fc4' }}>← Continue shopping</Link></div>
          </div>
          <div style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, overflow:'hidden', position:'sticky', top:105 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid #e0e6ef', background:'#f5f7fa' }}>
              <h2 style={{ fontSize:15, fontWeight:700, color:'#1a1f2e' }}>Order Summary</h2>
            </div>
            <div style={{ padding:'16px 18px' }}>
              {items.map(item => (
                <div key={item.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13 }}>
                  <span style={{ color:'#1a1f2e', flex:1, marginRight:8, lineHeight:1.4 }}>{item.name.slice(0,28)}… ×{item.quantity}</span>
                  <span style={{ fontWeight:600, color:'#1a1f2e', whiteSpace:'nowrap' }}>£{(item.price*item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid #e0e6ef', paddingTop:12, marginTop:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, color:'#6b7280' }}><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:13, color:delivery===0?'#81B29A':'#6b7280' }}><span>Delivery</span><span>{delivery===0?'FREE':`£${delivery.toFixed(2)}`}</span></div>
                {subtotal < 25 && <div style={{ background:'#fff8e8', border:'1px solid #f0d080', borderRadius:5, padding:'7px 10px', fontSize:11, color:'#854f0b', marginBottom:8 }}>Add £{(25-subtotal).toFixed(2)} more for free delivery</div>}
              </div>
              <div style={{ borderTop:'2px solid #1a1f2e', paddingTop:12, marginTop:4, display:'flex', justifyContent:'space-between', marginBottom:16 }}>
                <span style={{ fontSize:16, fontWeight:700, color:'#1a1f2e' }}>Total</span>
                <span style={{ fontSize:18, fontWeight:800, color:'#e02020' }}>£{total.toFixed(2)}</span>
              </div>
              <Link href="/checkout"><button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:15 }}>🔒 Proceed to checkout</button></Link>
              <div style={{ marginTop:14, borderTop:'1px solid #e0e6ef', paddingTop:12 }}>
                {[['🔒','Secure Stripe payment'],['📧','Email confirmation sent'],['↩️','14-day returns policy']].map(([icon,label]) => (
                  <div key={label} style={{ display:'flex', gap:7, marginBottom:5, fontSize:11, color:'#6b7280', alignItems:'center' }}><span>{icon}</span> {label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
