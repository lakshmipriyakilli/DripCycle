'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/components/ui/Toast'
import { ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react'
import type { ContentPage } from '@/types'

interface ContentCMSClientProps {
  initialPages: ContentPage[]
}

const PAGE_LABELS: Record<string, string> = {
  about: 'About DripCycle',
  sustainability: 'Sustainability',
  faq: 'FAQ',
  contact: 'Contact',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms & Conditions',
  shipping: 'Shipping Information',
  returns: 'Returns & Exchanges',
}

export default function ContentCMSClient({ initialPages }: ContentCMSClientProps) {
  const [pages, setPages] = useState<ContentPage[]>(initialPages)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const updatePage = (slug: string, field: keyof ContentPage, value: unknown) => {
    setPages(prev => prev.map(p => p.slug === slug ? { ...p, [field]: value } : p))
  }

  const savePage = async (page: ContentPage) => {
    setSaving(page.slug)
    const supabase = createClient()
    const { error } = await supabase.from('content_pages').update({
      title: page.title,
      content: page.content,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      is_published: page.is_published,
    }).eq('id', page.id)

    if (error) toast.error('Failed to save.')
    else toast.success(`"${page.title}" saved!`)
    setSaving(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Content Pages</h1>
        <p className="text-dc-muted text-sm mt-1">Edit the content of your public-facing pages.</p>
      </div>

      <div className="space-y-3">
        {pages.map(page => {
          const isOpen = expanded === page.slug
          const label = PAGE_LABELS[page.slug] || page.slug

          return (
            <div key={page.id} className="bg-dc-charcoal border border-dc-grey">
              <button
                onClick={() => setExpanded(isOpen ? null : page.slug)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-dc-grey/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold tracking-widest uppercase text-dc-cream">{label}</span>
                  <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 ${page.is_published ? 'bg-dc-lime/20 text-dc-lime' : 'bg-dc-grey text-dc-muted'}`}>
                    {page.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-dc-muted" /> : <ChevronDown size={16} className="text-dc-muted" />}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-dc-grey">
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-dc-muted">/{page.slug}</span>
                      <button
                        onClick={() => updatePage(page.slug, 'is_published', !page.is_published)}
                        className={`flex items-center gap-2 text-sm transition-colors ${page.is_published ? 'text-dc-lime' : 'text-dc-muted'}`}
                      >
                        {page.is_published ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        {page.is_published ? 'Published' : 'Draft'}
                      </button>
                    </div>
                    <Input label="Page Title" value={page.title} onChange={e => updatePage(page.slug, 'title', e.target.value)} />
                  </div>
                  <Textarea
                    label="Content"
                    value={page.content}
                    onChange={e => updatePage(page.slug, 'content', e.target.value)}
                    rows={page.slug === 'faq' ? 12 : 8}
                    helper={page.slug === 'faq' ? 'FAQ format: JSON array of {question, answer} objects' : undefined}
                  />
                  <Input label="Meta Title (SEO)" value={page.meta_title || ''} onChange={e => updatePage(page.slug, 'meta_title', e.target.value)} />
                  <Input label="Meta Description (SEO)" value={page.meta_description || ''} onChange={e => updatePage(page.slug, 'meta_description', e.target.value)} />
                  <Button variant="primary" size="sm" onClick={() => savePage(page)} loading={saving === page.slug}>
                    Save Page
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
