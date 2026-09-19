import type { Metadata } from 'next'
import Navbar from '@/components/storefront/Navbar'
import Footer from '@/components/storefront/Footer'
import { createClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/types'

export const metadata: Metadata = {
  title: {
    default: 'DripCycle — Premium Thrift Fashion',
    template: '%s | DripCycle',
  },
  description: 'One-of-one pre-loved fashion curated for those who dress with intent.',
}

async function getSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('*').single()
    return data
  } catch {
    return null
  }
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <>
      <Navbar />
      {/* No top padding here — pages manage their own spacing based on whether they need it */}
      <main id="main-content">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  )
}
