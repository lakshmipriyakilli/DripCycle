import { createClient } from '@/lib/supabase/server'
import { MessageCircle, Mail, Phone } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/SocialIcons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the DripCycle team.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').single()
  const { data: page } = await supabase.from('content_pages').select('content').eq('slug', 'contact').single()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-dc-cream mb-4 uppercase">
        Contact Us
      </h1>
      <p className="text-dc-muted mb-12 text-lg">{page?.content || 'We are happy to help!'}</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {settings?.whatsapp_number && (
          <a
            href={`https://wa.me/91${settings.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 border border-dc-grey p-6 hover:border-dc-lime transition-colors"
          >
            <MessageCircle size={24} className="text-dc-lime flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-dc-cream font-semibold tracking-widest uppercase text-sm mb-1">WhatsApp</p>
              <p className="text-dc-muted text-sm">Fastest way to reach us — click to chat</p>
              <p className="text-dc-lime text-sm mt-1">+91 {settings.whatsapp_number}</p>
            </div>
          </a>
        )}
        {settings?.instagram_handle && (
          <a
            href={`https://instagram.com/${settings.instagram_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 border border-dc-grey p-6 hover:border-dc-lime transition-colors"
          >
            <InstagramIcon size={24} className="text-dc-lime flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-dc-cream font-semibold tracking-widest uppercase text-sm mb-1">Instagram</p>
              <p className="text-dc-muted text-sm">DMs welcome — we reply fast</p>
              <p className="text-dc-lime text-sm mt-1">@{settings.instagram_handle}</p>
            </div>
          </a>
        )}
        {settings?.contact_email && (
          <a
            href={`mailto:${settings.contact_email}`}
            className="group flex items-start gap-4 border border-dc-grey p-6 hover:border-dc-lime transition-colors"
          >
            <Mail size={24} className="text-dc-lime flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-dc-cream font-semibold tracking-widest uppercase text-sm mb-1">Email</p>
              <p className="text-dc-muted text-sm">{settings.contact_email}</p>
            </div>
          </a>
        )}
        {settings?.contact_phone && (
          <a
            href={`tel:${settings.contact_phone}`}
            className="group flex items-start gap-4 border border-dc-grey p-6 hover:border-dc-lime transition-colors"
          >
            <Phone size={24} className="text-dc-lime flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-dc-cream font-semibold tracking-widest uppercase text-sm mb-1">Phone</p>
              <p className="text-dc-muted text-sm">{settings.contact_phone}</p>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}
