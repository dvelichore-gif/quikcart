// pages/_app.js
// ─────────────────────────────────────────────────────────
// Global app wrapper — provides the cart to every page
// ─────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react'
import '../styles/globals.css'

/* ── CART CONTEXT ─────────────────────────────────── */
export const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

/* ── CURRENCY CONTEXT ─────────────────────────────── */
// Static rates for display only. Stripe always charges in GBP —
// these are just for showing customers an approximate price.
export const CURRENCIES = {
  GBP: { symbol: '£', rate: 1,      label: 'GBP — British Pound' },
  USD: { symbol: '$', rate: 1.27,   label: 'USD — US Dollar' },
  EUR: { symbol: '€', rate: 1.17,   label: 'EUR — Euro' },
}

export const CurrencyContext = createContext(null)

export function useCurrency() {
  return useContext(CurrencyContext)
}

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('GBP')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('quikcart_currency')
      if (saved && CURRENCIES[saved]) setCurrency(saved)
    } catch {}
  }, [])

  function changeCurrency(code) {
    setCurrency(code)
    try { localStorage.setItem('quikcart_currency', code) } catch {}
  }

  // Converts a GBP amount into the selected display currency
  function formatPrice(gbpAmount) {
    const { symbol, rate } = CURRENCIES[currency]
    return `${symbol}${(gbpAmount * rate).toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, symbol: CURRENCIES[currency].symbol }}>
      {children}
    </CurrencyContext.Provider>
  )
}

function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Load cart from localStorage on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quikcart_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quikcart_cart', JSON.stringify(items))
  }, [items])

  function addItem(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateQty(id, qty) {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
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
