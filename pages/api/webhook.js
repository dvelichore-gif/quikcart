// pages/api/webhook.js
import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase'
import { sendOrderConfirmation } from '../../lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
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
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  if (event.type !== 'checkout.session.completed') return res.status(200).json({ received: true })
  const session = event.data.object
  if (session.payment_status !== 'paid') return res.status(200).json({ received: true })

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent)
    const itemsMeta = JSON.parse(paymentIntent.metadata.items || '[]')
    const shipping = session.shipping_details
    const customerEmail = session.customer_details?.email
    const customerName  = session.customer_details?.name || 'Customer'
    const deliveryAddress = {
      name:     shipping?.name || customerName,
      line1:    shipping?.address?.line1,
      line2:    shipping?.address?.line2 || '',
      city:     shipping?.address?.city,
      postcode: shipping?.address?.postal_code,
      country:  shipping?.address?.country || 'GB',
    }
    const orderItems = itemsMeta.map(meta => ({
      product_id:    meta.id,
      product_name:  meta.name,
      product_emoji: meta.emoji || '📦',
      ali_product_id:meta.asin,
      ali_url:       meta.url,
      quantity:      meta.qty || 1,
      unit_price:    parseFloat(meta.price),
      total_price:   parseFloat(meta.price) * (meta.qty || 1),
    }))
    const subtotal   = orderItems.reduce((s, i) => s + i.total_price, 0)
    const amountTotal = session.amount_total / 100

    const { data: customer } = await supabaseAdmin.from('customers')
      .upsert({ email: customerEmail, name: customerName }, { onConflict: 'email' }).select().single()

    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert({
      customer_id: customer?.id, customer_email: customerEmail, customer_name: customerName,
      delivery_address: deliveryAddress, items: orderItems,
      subtotal, markup: parseFloat((amountTotal - subtotal).toFixed(2)), total: amountTotal,
      stripe_payment_intent: session.payment_intent, stripe_session_id: session.id,
      payment_status: 'paid', fulfillment_status: 'pending',
    }).select().single()

    if (orderError) throw orderError

    await supabaseAdmin.from('order_items').insert(
      orderItems.map(item => ({ ...item, order_id: order.id }))
    )

    // Send BOTH emails simultaneously
    await Promise.all([
      sendOrderConfirmation(order, orderItems, false), // customer receipt
      sendOrderConfirmation(order, orderItems, true),  // your alert with AliExpress buy button
    ])

    res.status(200).json({ received: true, orderId: order.id })
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: err.message })
  }
}
