import { supabaseAdmin } from './supabase'

export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').eq('in_stock', true)
    .order('created_at', { ascending: false })
  if (error) { console.error('getProducts error:', error); return [] }
  return data
}

export async function getProductById(id) {
  const { data, error } = await supabaseAdmin
    .from('products').select('*').eq('id', id).single()
  if (error) { console.error('getProductById error:', error); return null }
  return data
}
