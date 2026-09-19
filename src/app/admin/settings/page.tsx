import { createClient } from '@/lib/supabase/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').single()
  return <SettingsClient initialSettings={data || {}} />
}
