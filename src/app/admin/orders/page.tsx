import { createClient } from '@/lib/supabase/server'
import OrdersClient from './OrdersClient'

export default async function OrdersPage() {
  const supabase = await createClient()
  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase.from('order_requests').select('*, product:products(name, sku)').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, sku, price').in('status', ['AVAILABLE', 'RESERVED']).order('name'),
  ])
  return <OrdersClient initialOrders={orders || []} products={products || []} />
}
