// lib/email.js
// Sends a formal AliExpress-style order confirmation email

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order, items, isAlert = false) {
  const subject = isAlert
    ? `⚠️ ACTION NEEDED: Manual Amazon order required — ${order.order_number}`
    : `Your QuikCart order is confirmed — ${order.order_number}`

  const to = isAlert
    ? process.env.EMAIL_FROM  // Alert goes to YOU
    : order.customer_email     // Confirmation goes to customer

  const html = isAlert
    ? buildAlertEmail(order, items)
    : buildReceiptEmail(order, items)

  try {
    const result = await resend.emails.send({
      from: `QuikCart Orders <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    })
    return result
  } catch (err) {
    console.error('Email send failed:', err)
  }
}

// ── CUSTOMER RECEIPT EMAIL ──────────────────────────────
function buildReceiptEmail(order, items) {
  const addr = order.delivery_address
  const date = new Date(order.created_at).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f2f5;vertical-align:top">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="font-size:32px;padding-right:14px;vertical-align:top;width:50px">${item.product_emoji || '📦'}</td>
            <td style="vertical-align:top">
              <div style="font-size:14px;font-weight:600;color:#1a1f2e;margin-bottom:3px">${item.product_name}</div>
              <div style="font-size:12px;color:#6b7280">ASIN: ${item.amazon_asin}</div>
              <div style="font-size:12px;color:#6b7280">Qty: ${item.quantity}</div>
            </td>
            <td style="text-align:right;vertical-align:top;white-space:nowrap">
              <div style="font-size:15px;font-weight:700;color:#1a6fc4">£${item.total_price.toFixed(2)}</div>
              ${item.quantity > 1 ? `<div style="font-size:11px;color:#6b7280">£${item.unit_price.toFixed(2)} each</div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:24px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- HEADER -->
  <tr><td style="background:#1a6fc4;padding:20px 28px;border-radius:10px 10px 0 0">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td><div style="font-size:26px;font-weight:800;color:white;letter-spacing:-0.5px">Quik<span style="color:#ff6b00">Cart</span></div></td>
        <td align="right"><div style="font-size:12px;color:rgba(255,255,255,0.75)">Order confirmed ✓</div></td>
      </tr>
    </table>
  </td></tr>

  <!-- GREEN BANNER -->
  <tr><td style="background:#2e7d32;padding:16px 28px;text-align:center">
    <div style="font-size:16px;font-weight:700;color:white">✅ Payment received — your order is being processed</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px">Your items will be dispatched and delivered to your address</div>
  </td></tr>

  <!-- MAIN BODY -->
  <tr><td style="background:white;padding:28px;border-radius:0 0 10px 10px">

    <!-- ORDER SUMMARY HEADER -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr>
        <td>
          <div style="font-size:18px;font-weight:700;color:#1a1f2e;margin-bottom:4px">Order Summary</div>
          <div style="font-size:12px;color:#6b7280">Placed on ${date}</div>
        </td>
        <td align="right">
          <div style="background:#e8f1fb;border:1px solid #b5d4f4;border-radius:6px;padding:8px 14px;display:inline-block">
            <div style="font-size:10px;color:#14549a;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Order Number</div>
            <div style="font-size:15px;font-weight:800;color:#1a6fc4">${order.order_number}</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ITEMS TABLE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr><td style="background:#f5f7fa;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;margin-bottom:8px">Items ordered</td></tr>
      ${itemRows}
    </table>

    <!-- TOTALS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#f9fafb;border-radius:8px;padding:16px">
      <tr>
        <td style="font-size:13px;color:#6b7280;padding:4px 0">Subtotal</td>
        <td align="right" style="font-size:13px;color:#1a1f2e;padding:4px 0">£${order.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#6b7280;padding:4px 0">Delivery</td>
        <td align="right" style="font-size:13px;color:#2e7d32;padding:4px 0">${order.total - order.subtotal > 0 ? '£' + (order.total - order.subtotal - order.markup).toFixed(2) : 'FREE'}</td>
      </tr>
      <tr><td colspan="2" style="border-top:1px solid #e0e6ef;padding:8px 0"></td></tr>
      <tr>
        <td style="font-size:16px;font-weight:700;color:#1a1f2e;padding:4px 0">Total paid</td>
        <td align="right" style="font-size:18px;font-weight:800;color:#1a6fc4;padding:4px 0">£${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <!-- DELIVERY ADDRESS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      <tr><td>
        <div style="font-size:13px;font-weight:700;color:#1a1f2e;margin-bottom:8px">📦 Delivering to</div>
        <div style="background:#f9fafb;border-radius:8px;padding:14px;font-size:13px;color:#444;line-height:1.7">
          <strong>${addr.name}</strong><br>
          ${addr.line1}<br>
          ${addr.line2 ? addr.line2 + '<br>' : ''}
          ${addr.city}<br>
          ${addr.postcode}<br>
          United Kingdom
        </div>
      </td></tr>
    </table>

    <!-- ESTIMATED DELIVERY -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      <tr><td style="background:#e8f1fb;border-radius:8px;padding:14px">
        <div style="font-size:13px;font-weight:700;color:#14549a;margin-bottom:4px">🚚 Estimated delivery</div>
        <div style="font-size:15px;font-weight:700;color:#1a6fc4">${estimatedDelivery}</div>
        <div style="font-size:12px;color:#555;margin-top:4px">You'll receive a tracking number once dispatched</div>
      </td></tr>
    </table>

    <!-- REFUND POLICY — protects you -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      <tr><td style="background:#fff8e8;border:1px solid #f0d080;border-radius:8px;padding:14px">
        <div style="font-size:12px;font-weight:700;color:#854f0b;margin-bottom:4px">📋 Returns &amp; Refund Policy</div>
        <div style="font-size:12px;color:#5a3e00;line-height:1.6">
          All refund and return requests must be submitted to <a href="mailto:${process.env.EMAIL_FROM}" style="color:#1a6fc4">${process.env.EMAIL_FROM}</a> within 14 days of delivery. Refunds are processed at QuikCart's discretion and only initiated by our team after review. Unauthorised chargebacks may result in account suspension.
        </div>
      </td></tr>
    </table>

    <!-- CONTACT -->
    <div style="text-align:center;padding:16px 0;border-top:1px solid #f0f2f5">
      <div style="font-size:12px;color:#6b7280">Questions? Contact us at <a href="mailto:${process.env.EMAIL_FROM}" style="color:#1a6fc4">${process.env.EMAIL_FROM}</a></div>
      <div style="font-size:11px;color:#aaa;margin-top:8px">QuikCart · Auto-fulfilled via Amazon · Buyer Protection guaranteed</div>
    </div>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:16px 0;text-align:center">
    <div style="font-size:11px;color:#aaa">© 2025 QuikCart. All rights reserved.</div>
    <div style="font-size:11px;color:#aaa;margin-top:4px">This email was sent to ${order.customer_email}</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ── OWNER ALERT EMAIL (when Amazon order needs manual action) ──
function buildAlertEmail(order, items) {
  const itemList = items.map(i =>
    `• ${i.product_name} (ASIN: ${i.amazon_asin}) x${i.quantity} — £${i.total_price.toFixed(2)}\n  Amazon: https://www.amazon.co.uk/dp/${i.amazon_asin}`
  ).join('\n\n')

  const addr = order.delivery_address
  return `<pre style="font-family:monospace;font-size:13px;line-height:1.7;background:#1a1f2e;color:#f0f2f5;padding:20px;border-radius:8px">
⚠️  QUIKCART — MANUAL ORDER REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order: ${order.order_number}
Customer: ${order.customer_name} &lt;${order.customer_email}&gt;
Paid: £${order.total.toFixed(2)}

ITEMS TO ORDER ON AMAZON:
${itemList}

DELIVER TO:
${addr.name}
${addr.line1}
${addr.line2 || ''}
${addr.city}, ${addr.postcode}
United Kingdom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Place these orders NOW on your Amazon account.
</pre>`
}
