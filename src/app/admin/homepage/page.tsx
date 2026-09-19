import { createClient } from '@/lib/supabase/server'
import HomepageCMSClient from './HomepageCMSClient'

export default async function HomepagePage() {
  const supabase = await createClient()
  const [{ data: sections }, { data: products }] = await Promise.all([
    supabase.from('homepage_sections').select('*').order('sort_order'),
    supabase.from('products').select('id, name, sku, status, is_featured, is_new_drop').in('status', ['AVAILABLE', 'RESERVED']).order('name'),
  ])
  return <HomepageCMSClient initialSections={sections || []} products={products || []} />
}
