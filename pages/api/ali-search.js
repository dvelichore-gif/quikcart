import { getAliProducts } from '../../lib/aliexpress'
export default async function handler(req, res) {
  const { q, limit } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })
  try {
    const products = await getAliProducts(q, { pageSize: limit ? parseInt(limit) : 20 })
    res.status(200).json({ products })
  } catch (err) { res.status(500).json({ error: err.message }) }
}
