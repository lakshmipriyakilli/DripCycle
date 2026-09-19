import { createClient } from '@/lib/supabase/server'
import CollectionsClient from './CollectionsClient'

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('collections').select('*').order('sort_order')
  return <CollectionsClient initialCollections={data || []} />
}
