// lib/aliexpress.js — AliExpress Affiliate API client
import crypto from 'crypto'

const APP_KEY     = process.env.ALIEXPRESS_APP_KEY
const APP_SECRET  = process.env.ALIEXPRESS_APP_SECRET
const TRACKING_ID = process.env.ALIEXPRESS_TRACKING_ID || 'default'
const API_URL     = 'https://api-sg.aliexpress.com/sync'

function signRequest(params) {
  const sorted = Object.keys(params).sort()
  const str = APP_SECRET + sorted.map(k => `${k}${params[k]}`).join('') + APP_SECRET
  return crypto.createHmac('sha256', APP_SECRET).update(str).digest('hex').toUpperCase()
}

async function callApi(method, extra = {}) {
  const params = { method, app_key: APP_KEY, timestamp: new Date().toISOString().replace('T',' ').slice(0,19), sign_method:'sha256', format:'json', v:'2.0', ...extra }
  params.sign = signRequest(params)
  const res = await fetch(`${API_URL}?${new URLSearchParams(params)}`)
  if (!res.ok) throw new Error(`AliExpress API error: ${res.status}`)
  const data = await res.json()
  const keys = Object.keys(data)
  return data[keys[0]]?.result || data[keys[0]] || data
}

export async function getAliProducts(keyword, { pageSize=20, pageNo=1 }={}) {
  const result = await callApi('aliexpress.affiliate.product.query', {
    keywords: keyword, page_size: pageSize, page_no: pageNo,
    fields: 'product_id,product_title,product_main_image_url,product_detail_url,target_sale_price,target_original_price,evaluate_rate,lastest_volume,discount',
    target_currency:'GBP', target_language:'EN', tracking_id:TRACKING_ID, ship_to_country:'GB',
  })
  return (result?.products?.product || []).map(item => normalise(item))
}

export async function getAliProduct(productId) {
  const result = await callApi('aliexpress.affiliate.productdetail.get', {
    product_ids: productId,
    fields: 'product_id,product_title,product_main_image_url,product_sub_image_urls,product_detail_url,target_sale_price,target_original_price,evaluate_rate,lastest_volume,product_description',
    target_currency:'GBP', target_language:'EN', tracking_id:TRACKING_ID,
  })
  const item = result?.products?.product?.[0]
  if (!item) throw new Error('Product not found')
  return normalise(item, true)
}

export function buildCartLink(aliProductId, quantity=1) {
  return `https://www.aliexpress.com/item/${aliProductId}.html?quantity=${quantity}`
}

export function buildFulfilmentLink(aliProductId, quantity, addr) {
  const note = encodeURIComponent(`Ship to: ${addr.name}, ${addr.line1}, ${addr.city}, ${addr.postcode}`)
  return `${buildCartLink(aliProductId, quantity)}&note=${note}`
}

function normalise(item, full=false) {
  const price    = parseFloat(item.target_sale_price || 0)
  const origPrice= parseFloat(item.target_original_price || 0)
  return {
    id: String(item.product_id), ali_product_id: String(item.product_id),
    name: item.product_title,
    description: full ? (item.product_description || item.product_title) : item.product_title,
    price, original_price: origPrice > price ? origPrice : null,
    image_url: item.product_main_image_url,
    gallery: full ? (item.product_sub_image_urls?.string || []) : [],
    ali_url: item.product_detail_url, category: 'General',
    rating: item.evaluate_rate ? parseFloat(item.evaluate_rate)/20 : 4.3,
    reviews: parseInt(item.lastest_volume || 0), discount: parseInt(item.discount || 0),
    in_stock: true, emoji: '📦',
  }
}
