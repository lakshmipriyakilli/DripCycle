import { createClient } from '@/lib/supabase/server'
import ContentCMSClient from './ContentCMSClient'

export default async function ContentPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('content_pages').select('*').order('slug')
  return <ContentCMSClient initialPages={data || []} />
}
