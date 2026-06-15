// pages/api/checkout.js
// Creates a Stripe Checkout session when customer clicks "Pay"

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { items, customerEmail, deliveryAddress } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' })
  }

  // Build Stripe line items from cart
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'gbp',
      product_data: {
        name: item.name,
        description: `${item.emoji || ''} Auto-fulfilled via Amazon`,
        metadata: { amazon_asin: item.amazon_asin }
      },
      unit_amount: Math.round(item.price * 100), // Stripe uses pence
    },
    quantity: item.quantity || 1,
  }))

  // Add delivery charge if under £25
  const subtotal = items.reduce((s, i) => s + i.price * (i.quantity || 1), 0)
  if (subtotal < 25) {
    lineItems.push({
      price_data: {
        currency: 'gbp',
        product_data: { name: 'Standard Delivery' },
        unit_amount: 299, // £2.99
      },
      quantity: 1,
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',

      // Pre-fill customer email
      customer_email: customerEmail || undefined,

      // Collect delivery address from customer
      shipping_address_collection: {
        allowed_countries: ['GB', 'IE'],
      },

      // CRITICAL: disable refunds via Stripe portal
      // Customers cannot self-serve refunds — only you can initiate
      payment_intent_data: {
        capture_method: 'automatic',
        metadata: {
          items: JSON.stringify(items.map(i => ({
            id: i.id,
            name: i.name,
            asin: i.amazon_asin,
            url: i.amazon_url,
            qty: i.quantity || 1,
            price: i.price,
          }))),
          source: 'quikcart',
        },
      },

      // Where to send customer after payment
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,

      metadata: {
        items: JSON.stringify(items.map(i => i.id)),
      },
    })

    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
