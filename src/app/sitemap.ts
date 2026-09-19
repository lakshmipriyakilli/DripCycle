import { notFound } from 'next/navigation'
import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dripcycle.vercel.app'
  const supabase = await createClient()

  const [{ data: products }, { data: collections }, { data: pages }] = await Promise.all([
    supabase.from('products').select('slug, updated_at').in('status', ['AVAILABLE', 'RESERVED', 'SOLD']),
    supabase.from('collections').select('slug, updated_at').eq('is_active', true),
    supabase.from('content_pages').select('slug, updated_at').eq('is_published', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/collections`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const productRoutes: MetadataRoute.Sitemap = (products || []).map(p => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map(c => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: c.updated_at,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const pageRoutes: MetadataRoute.Sitemap = (pages || []).map(p => ({
    url: `${siteUrl}/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...pageRoutes]
}
