import { Resend } from 'resend'
import { buildFulfilmentLink } from './aliexpress'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order, items, isAlert = false) {
  const to      = isAlert ? 'quikcarttoday@gmail.com' : order.customer_email
  const subject = isAlert
    ? `⚡ NEW ORDER — ${order.order_number} — Action needed`
    : `Your QuikCart order is confirmed — ${order.order_number}`

  await resend.emails.send({
    from: `QuikCart Orders <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: isAlert ? ownerEmail(order, items) : customerEmail(order, items),
  })
}

function ownerEmail(order, items) {
  const addr = order.delivery_address
  const deliveryLine = `${addr.name}, ${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}, ${addr.postcode}`

  const itemRows = items.map(item => {
    const link = item.ali_product_id
      ? buildFulfilmentLink(item.ali_product_id, item.quantity, addr)
      : '#'
    return `<tr><td style="padding:14px 0;border-bottom:1px solid #f0f2f5">
      <div style="font-size:14px;font-weight:600;color:#1a1f2e;margin-bottom:4px">${item.product_name}</div>
      <div style="font-size:12px;color:#6b7280;margin-bottom:10px">Qty: ${item.quantity} &nbsp;·&nbsp; Customer paid: <strong>£${item.total_price.toFixed(2)}</strong></div>
      <a href="${link}" style="display:inline-block;background:#ff6b00;color:white;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none">🛒 Buy on AliExpress →</a>
      <div style="font-size:11px;color:#9ca3af;margin-top:5px">Opens AliExpress with this item ready — enter customer address at checkout</div>
    </td></tr>`
  }).join('')

  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto">
    <div style="background:#1a6fc4;padding:18px 24px;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:22px;font-weight:800;color:white">Quik<span style="color:#ff6b00">Cart</span></div>
      <div style="background:#ff6b00;color:white;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:700">⚡ NEW ORDER</div>
    </div>
    <div style="background:white;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e0e6ef;border-top:none">
      <div style="font-size:18px;font-weight:700;color:#1a1f2e;margin-bottom:4px">Order ${order.order_number}</div>
      <div style="font-size:13px;color:#6b7280;margin-bottom:18px">Customer paid <strong style="color:#e02020">£${order.total.toFixed(2)}</strong></div>
      <div style="background:#e8f1fb;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#14549a;line-height:1.7">
        <strong>📦 Deliver to:</strong><br>${deliveryLine}
      </div>
      <div style="background:#fff3e0;border:1px solid #ffcc80;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#e65100">
        <strong>Action required:</strong> Click Buy on AliExpress for each item below. Use the delivery address above when checking out.
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
      <div style="margin-top:16px;background:#edf6f1;border-radius:8px;padding:12px 16px;font-size:13px">
        <div style="color:#085041;font-weight:700;margin-bottom:4px">💰 Your profit</div>
        <div style="color:#1a1f2e">Customer paid: <strong>£${order.total.toFixed(2)}</strong></div>
        <div style="color:#6b7280;font-size:12px;margin-top:2px">Subtract what you pay on AliExpress — the rest is yours.</div>
      </div>
    </div>
  </div>`
}

function customerEmail(order, items) {
  const addr = order.delivery_address
  const date = new Date(order.created_at).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  const est  = new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  const rows = items.map(i => `
    <tr><td style="padding:12px 0;border-bottom:1px solid #f0f2f5">
      <table width="100%"><tr>
        <td style="font-size:28px;width:44px;vertical-align:top;padding-right:10px">${i.product_emoji||'📦'}</td>
        <td style="vertical-align:top">
          <div style="font-size:14px;font-weight:600;color:#1a1f2e;margin-bottom:2px">${i.product_name}</div>
          <div style="font-size:12px;color:#6b7280">Qty: ${i.quantity}</div>
        </td>
        <td style="text-align:right;vertical-align:top;white-space:nowrap">
          <div style="font-size:15px;font-weight:700;color:#1a6fc4">£${i.total_price.toFixed(2)}</div>
        </td>
      </tr></table>
    </td></tr>`).join('')

  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#f5f7fa;padding:24px">
    <div style="background:#1a6fc4;padding:18px 24px;border-radius:10px 10px 0 0">
      <div style="font-size:22px;font-weight:800;color:white">Quik<span style="color:#ff6b00">Cart</span></div>
    </div>
    <div style="background:#2e7d32;padding:12px 24px;text-align:center">
      <div style="font-size:15px;font-weight:700;color:white">✅ Payment received — your order is confirmed</div>
    </div>
    <div style="background:white;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e0e6ef;border-top:none">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
        <div>
          <div style="font-size:17px;font-weight:700;color:#1a1f2e">Order Summary</div>
          <div style="font-size:12px;color:#6b7280">Placed on ${date}</div>
        </div>
        <div style="background:#e8f1fb;border:1px solid #b5d4f4;border-radius:6px;padding:7px 13px;text-align:right">
          <div style="font-size:10px;color:#14549a;font-weight:700;text-transform:uppercase">Order Number</div>
          <div style="font-size:15px;font-weight:800;color:#1a6fc4">${order.order_number}</div>
        </div>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">${rows}</table>
      <div style="background:#f9fafb;border-radius:8px;padding:14px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b7280;margin-bottom:4px"><span>Subtotal</span><span>£${order.subtotal.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#2e7d32;margin-bottom:8px"><span>Delivery</span><span>${order.total-order.subtotal>0?'£2.99':'FREE'}</span></div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid #e0e6ef;padding-top:8px"><span style="font-size:15px;font-weight:700">Total paid</span><span style="font-size:17px;font-weight:800;color:#1a6fc4">£${order.total.toFixed(2)}</span></div>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:700;color:#1a1f2e;margin-bottom:7px">📦 Delivering to</div>
        <div style="background:#f9fafb;border-radius:8px;padding:12px;font-size:13px;color:#444;line-height:1.7">
          <strong>${addr.name}</strong><br>${addr.line1}<br>${addr.line2?addr.line2+'<br>':''}${addr.city}<br>${addr.postcode}<br>United Kingdom
        </div>
      </div>
      <div style="background:#e8f1fb;border-radius:8px;padding:12px 16px;margin-bottom:16px">
        <div style="font-size:13px;font-weight:700;color:#14549a;margin-bottom:3px">🚚 Estimated delivery</div>
        <div style="font-size:15px;font-weight:700;color:#1a6fc4">${est}</div>
        <div style="font-size:12px;color:#555;margin-top:3px">Delivery is 7–14 working days. Tracking info sent once dispatched.</div>
      </div>
      <div style="background:#fff8e8;border:1px solid #f0d080;border-radius:8px;padding:10px 14px;font-size:12px;color:#5a3e00;line-height:1.6">
        <strong>Returns & Refund Policy:</strong> All refund requests must be submitted to quikcarttoday@gmail.com within 14 days of delivery. Refunds are at QuikCart's discretion.
      </div>
      <div style="text-align:center;margin-top:16px;font-size:12px;color:#6b7280">
        Questions? <a href="mailto:quikcarttoday@gmail.com" style="color:#1a6fc4">quikcarttoday@gmail.com</a>
      </div>
    </div>
    <div style="text-align:center;padding:14px 0;font-size:11px;color:#9ca3af">© 2025 QuikCart. All rights reserved.</div>
  </div>`
}
