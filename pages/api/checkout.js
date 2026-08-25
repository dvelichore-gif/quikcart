import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { items, customerEmail } = req.body
  if (!items || items.length === 0) return res.status(400).json({ error: 'No items' })
  const lineItems = items.map(item => ({
    price_data: { currency: 'gbp', product_data: { name: item.name, description: item.description || 'QuikCart product' }, unit_amount: Math.round(item.price * 100) },
    quantity: item.quantity || 1,
  }))
  const subtotal = items.reduce((s, i) => s + i.price * (i.quantity || 1), 0)
  if (subtotal < 25) lineItems.push({ price_data: { currency: 'gbp', product_data: { name: 'Standard Delivery' }, unit_amount: 299 }, quantity: 1 })
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      shipping_address_collection: { allowed_countries: ['GB', 'IE'] },
      payment_intent_data: {
        metadata: { items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, emoji: i.emoji, asin: i.ali_product_id, url: i.ali_url, qty: i.quantity || 1, price: i.price }))), source: 'quikcart' }
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    })
    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
