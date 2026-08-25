// pages/admin/import-products.js
// Private page — only you know this URL exists
// Visit: yoursite.com/admin/import-products

import { useState } from 'react'
import Head from 'next/head'

export default function ImportProducts() {
  const [query,     setQuery]     = useState('')
  const [markup,    setMarkup]    = useState(15)
  const [results,   setResults]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [importing, setImporting] = useState(null)
  const [imported,  setImported]  = useState({})
  const [error,     setError]     = useState('')

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      const res  = await fetch(`/api/ali-search?q=${encodeURIComponent(query)}&limit=24`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.products)
    } catch (err) {
      setError('Search failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleImport(item) {
    setImporting(item.id)
    setError('')
    try {
      const res  = await fetch('/api/ali-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.ali_product_id, markupPercent: markup }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImported(prev => ({ ...prev, [item.id]: true }))
    } catch (err) {
      setError('Import failed: ' + err.message)
    } finally {
      setImporting(null)
    }
  }

  return (
    <>
      <Head><title>Import Products — QuikCart Admin</title></Head>
      <div style={{ minHeight:'100vh', background:'#f5f7fa', fontFamily:'Segoe UI, sans-serif' }}>

        {/* Header */}
        <div style={{ background:'#1a6fc4', padding:'14px 24px', display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:20, fontWeight:800, color:'white' }}>Quik<span style={{ color:'#ff6b00' }}>Cart</span></div>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>Admin — Import Products from AliExpress</div>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>

          {/* Search */}
          <div style={{ background:'white', borderRadius:10, padding:20, marginBottom:20, border:'1px solid #e0e6ef' }}>
            <h1 style={{ fontSize:18, fontWeight:700, color:'#1a1f2e', marginBottom:4 }}>Search AliExpress products</h1>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:16 }}>
              Search for any product, set your markup, and click Import. Products appear live in your shop within 60 seconds.
            </p>
            <form onSubmit={handleSearch} style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. wireless headphones, phone case, yoga mat..."
                style={{ flex:1, minWidth:220, padding:'10px 14px', border:'1px solid #dde3ec', borderRadius:6, fontSize:13, color:'#1a1f2e', outline:'none' }}
              />
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f5f7fa', padding:'0 14px', borderRadius:6, border:'1px solid #e0e6ef' }}>
                <label style={{ fontSize:12, color:'#6b7280', whiteSpace:'nowrap' }}>Your markup:</label>
                <select
                  value={markup}
                  onChange={e => setMarkup(parseInt(e.target.value))}
                  style={{ border:'none', background:'none', fontSize:14, fontWeight:600, color:'#1a1f2e', cursor:'pointer' }}
                >
                  {[10,15,20,25,30,40,50].map(v => <option key={v} value={v}>{v}% profit</option>)}
                </select>
              </div>
              <button type="submit" disabled={loading}
                style={{ background:'#1a6fc4', color:'white', border:'none', padding:'10px 22px', borderRadius:6, fontSize:14, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
                {loading ? 'Searching...' : 'Search AliExpress'}
              </button>
            </form>
            <div style={{ marginTop:12, background:'#e8f1fb', borderRadius:6, padding:'10px 14px', fontSize:12, color:'#14549a', lineHeight:1.6 }}>
              With <strong>{markup}%</strong> markup: a £10 AliExpress item sells for <strong>£{(10*(1+markup/100)).toFixed(2)}</strong> on your shop. You keep the difference after fees.
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'#fce8e8', border:'1px solid #f09595', borderRadius:8, padding:'12px 16px', fontSize:13, color:'#a32d2d', marginBottom:16 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <>
              <div style={{ fontSize:13, color:'#6b7280', marginBottom:12 }}>
                {results.length} products found for &quot;<strong>{query}</strong>&quot;
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                {results.map(item => {
                  const sellPrice  = (item.price * (1 + markup/100)).toFixed(2)
                  const profit     = (item.price * markup/100).toFixed(2)
                  const isImported = imported[item.id]
                  const isBusy     = importing === item.id
                  return (
                    <div key={item.id} style={{ background:'white', border:'1px solid #e0e6ef', borderRadius:10, overflow:'hidden' }}>
                      <div style={{ height:150, background:'#f5f7fa', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }} />
                          : <span style={{ fontSize:40 }}>📦</span>
                        }
                        {item.discount > 0 && (
                          <span style={{ position:'absolute', top:8, left:8, background:'#e02020', color:'white', fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:3 }}>
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                      <div style={{ padding:'12px 12px 10px' }}>
                        <div style={{ fontSize:12, fontWeight:600, color:'#1a1f2e', lineHeight:1.4, marginBottom:8, height:36, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                          {item.name}
                        </div>
                        <div style={{ background:'#f9fafb', borderRadius:6, padding:'8px 10px', marginBottom:10, fontSize:12 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', color:'#6b7280', marginBottom:3 }}><span>AliExpress price</span><span>£{item.price.toFixed(2)}</span></div>
                          <div style={{ display:'flex', justifyContent:'space-between', fontWeight:600, marginBottom:3 }}><span>You sell at</span><span style={{ color:'#e02020' }}>£{sellPrice}</span></div>
                          <div style={{ display:'flex', justifyContent:'space-between', color:'#2e7d32', fontSize:11 }}><span>Your profit</span><span>~£{profit}</span></div>
                        </div>
                        <div style={{ fontSize:11, color:'#ff6b00', marginBottom:8 }}>
                          {'★'.repeat(Math.floor(item.rating||4))}{'☆'.repeat(5-Math.floor(item.rating||4))}
                          <span style={{ color:'#6b7280', marginLeft:4 }}>({(item.reviews||0).toLocaleString()})</span>
                        </div>
                        <button
                          onClick={() => handleImport(item)}
                          disabled={isBusy || isImported}
                          style={{ width:'100%', padding:9, border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:isBusy||isImported?'default':'pointer', background:isImported?'#81B29A':isBusy?'#ccc':'#ff6b00', color:'white', transition:'background 0.15s' }}>
                          {isImported ? '✓ Added to your shop' : isBusy ? 'Importing...' : 'Import to QuikCart'}
                        </button>
                        <a href={item.ali_url} target="_blank" rel="noreferrer"
                          style={{ display:'block', textAlign:'center', fontSize:11, color:'#1a6fc4', marginTop:7, textDecoration:'none' }}>
                          View on AliExpress ↗
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Empty state */}
          {results.length === 0 && !loading && (
            <div style={{ textAlign:'center', padding:'60px 20px', color:'#9ca3af' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:6, color:'#6b7280' }}>Search AliExpress above</div>
              <div style={{ fontSize:13 }}>Products you import appear live in your shop within 60 seconds</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
