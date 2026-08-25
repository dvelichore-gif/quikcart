import { getAliProduct } from '../../lib/aliexpress'
import { supabaseAdmin } from '../../lib/supabase'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { productId, markupPercent = 15 } = req.body
  if (!productId) return res.status(400).json({ error: 'Missing productId' })
  try {
    const item = await getAliProduct(productId)
    const sellPrice = parseFloat((item.price * (1 + markupPercent / 100)).toFixed(2))
    const { data, error } = await supabaseAdmin.from('products').upsert({
      name: item.name, description: item.description, price: sellPrice,
      original_price: item.original_price ? parseFloat((item.original_price * (1 + markupPercent / 100)).toFixed(2)) : null,
      image_url: item.image_url, ali_product_id: item.ali_product_id,
      ali_url: item.ali_url, category: item.category, rating: item.rating,
      reviews: item.reviews, in_stock: true, emoji: '📦',
    }, { onConflict: 'ali_product_id' }).select().single()
    if (error) throw error
    res.status(200).json({ success: true, product: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
