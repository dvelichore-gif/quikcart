import { createContext, useContext, useState, useEffect } from 'react'
import '../styles/globals.css'

// ── CART ────────────────────────────────────────────────
export const CartContext = createContext(null)
export function useCart() { return useContext(CartContext) }

function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try { const s = localStorage.getItem('qc_cart'); if (s) setItems(JSON.parse(s)) } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('qc_cart', JSON.stringify(items)) } catch {}
  }, [items])

  const addItem = (product, qty = 1) => setItems(prev => {
    const ex = prev.find(i => i.id === product.id)
    return ex ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
               : [...prev, { ...product, quantity: qty }]
  })

  const removeItem  = id => setItems(prev => prev.filter(i => i.id !== id))
  const updateQty   = (id, qty) => qty < 1 ? removeItem(id) : setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  const clearCart   = () => setItems([])
  const totalItems  = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal    = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>{children}</CartContext.Provider>
}

// ── CURRENCY ─────────────────────────────────────────────
export const CURRENCIES = {
  GBP: { symbol: '£', rate: 1,    label: 'GBP — British Pound' },
  USD: { symbol: '$', rate: 1.27, label: 'USD — US Dollar' },
  EUR: { symbol: '€', rate: 1.17, label: 'EUR — Euro' },
}
export const CurrencyContext = createContext(null)
export function useCurrency() { return useContext(CurrencyContext) }

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('GBP')

  useEffect(() => {
    try { const s = localStorage.getItem('qc_currency'); if (s && CURRENCIES[s]) setCurrency(s) } catch {}
  }, [])

  const changeCurrency = code => {
    setCurrency(code)
    try { localStorage.setItem('qc_currency', code) } catch {}
  }

  const formatPrice = gbp => {
    const { symbol, rate } = CURRENCIES[currency]
    return `${symbol}${(gbp * rate).toFixed(2)}`
  }

  return <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, symbol: CURRENCIES[currency].symbol }}>{children}</CurrencyContext.Provider>
}

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <CurrencyProvider>
        <Component {...pageProps} />
      </CurrencyProvider>
    </CartProvider>
  )
}
