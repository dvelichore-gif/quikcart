import { useState } from 'react'

export default function HelpCentreModal({ onClose }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSend() {
    setError('')
    if (!message.trim()) return setError('Please enter a message before sending')
    setSending(true)
    try {
      const res  = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, email, message }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSent(true)
    } catch (err) { setError(err.message) }
    finally { setSending(false) }
  }

  const inp = { width:'100%', padding:'9px 12px', border:'1px solid #dde3ec', borderRadius:6, fontSize:13, color:'#1a1f2e', outline:'none' }

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000,padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'white',borderRadius:12,maxWidth:440,width:'100%',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ background:'#1a6fc4',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:18,fontWeight:800,color:'white' }}>Quik<span style={{ color:'#ff6b00' }}>Cart</span> Help Centre</div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,0.8)' }}>We usually reply within 24 hours</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.2)',border:'none',color:'white',width:28,height:28,borderRadius:6,fontSize:14,cursor:'pointer' }}>✕</button>
        </div>
        <div style={{ padding:22 }}>
          {sent ? (
            <div style={{ textAlign:'center',padding:'20px 0' }}>
              <div style={{ fontSize:44,marginBottom:12 }}>✅</div>
              <h3 style={{ fontSize:17,fontWeight:700,color:'#1a1f2e',marginBottom:8 }}>Message sent!</h3>
              <p style={{ fontSize:13,color:'#6b7280',lineHeight:1.6,marginBottom:20 }}>Thanks for reaching out. We'll get back to you by email shortly.</p>
              <button onClick={onClose} className="btn-primary" style={{ width:'100%',justifyContent:'center' }}>Close</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize:13,color:'#6b7280',marginBottom:16,lineHeight:1.6 }}>Have a question about an order or anything else? Send us a message.</p>
              {[['Your name (optional)','text',name,setName,'John Smith'],['Your email (for our reply)','email',email,setEmail,'you@example.com']].map(([label,type,val,set,ph]) => (
                <div key={label} style={{ marginBottom:12 }}>
                  <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#1a1f2e',marginBottom:4 }}>{label}</label>
                  <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={inp} />
                </div>
              ))}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#1a1f2e',marginBottom:4 }}>Message *</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Tell us what's going on..." rows={5} style={{ ...inp,resize:'vertical',fontFamily:'inherit' }} />
              </div>
              {error && <div style={{ background:'#fce8e8',border:'1px solid #f09595',borderRadius:6,padding:'8px 12px',fontSize:12,color:'#a32d2d',marginBottom:12 }}>⚠️ {error}</div>}
              <button onClick={handleSend} disabled={sending} className="btn-primary" style={{ width:'100%',justifyContent:'center',padding:11,fontSize:14,opacity:sending?0.7:1 }}>
                {sending ? 'Sending...' : 'Send message'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
