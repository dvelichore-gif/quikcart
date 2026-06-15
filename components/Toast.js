// components/Toast.js
// Simple slide-in notification for "added to cart" etc.

import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 2800)
    return () => clearTimeout(t)
  }, [message])

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
      background: '#1a1f2e', color: 'white',
      padding: '12px 18px', borderRadius: 8, fontSize: 13,
      borderLeft: '3px solid #ff6b00',
      transform: visible ? 'translateY(0)' : 'translateY(80px)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      maxWidth: 320,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>
      {message}
    </div>
  )
}
