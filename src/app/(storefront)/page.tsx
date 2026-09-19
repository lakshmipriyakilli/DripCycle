import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/storefront/ProductCard'
import { ArrowRight } from 'lucide-react'
import type { HomepageSection, Product, Category, SiteSettings } from '@/types'

async function getHomepageData() {
  try {
    const supabase = await createClient()
    const [sectionsRes, productsRes, categoriesRes, settingsRes] = await Promise.all([
      supabase.from('homepage_sections').select('*').order('sort_order'),
      supabase.from('products')
        .select('*, category:categories(id,name,slug), images:product_images(*)')
        .in('status', ['AVAILABLE', 'RESERVED', 'SOLD'])
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('site_settings').select('*').single(),
    ])
    return {
      sections: (sectionsRes.data || []) as HomepageSection[],
      products: (productsRes.data || []) as Product[],
      categories: (categoriesRes.data || []) as Category[],
      settings: settingsRes.data as SiteSettings | null,
    }
  } catch {
    return { sections: [], products: [], categories: [], settings: null }
  }
}

function getSection(sections: HomepageSection[], key: string) {
  return sections.find((s) => s.section_key === key)
}

export default async function HomePage() {
  const { sections, products, categories, settings } = await getHomepageData()

  const newDropProducts = products.filter((p) => p.is_new_drop && p.status === 'AVAILABLE').slice(0, 6)
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4)
  const instagramHandle = settings?.instagram_handle || 'dripcycle'
  const whatsappNumber = settings?.whatsapp_number?.replace(/\D/g, '') || ''

  return (
    <>
      {/* =====================================================
          HERO — full viewport, image background, editorial text
          ===================================================== */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="DripCycle — vintage fashion rack"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Left-to-right gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-dc-black/90 via-dc-black/60 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-dc-black via-transparent to-dc-black/20" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16 md:pb-24 pt-28 md:pt-40">
          <div className="max-w-2xl">
            {/* Label */}
            <p className="text-label text-dc-lime mb-6 animate-fade-in">
              Thrift&nbsp;&nbsp;×&nbsp;&nbsp;Style&nbsp;&nbsp;×&nbsp;&nbsp;Sustainability
            </p>

            {/* Headline */}
            <h1 className="hero-text-shadow animate-fade-up">
              <span className="block text-[13vw] sm:text-[9vw] md:text-[7.5vw] font-black tracking-tight leading-[0.9] uppercase text-dc-cream">
                FIND YOUR
              </span>
              <span className="block text-[13vw] sm:text-[9vw] md:text-[7.5vw] font-black tracking-tight leading-[0.9] uppercase text-dc-lime">
                NEXT DRIP.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-dc-cream/70 text-sm md:text-base leading-relaxed mt-6 max-w-md animate-fade-up-delay-1">
              One-of-one pre-loved pieces curated for those who dress with intent. Every item is unique — once it's gone, it's gone.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-10 animate-fade-up-delay-2">
              <Link
                href="/shop?filter=new_drop"
                className="inline-flex items-center gap-2 bg-dc-lime text-dc-black px-6 py-3 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-white transition-colors duration-200"
              >
                Shop New Arrivals <ArrowRight size={13} />
              </Link>
              <Link
                href="/shop?q=vintage"
                className="inline-flex items-center gap-2 border border-dc-cream/30 text-dc-cream px-6 py-3 text-[11px] font-semibold tracking-[0.15em] uppercase hover:border-dc-cream transition-colors duration-200"
              >
                Explore Vintage
              </Link>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 right-4 sm:right-6 hidden md:flex flex-col items-center gap-2 animate-fade-in">
            <div className="w-px h-12 bg-dc-grey/60" />
            <span className="text-section-number writing-mode-vertical-lr rotate-90 mt-2">Scroll</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          01 / NEW DROP
          ===================================================== */}
      {newDropProducts.length > 0 && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-section-number mb-2">01&nbsp;/&nbsp;New Drop</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-dc-cream leading-none">
                JUST IN
              </h2>
            </div>
            <Link
              href="/shop?filter=new_drop"
              className="group hidden sm:flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-dc-muted hover:text-dc-lime transition-colors"
            >
              View All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {newDropProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 3} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link
              href="/shop?filter=new_drop"
              className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-dc-muted hover:text-dc-lime transition-colors"
            >
              View All New Drops <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      )}

      {/* =====================================================
          EDITORIAL STRIP — "DON'T FOLLOW THE CYCLE."
          ===================================================== */}
      <section className="bg-dc-lime py-12 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-dc-black/50 mb-3">
                The DripCycle Ethos
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-dc-black uppercase leading-none">
                DON'T FOLLOW<br className="hidden md:block" /> THE CYCLE.
              </h2>
            </div>
            <p className="text-dc-black/60 text-sm max-w-xs leading-relaxed md:text-right">
              Fashion doesn't have to cost the earth. Every piece you buy pre-loved keeps it out of landfill and into your wardrobe.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          02 / FEATURED DRIP
          ===================================================== */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-section-number mb-2">02&nbsp;/&nbsp;Featured Drip</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-dc-cream leading-none">
                HANDPICKED
              </h2>
            </div>
            <Link
              href="/shop"
              className="group hidden sm:flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-dc-muted hover:text-dc-lime transition-colors"
            >
              Browse All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetric featured layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {featuredProducts.slice(0, 2).map((product, i) => (
              <div key={product.id} className={i === 0 ? 'col-span-2 md:col-span-2' : 'col-span-2 md:col-span-2'}>
                <ProductCard product={product} />
              </div>
            ))}
            {featuredProducts.slice(2).map((product) => (
              <div key={product.id} className="col-span-1 md:col-span-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          03 / SHOP BY CATEGORY
          ===================================================== */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24 border-t border-dc-grey/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10 md:mb-14">
              <p className="text-section-number mb-2">03&nbsp;/&nbsp;Shop by Category</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-dc-cream leading-none">
                CATEGORIES
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px border border-dc-grey/40">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group border border-dc-grey/40 p-5 md:p-7 flex flex-col justify-between min-h-[110px] md:min-h-[140px] hover:bg-dc-charcoal transition-colors duration-200"
                >
                  <span className="text-section-number text-dc-mid group-hover:text-dc-lime transition-colors">{cat.slug.slice(0, 3).toUpperCase()}</span>
                  <span className="text-dc-cream text-xs font-semibold tracking-widest uppercase leading-tight group-hover:text-dc-lime transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          04 / BRAND STORY
          ===================================================== */}
      <section className="py-16 md:py-28 border-t border-dc-grey/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <p className="text-section-number mb-4">04&nbsp;/&nbsp;The Story</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-dc-cream leading-tight mb-6">
                WEAR IT.<br />LOVE IT.<br />PASS IT ON.
              </h2>
              <p className="text-dc-muted text-sm leading-relaxed max-w-sm mb-6">
                DripCycle started with one belief: great style shouldn't come at the cost of the planet. We curate only the best pre-loved pieces — every item is inspected, photographed, and priced honestly.
              </p>
              <p className="text-dc-muted text-sm leading-relaxed max-w-sm mb-10">
                No algorithms. No fast fashion. Just real pieces with real history, ready for their next chapter with you.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-dc-lime hover:text-dc-cream transition-colors group"
              >
                Our Story <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Sustainability stats */}
            <div className="grid grid-cols-2 gap-px border border-dc-grey/40">
              {[
                { value: '100%', label: 'Pre-loved' },
                { value: '1 of 1', label: 'Every piece' },
                { value: '0', label: 'New production' },
                { value: '∞', label: 'Style cycles' },
              ].map(({ value, label }) => (
                <div key={label} className="border border-dc-grey/40 p-8 flex flex-col justify-between">
                  <span className="text-4xl md:text-5xl font-black text-dc-lime tracking-tight">{value}</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-dc-muted mt-4">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INSTAGRAM CTA
          ===================================================== */}
      <section className="py-16 md:py-20 border-t border-dc-grey/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-section-number mb-3">Follow the Drip</p>
            <p className="text-2xl md:text-4xl font-black tracking-tight uppercase text-dc-cream">
              @{instagramHandle}
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dc-grey text-dc-muted hover:border-dc-lime hover:text-dc-lime transition-colors text-[11px] font-semibold tracking-[0.15em] uppercase px-6 py-3"
            >
              Follow on Instagram
            </a>
            {whatsappNumber && (
              <a
                href={`https://wa.me/91${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dc-lime text-dc-black hover:bg-white transition-colors text-[11px] font-black tracking-[0.15em] uppercase px-6 py-3"
              >
                Order via WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
