// pages/api/webhook.js
// ═══════════════════════════════════════════════════════════
//  STRIPE WEBHOOK — fires after every successful payment
//  This is the CORE ENGINE:
//  1. Saves order to Supabase
//  2. Triggers Amazon auto-purchase
//  3. Sends confirmation email to customer
// ═══════════════════════════════════════════════════════════

import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'
import { placeAmazonOrder } from '../../lib/amazon'
import { sendOrderConfirmation } from '../../lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// CRITICAL: disable Next.js body parser — Stripe needs raw body
export const config = { api: { bodyParser: false } }

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Only handle successful payments
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true })
  }

  const session = event.data.object

  // Skip if payment not fully paid
  if (session.payment_status !== 'paid') {
    return res.status(200).json({ received: true })
  }

  try {
    // ── 1. Extract order data from Stripe session ──────────
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent)
    const itemsMeta = JSON.parse(paymentIntent.metadata.items || '[]')
    const shipping = session.shipping_details

    const customerEmail = session.customer_details?.email
    const customerName = session.customer_details?.name || 'Customer'

    const deliveryAddress = {
      name: shipping?.name || customerName,
      line1: shipping?.address?.line1,
      line2: shipping?.address?.line2 || '',
      city: shipping?.address?.city,
      postcode: shipping?.address?.postal_code,
      country: shipping?.address?.country || 'GB',
    }

    // ── 2. Fetch full product details from Supabase ────────
    const productIds = itemsMeta.map(i => i.id).filter(Boolean)
    let products = []
    if (productIds.length > 0) {
      const { data } = await supabaseAdmin
        .from('products')
        .select('*')
        .in('id', productIds)
      products = data || []
    }

    const orderItems = itemsMeta.map(meta => {
      const prod = products.find(p => p.id === meta.id) || {}
      return {
        product_id: meta.id,
        product_name: meta.name || prod.name,
        product_emoji: meta.emoji || prod.emoji,
        amazon_asin: meta.asin || prod.amazon_asin,
        amazon_url: meta.url || prod.amazon_url,
        quantity: meta.qty || 1,
        unit_price: parseFloat(meta.price || prod.price),
        total_price: parseFloat(meta.price || prod.price) * (meta.qty || 1),
      }
    })

    const subtotal = orderItems.reduce((s, i) => s + i.total_price, 0)
    const amountTotal = session.amount_total / 100

    // ── 3. Save customer to Supabase ──────────────────────
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .upsert({ email: customerEmail, name: customerName }, { onConflict: 'email' })
      .select()
      .single()

    // ── 4. Save order to Supabase ─────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id: customer?.id,
        customer_email: customerEmail,
        customer_name: customerName,
        delivery_address: deliveryAddress,
        items: orderItems,
        subtotal: subtotal,
        markup: parseFloat((amountTotal - subtotal).toFixed(2)),
        total: amountTotal,
        stripe_payment_intent: session.payment_intent,
        stripe_session_id: session.id,
        payment_status: 'paid',
        fulfillment_status: 'processing',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // ── 5. Save order items ───────────────────────────────
    await supabaseAdmin.from('order_items').insert(
      orderItems.map(item => ({ ...item, order_id: order.id }))
    )

    // ── 6. Trigger Amazon auto-purchase ───────────────────
    // Runs async — doesn't block the webhook response
    placeAmazonOrder(order, orderItems, deliveryAddress)
      .then(async (amazonOrderId) => {
        await supabaseAdmin
          .from('orders')
          .update({
            amazon_order_id: amazonOrderId,
            amazon_order_placed_at: new Date().toISOString(),
            fulfillment_status: 'ordered',
          })
          .eq('id', order.id)
      })
      .catch(async (err) => {
        console.error('Amazon order failed:', err)
        await supabaseAdmin
          .from('orders')
          .update({ fulfillment_status: 'amazon_failed', notes: err.message })
          .eq('id', order.id)
        // Alert yourself via email if Amazon order fails
        await sendOrderConfirmation(order, orderItems, true)
      })

    // ── 7. Send confirmation email to customer ────────────
    await sendOrderConfirmation(order, orderItems, false)

    res.status(200).json({ received: true, orderId: order.id })

  } catch (err) {
    console.error('Webhook processing error:', err)
    res.status(500).json({ error: err.message })
  }
}
