'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/components/ui/Toast'
import { MessageCircle, Mail, Phone } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/SocialIcons'
import type { SiteSettings } from '@/types'

interface SettingsClientProps {
  initialSettings: Partial<SiteSettings>
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<Partial<SiteSettings>>(initialSettings)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('site_settings').update({
      whatsapp_number: settings.whatsapp_number || '',
      store_name: settings.store_name || 'DripCycle',
      contact_email: settings.contact_email || null,
      contact_phone: settings.contact_phone || null,
      instagram_handle: settings.instagram_handle || null,
      footer_text: settings.footer_text || null,
      meta_title: settings.meta_title || null,
      meta_description: settings.meta_description || null,
    }).eq('id', settings.id)

    if (error) toast.error('Failed to save settings.')
    else toast.success('Settings saved!')
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Settings</h1>
        <p className="text-dc-muted text-sm mt-1">Configure your store settings. These are used across the storefront.</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Store */}
        <section className="bg-dc-charcoal border border-dc-grey p-6 space-y-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream mb-2">Store</h2>
          <Input label="Store Name" value={settings.store_name || ''} onChange={e => update('store_name', e.target.value)} />
        </section>

        {/* WhatsApp */}
        <section className="bg-dc-charcoal border border-dc-lime/40 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={16} className="text-dc-lime" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream">WhatsApp Number</h2>
          </div>
          <p className="text-dc-muted text-xs">This number is used for all ORDER VIA WHATSAPP buttons on your store. Enter digits only (no country code).</p>
          <Input
            label="WhatsApp Number"
            required
            value={settings.whatsapp_number || ''}
            onChange={e => update('whatsapp_number', e.target.value)}
            placeholder="9876543210"
            helper="Indian mobile number without +91 prefix"
          />
          {settings.whatsapp_number && (
            <a
              href={`https://wa.me/91${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-dc-lime text-xs hover:underline"
            >
              Test WhatsApp link →
            </a>
          )}
        </section>

        {/* Social */}
        <section className="bg-dc-charcoal border border-dc-grey p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <InstagramIcon size={16} className="text-dc-muted" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream">Social</h2>
          </div>
          <Input
            label="Instagram Handle"
            value={settings.instagram_handle || ''}
            onChange={e => update('instagram_handle', e.target.value.replace('@', ''))}
            placeholder="dripcycle"
            helper="Without the @ symbol"
          />
        </section>

        {/* Contact */}
        <section className="bg-dc-charcoal border border-dc-grey p-6 space-y-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream mb-2">Contact Info</h2>
          <Input
            label="Contact Email"
            type="email"
            value={settings.contact_email || ''}
            onChange={e => update('contact_email', e.target.value)}
            placeholder="hello@dripcycle.in"
          />
          <Input
            label="Contact Phone"
            value={settings.contact_phone || ''}
            onChange={e => update('contact_phone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </section>

        {/* Footer */}
        <section className="bg-dc-charcoal border border-dc-grey p-6 space-y-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream mb-2">Footer</h2>
          <Input
            label="Footer Text"
            value={settings.footer_text || ''}
            onChange={e => update('footer_text', e.target.value)}
            placeholder="© 2026 DripCycle. All rights reserved."
          />
        </section>

        {/* SEO */}
        <section className="bg-dc-charcoal border border-dc-grey p-6 space-y-4">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream mb-2">Default SEO</h2>
          <Input label="Default Meta Title" value={settings.meta_title || ''} onChange={e => update('meta_title', e.target.value)} />
          <Input label="Default Meta Description" value={settings.meta_description || ''} onChange={e => update('meta_description', e.target.value)} />
        </section>

        <Button variant="primary" size="lg" onClick={handleSave} loading={saving} fullWidth>
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
