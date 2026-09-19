'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/components/ui/Toast'
import { ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'
import type { HomepageSection } from '@/types'
import Link from 'next/link'

interface HomepageCMSClientProps {
  initialSections: HomepageSection[]
  products: { id: string; name: string; sku: string; is_featured: boolean; is_new_drop: boolean }[]
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  new_drop: 'New Drop Section',
  featured: 'Featured Products',
  categories: 'Shop by Category',
  brand_story: 'Brand Story',
  sustainability: 'Sustainability',
  social: 'Social / Instagram',
}

export default function HomepageCMSClient({ initialSections, products }: HomepageCMSClientProps) {
  const [sections, setSections] = useState<HomepageSection[]>(initialSections)
  const [saving, setSaving] = useState<string | null>(null)

  const updateSection = (key: string, field: keyof HomepageSection, value: unknown) => {
    setSections(prev => prev.map(s => s.section_key === key ? { ...s, [field]: value } : s))
  }

  const saveSection = async (section: HomepageSection) => {
    setSaving(section.section_key)
    const supabase = createClient()
    const { error } = await supabase.from('homepage_sections').update({
      title: section.title,
      subtitle: section.subtitle,
      cta_label: section.cta_label,
      cta_link: section.cta_link,
      image_url: section.image_url,
      is_visible: section.is_visible,
    }).eq('id', section.id)

    if (error) toast.error('Failed to save.')
    else toast.success(`${SECTION_LABELS[section.section_key] || section.section_key} saved!`)
    setSaving(null)
  }

  const handleProductFlag = async (productId: string, field: 'is_featured' | 'is_new_drop', value: boolean) => {
    const supabase = createClient()
    await supabase.from('products').update({ [field]: value }).eq('id', productId)
    toast.success('Product updated!')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Homepage CMS</h1>
          <p className="text-dc-muted text-sm mt-1">Manage what appears on your homepage.</p>
        </div>
        <Link href="/" target="_blank" className="inline-flex items-center gap-2 text-dc-muted hover:text-dc-lime text-sm transition-colors">
          <ExternalLink size={14} /> View Homepage
        </Link>
      </div>

      <div className="space-y-6">
        {sections.map(section => {
          const label = SECTION_LABELS[section.section_key] || section.section_key
          return (
            <div key={section.id} className="bg-dc-charcoal border border-dc-grey p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream">{label}</h2>
                <button
                  onClick={() => {
                    updateSection(section.section_key, 'is_visible', !section.is_visible)
                    const s = sections.find(s => s.section_key === section.section_key)!
                    saveSection({ ...s, is_visible: !section.is_visible })
                  }}
                  className={`flex items-center gap-2 text-sm transition-colors ${section.is_visible ? 'text-dc-lime' : 'text-dc-muted'}`}
                >
                  {section.is_visible ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {section.is_visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="space-y-4">
                {section.section_key !== 'categories' && (
                  <>
                    <Input label="Title" value={section.title || ''} onChange={e => updateSection(section.section_key, 'title', e.target.value)} />
                    <Input label="Subtitle" value={section.subtitle || ''} onChange={e => updateSection(section.section_key, 'subtitle', e.target.value)} />
                  </>
                )}
                {['hero', 'brand_story'].includes(section.section_key) && (
                  <Input label="Image URL" value={section.image_url || ''} onChange={e => updateSection(section.section_key, 'image_url', e.target.value)} placeholder="https://…" helper="Paste a direct image URL" />
                )}
                {section.cta_label !== undefined && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="CTA Label" value={section.cta_label || ''} onChange={e => updateSection(section.section_key, 'cta_label', e.target.value)} />
                    <Input label="CTA Link" value={section.cta_link || ''} onChange={e => updateSection(section.section_key, 'cta_link', e.target.value)} />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={() => saveSection(section)} loading={saving === section.section_key}>
                  Save {label}
                </Button>
              </div>
            </div>
          )
        })}

        {/* Product flags */}
        <div className="bg-dc-charcoal border border-dc-grey p-6">
          <h2 className="text-sm font-bold tracking-widest uppercase text-dc-cream mb-4">Feature & New Drop Products</h2>
          <p className="text-dc-muted text-xs mb-5">Toggle which products appear in Featured Drip and New Drop sections.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-dc-grey">
                  <th className="text-left px-3 py-2 text-dc-muted text-xs tracking-widest uppercase font-medium">Product</th>
                  <th className="px-3 py-2 text-dc-muted text-xs tracking-widest uppercase font-medium text-center">Featured</th>
                  <th className="px-3 py-2 text-dc-muted text-xs tracking-widest uppercase font-medium text-center">New Drop</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-dc-grey/50">
                    <td className="px-3 py-2.5 text-dc-cream">{p.name}<span className="text-dc-muted text-xs ml-2 font-mono">{p.sku}</span></td>
                    <td className="px-3 py-2.5 text-center">
                      <input type="checkbox" defaultChecked={p.is_featured} onChange={e => handleProductFlag(p.id, 'is_featured', e.target.checked)} className="w-4 h-4 accent-dc-lime" />
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <input type="checkbox" defaultChecked={p.is_new_drop} onChange={e => handleProductFlag(p.id, 'is_new_drop', e.target.checked)} className="w-4 h-4 accent-dc-lime" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
