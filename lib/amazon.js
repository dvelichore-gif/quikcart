// lib/amazon.js
// ═══════════════════════════════════════════════════════════
//  AMAZON AUTO-PURCHASE SERVICE
//  Uses Puppeteer to log into your Amazon account and
//  place an order on behalf of the customer.
//
//  IMPORTANT NOTES:
//  - Use a dedicated Amazon buyer account for this
//  - Start by manually forwarding orders, then automate
//  - Keep your Amazon account in good standing
//  - Puppeteer runs on Vercel only on Pro plan (functions > 10s)
//    Alternative: use Railway.app (free tier) to run this service
// ═══════════════════════════════════════════════════════════

import puppeteer from 'puppeteer'

export async function placeAmazonOrder(order, items, deliveryAddress) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  const page = await browser.newPage()
  
  // Set realistic user agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  )

  try {
    // ── STEP 1: Log into Amazon ─────────────────────────
    await page.goto('https://www.amazon.co.uk/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.co.uk%2F&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=gbflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0', {
      waitUntil: 'networkidle2'
    })

    // Enter email
    await page.waitForSelector('#ap_email')
    await page.type('#ap_email', process.env.AMAZON_EMAIL, { delay: 80 })
    await page.click('#continue')
    await page.waitForTimeout(1500)

    // Enter password
    await page.waitForSelector('#ap_password')
    await page.type('#ap_password', process.env.AMAZON_PASSWORD, { delay: 80 })
    await page.click('#signInSubmit')
    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    let allOrderIds = []

    // ── STEP 2: Add each item to cart and order ──────────
    for (const item of items) {
      for (let qty = 0; qty < item.quantity; qty++) {
        try {
          // Go to product page
          await page.goto(`https://www.amazon.co.uk/dp/${item.amazon_asin}`, {
            waitUntil: 'networkidle2',
            timeout: 30000,
          })

          // Click "Add to Cart"
          const addToCart = await page.$('#add-to-cart-button')
          if (addToCart) {
            await addToCart.click()
            await page.waitForTimeout(2000)
          } else {
            // Try "Buy Now" flow
            const buyNow = await page.$('#buy-now-button')
            if (buyNow) {
              await buyNow.click()
              await page.waitForNavigation({ waitUntil: 'networkidle2' })
            }
          }
        } catch (itemErr) {
          console.error(`Failed to add item ${item.amazon_asin}:`, itemErr.message)
        }
      }
    }

    // ── STEP 3: Proceed to checkout ─────────────────────
    await page.goto('https://www.amazon.co.uk/cart', { waitUntil: 'networkidle2' })
    await page.waitForTimeout(1000)

    const proceedBtn = await page.$('[name="proceedToRetailCheckout"]')
    if (proceedBtn) {
      await proceedBtn.click()
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
    }

    // ── STEP 4: Set delivery address ─────────────────────
    // If you want to deliver directly to customer:
    // Look for "Add a new address" link and fill in customer address
    // For simplicity, this version ships to YOUR address first
    // then you forward (safer approach to start with)

    // Continue to payment (use saved card)
    await page.waitForTimeout(1500)

    // Click "Use this address" or "Continue"
    const continueBtn = await page.$('[data-feature-id="primary-cta-button"]') ||
                        await page.$('.a-button-primary input[type="submit"]')
    if (continueBtn) {
      await continueBtn.click()
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
    }

    // ── STEP 5: Place the order ──────────────────────────
    await page.waitForTimeout(2000)

    // Find and click "Place your order" button
    const placeOrderBtn = await page.$('[data-feature-id="place-order-button"]') ||
                          await page.$('input[name="placeYourOrder1"]') ||
                          await page.$('.place-your-order-button')

    if (placeOrderBtn) {
      await placeOrderBtn.click()
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })
    }

    // ── STEP 6: Extract Amazon order ID ─────────────────
    const pageContent = await page.content()
    const orderIdMatch = pageContent.match(/\d{3}-\d{7}-\d{7}/)
    const amazonOrderId = orderIdMatch ? orderIdMatch[0] : `MANUAL-${Date.now()}`

    await browser.close()
    return amazonOrderId

  } catch (err) {
    await browser.close()
    console.error('Amazon automation error:', err)
    throw new Error(`Amazon order failed: ${err.message}`)
  }
}

// ── MANUAL FALLBACK ──────────────────────────────────────
// If automation fails, this sends YOU an email with all the
// order details so you can place it manually within minutes
export async function getManualOrderDetails(order, items) {
  return {
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    deliveryAddress: order.delivery_address,
    items: items.map(i => ({
      name: i.product_name,
      asin: i.amazon_asin,
      url: i.amazon_url,
      qty: i.quantity,
      price: i.unit_price,
    })),
    orderTotal: order.total,
    quikcartOrderId: order.order_number,
  }
}
