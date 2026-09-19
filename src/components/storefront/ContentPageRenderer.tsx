import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { ContentPage } from '@/types'

async function getPage(slug: string): Promise<ContentPage | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as ContentPage | null
}

export async function generateMetadata({ slug }: { slug: string }): Promise<Metadata> {
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
  }
}

export async function ContentPageRenderer({ slug }: { slug: string }) {
  const page = await getPage(slug)
  if (!page) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-dc-cream mb-8 leading-tight uppercase">
        {page.title}
      </h1>
      <div className="prose prose-invert prose-sm max-w-none">
        {page.content.startsWith('[') ? (
          /* FAQ format — JSON array */
          <FaqContent content={page.content} />
        ) : (
          <div className="text-dc-cream/80 leading-relaxed whitespace-pre-line text-base">
            {page.content}
          </div>
        )}
      </div>
    </div>
  )
}

function FaqContent({ content }: { content: string }) {
  let items: { question: string; answer: string }[] = []
  try { items = JSON.parse(content) } catch { return null }

  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <details key={i} className="border border-dc-grey group open:border-dc-lime transition-colors">
          <summary className="px-6 py-4 cursor-pointer text-dc-cream font-semibold tracking-wide list-none flex items-center justify-between hover:text-dc-lime transition-colors">
            {item.question}
            <span className="text-dc-lime ml-4 flex-shrink-0 text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
          </summary>
          <div className="px-6 pb-4 text-dc-muted text-sm leading-relaxed border-t border-dc-grey">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  )
}
