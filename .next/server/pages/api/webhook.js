"use strict";(()=>{var t={};t.id=538,t.ids=[538],t.modules={145:t=>{t.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},1309:t=>{t.exports=import("@supabase/supabase-js")},5462:t=>{t.exports=import("puppeteer")},6326:t=>{t.exports=import("resend")},6090:t=>{t.exports=import("stripe")},525:(t,e,a)=>{a.a(t,async(t,i)=>{try{a.r(e),a.d(e,{config:()=>p,default:()=>l,routeModule:()=>c});var o=a(1802),r=a(7153),n=a(6249),d=a(6066),s=t([d]);d=(s.then?(await s)():s)[0];let l=(0,n.l)(d,"default"),p=(0,n.l)(d,"config"),c=new o.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/webhook",pathname:"/api/webhook",bundlePath:"",filename:""},userland:d});i()}catch(t){i(t)}})},3946:(t,e,a)=>{a.a(t,async(t,i)=>{try{a.d(e,{n:()=>placeAmazonOrder});var o=a(5462),r=t([o]);async function placeAmazonOrder(t,e,a){let i=await o.default.launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--disable-gpu"]}),r=await i.newPage();await r.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");try{for(let t of(await r.goto("https://www.amazon.co.uk/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.co.uk%2F&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=gbflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0",{waitUntil:"networkidle2"}),await r.waitForSelector("#ap_email"),await r.type("#ap_email",process.env.AMAZON_EMAIL,{delay:80}),await r.click("#continue"),await r.waitForTimeout(1500),await r.waitForSelector("#ap_password"),await r.type("#ap_password",process.env.AMAZON_PASSWORD,{delay:80}),await r.click("#signInSubmit"),await r.waitForNavigation({waitUntil:"networkidle2"}),e))for(let e=0;e<t.quantity;e++)try{await r.goto(`https://www.amazon.co.uk/dp/${t.amazon_asin}`,{waitUntil:"networkidle2",timeout:3e4});let e=await r.$("#add-to-cart-button");if(e)await e.click(),await r.waitForTimeout(2e3);else{let t=await r.$("#buy-now-button");t&&(await t.click(),await r.waitForNavigation({waitUntil:"networkidle2"}))}}catch(e){console.error(`Failed to add item ${t.amazon_asin}:`,e.message)}await r.goto("https://www.amazon.co.uk/cart",{waitUntil:"networkidle2"}),await r.waitForTimeout(1e3);let t=await r.$('[name="proceedToRetailCheckout"]');t&&(await t.click(),await r.waitForNavigation({waitUntil:"networkidle2"})),await r.waitForTimeout(1500);let a=await r.$('[data-feature-id="primary-cta-button"]')||await r.$('.a-button-primary input[type="submit"]');a&&(await a.click(),await r.waitForNavigation({waitUntil:"networkidle2"})),await r.waitForTimeout(2e3);let o=await r.$('[data-feature-id="place-order-button"]')||await r.$('input[name="placeYourOrder1"]')||await r.$(".place-your-order-button");o&&(await o.click(),await r.waitForNavigation({waitUntil:"networkidle2",timeout:3e4}));let n=await r.content(),d=n.match(/\d{3}-\d{7}-\d{7}/),s=d?d[0]:`MANUAL-${Date.now()}`;return await i.close(),s}catch(t){throw await i.close(),console.error("Amazon automation error:",t),Error(`Amazon order failed: ${t.message}`)}}o=(r.then?(await r)():r)[0],i()}catch(t){i(t)}})},7818:(t,e,a)=>{a.a(t,async(t,i)=>{try{a.d(e,{B:()=>sendOrderConfirmation});var o=a(6326),r=t([o]);o=(r.then?(await r)():r)[0];let n=new o.Resend(process.env.RESEND_API_KEY);async function sendOrderConfirmation(t,e,a=!1){let i=a?`⚠️ ACTION NEEDED: Manual Amazon order required — ${t.order_number}`:`Your QuikCart order is confirmed — ${t.order_number}`,o=a?process.env.EMAIL_FROM:t.customer_email,r=a?buildAlertEmail(t,e):buildReceiptEmail(t,e);try{let t=await n.emails.send({from:`QuikCart Orders <${process.env.EMAIL_FROM}>`,to:o,subject:i,html:r});return t}catch(t){console.error("Email send failed:",t)}}function buildReceiptEmail(t,e){let a=t.delivery_address,i=new Date(t.created_at).toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),o=new Date(Date.now()+3456e5).toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),r=e.map(t=>`
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f2f5;vertical-align:top">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="font-size:32px;padding-right:14px;vertical-align:top;width:50px">${t.product_emoji||"\uD83D\uDCE6"}</td>
            <td style="vertical-align:top">
              <div style="font-size:14px;font-weight:600;color:#1a1f2e;margin-bottom:3px">${t.product_name}</div>
              <div style="font-size:12px;color:#6b7280">ASIN: ${t.amazon_asin}</div>
              <div style="font-size:12px;color:#6b7280">Qty: ${t.quantity}</div>
            </td>
            <td style="text-align:right;vertical-align:top;white-space:nowrap">
              <div style="font-size:15px;font-weight:700;color:#1a6fc4">\xa3${t.total_price.toFixed(2)}</div>
              ${t.quantity>1?`<div style="font-size:11px;color:#6b7280">\xa3${t.unit_price.toFixed(2)} each</div>`:""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");return`<!DOCTYPE html>
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
          <div style="font-size:12px;color:#6b7280">Placed on ${i}</div>
        </td>
        <td align="right">
          <div style="background:#e8f1fb;border:1px solid #b5d4f4;border-radius:6px;padding:8px 14px;display:inline-block">
            <div style="font-size:10px;color:#14549a;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Order Number</div>
            <div style="font-size:15px;font-weight:800;color:#1a6fc4">${t.order_number}</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ITEMS TABLE -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr><td style="background:#f5f7fa;padding:8px 12px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;margin-bottom:8px">Items ordered</td></tr>
      ${r}
    </table>

    <!-- TOTALS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#f9fafb;border-radius:8px;padding:16px">
      <tr>
        <td style="font-size:13px;color:#6b7280;padding:4px 0">Subtotal</td>
        <td align="right" style="font-size:13px;color:#1a1f2e;padding:4px 0">\xa3${t.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#6b7280;padding:4px 0">Delivery</td>
        <td align="right" style="font-size:13px;color:#2e7d32;padding:4px 0">${t.total-t.subtotal>0?"\xa3"+(t.total-t.subtotal-t.markup).toFixed(2):"FREE"}</td>
      </tr>
      <tr><td colspan="2" style="border-top:1px solid #e0e6ef;padding:8px 0"></td></tr>
      <tr>
        <td style="font-size:16px;font-weight:700;color:#1a1f2e;padding:4px 0">Total paid</td>
        <td align="right" style="font-size:18px;font-weight:800;color:#1a6fc4;padding:4px 0">\xa3${t.total.toFixed(2)}</td>
      </tr>
    </table>

    <!-- DELIVERY ADDRESS -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      <tr><td>
        <div style="font-size:13px;font-weight:700;color:#1a1f2e;margin-bottom:8px">📦 Delivering to</div>
        <div style="background:#f9fafb;border-radius:8px;padding:14px;font-size:13px;color:#444;line-height:1.7">
          <strong>${a.name}</strong><br>
          ${a.line1}<br>
          ${a.line2?a.line2+"<br>":""}
          ${a.city}<br>
          ${a.postcode}<br>
          United Kingdom
        </div>
      </td></tr>
    </table>

    <!-- ESTIMATED DELIVERY -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
      <tr><td style="background:#e8f1fb;border-radius:8px;padding:14px">
        <div style="font-size:13px;font-weight:700;color:#14549a;margin-bottom:4px">🚚 Estimated delivery</div>
        <div style="font-size:15px;font-weight:700;color:#1a6fc4">${o}</div>
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
      <div style="font-size:11px;color:#aaa;margin-top:8px">QuikCart \xb7 Auto-fulfilled via Amazon \xb7 Buyer Protection guaranteed</div>
    </div>

  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:16px 0;text-align:center">
    <div style="font-size:11px;color:#aaa">\xa9 2025 QuikCart. All rights reserved.</div>
    <div style="font-size:11px;color:#aaa;margin-top:4px">This email was sent to ${t.customer_email}</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`}function buildAlertEmail(t,e){let a=e.map(t=>`• ${t.product_name} (ASIN: ${t.amazon_asin}) x${t.quantity} — \xa3${t.total_price.toFixed(2)}
  Amazon: https://www.amazon.co.uk/dp/${t.amazon_asin}`).join("\n\n"),i=t.delivery_address;return`<pre style="font-family:monospace;font-size:13px;line-height:1.7;background:#1a1f2e;color:#f0f2f5;padding:20px;border-radius:8px">
⚠️  QUIKCART — MANUAL ORDER REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order: ${t.order_number}
Customer: ${t.customer_name} &lt;${t.customer_email}&gt;
Paid: \xa3${t.total.toFixed(2)}

ITEMS TO ORDER ON AMAZON:
${a}

DELIVER TO:
${i.name}
${i.line1}
${i.line2||""}
${i.city}, ${i.postcode}
United Kingdom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Place these orders NOW on your Amazon account.
</pre>`}i()}catch(t){i(t)}})},9407:(t,e,a)=>{a.a(t,async(t,i)=>{try{a.d(e,{p:()=>n});var o=a(1309),r=t([o]);o=(r.then?(await r)():r)[0],(0,o.createClient)("https://jmlfrozvdzdozjqalfec.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbGZyb3p2ZHpkb3pqcWFsZmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0OTc1MTYsImV4cCI6MjA5NzA3MzUxNn0.v-__EuACYMOJeus-v1VdoSeEVypkd1Mi63G_fAKLBsw");let n=(0,o.createClient)("https://jmlfrozvdzdozjqalfec.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);i()}catch(t){i(t)}})},6066:(t,e,a)=>{a.a(t,async(t,i)=>{try{a.r(e),a.d(e,{config:()=>p,default:()=>handler});var o=a(6090),r=a(9407),n=a(3946),d=a(7818),s=t([o,r,n,d]);[o,r,n,d]=s.then?(await s)():s;let l=new o.default(process.env.STRIPE_SECRET_KEY),p={api:{bodyParser:!1}};async function buffer(t){let e=[];for await(let a of t)e.push("string"==typeof a?Buffer.from(a):a);return Buffer.concat(e)}async function handler(t,e){let a;if("POST"!==t.method)return e.status(405).end();let i=await buffer(t),o=t.headers["stripe-signature"];try{a=l.webhooks.constructEvent(i,o,process.env.STRIPE_WEBHOOK_SECRET)}catch(t){return console.error("Webhook signature failed:",t.message),e.status(400).send(`Webhook Error: ${t.message}`)}if("checkout.session.completed"!==a.type)return e.status(200).json({received:!0});let s=a.data.object;if("paid"!==s.payment_status)return e.status(200).json({received:!0});try{let t=await l.paymentIntents.retrieve(s.payment_intent),a=JSON.parse(t.metadata.items||"[]"),i=s.shipping_details,o=s.customer_details?.email,p=s.customer_details?.name||"Customer",c={name:i?.name||p,line1:i?.address?.line1,line2:i?.address?.line2||"",city:i?.address?.city,postcode:i?.address?.postal_code,country:i?.address?.country||"GB"},m=a.map(t=>t.id).filter(Boolean),u=[];if(m.length>0){let{data:t}=await r.p.from("products").select("*").in("id",m);u=t||[]}let f=a.map(t=>{let e=u.find(e=>e.id===t.id)||{};return{product_id:t.id,product_name:t.name||e.name,product_emoji:t.emoji||e.emoji,amazon_asin:t.asin||e.amazon_asin,amazon_url:t.url||e.amazon_url,quantity:t.qty||1,unit_price:parseFloat(t.price||e.price),total_price:parseFloat(t.price||e.price)*(t.qty||1)}}),g=f.reduce((t,e)=>t+e.total_price,0),w=s.amount_total/100,{data:b}=await r.p.from("customers").upsert({email:o,name:p},{onConflict:"email"}).select().single(),{data:y,error:x}=await r.p.from("orders").insert({customer_id:b?.id,customer_email:o,customer_name:p,delivery_address:c,items:f,subtotal:g,markup:parseFloat((w-g).toFixed(2)),total:w,stripe_payment_intent:s.payment_intent,stripe_session_id:s.id,payment_status:"paid",fulfillment_status:"processing"}).select().single();if(x)throw x;await r.p.from("order_items").insert(f.map(t=>({...t,order_id:y.id}))),(0,n.n)(y,f,c).then(async t=>{await r.p.from("orders").update({amazon_order_id:t,amazon_order_placed_at:new Date().toISOString(),fulfillment_status:"ordered"}).eq("id",y.id)}).catch(async t=>{console.error("Amazon order failed:",t),await r.p.from("orders").update({fulfillment_status:"amazon_failed",notes:t.message}).eq("id",y.id),await (0,d.B)(y,f,!0)}),await (0,d.B)(y,f,!1),e.status(200).json({received:!0,orderId:y.id})}catch(t){console.error("Webhook processing error:",t),e.status(500).json({error:t.message})}}i()}catch(t){i(t)}})}};var e=require("../../webpack-api-runtime.js");e.C(t);var __webpack_exec__=t=>e(e.s=t),a=e.X(0,[702],()=>__webpack_exec__(525));module.exports=a})();