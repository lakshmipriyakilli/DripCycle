import Link from 'next/link'
import type { SiteSettings } from '@/types'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

interface FooterProps {
  settings: SiteSettings | null
}

const SHOP_LINKS = [
  { href: '/shop', label: 'All Pieces' },
  { href: '/shop?filter=new_drop', label: 'New Drop' },
  { href: '/collections', label: 'Collections' },
  { href: '/shop?q=vintage', label: 'Vintage' },
]

const INFO_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/sustainability', label: 'Sustainability' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/returns', label: 'Returns' },
]

export default function Footer({ settings }: FooterProps) {
  const whatsappNumber = settings?.whatsapp_number?.replace(/\D/g, '') || ''
  const instagramHandle = settings?.instagram_handle || 'dripcycle'
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-dc-grey/60 bg-dc-black">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-black tracking-[0.18em] uppercase block mb-4">
              DRIP<span className="text-dc-lime">CYCLE</span>
            </Link>
            <p className="text-dc-muted text-xs leading-relaxed max-w-[180px]">
              Premium pre-loved fashion. Curated one-of-one pieces for those who don't follow the cycle.
            </p>
            {/* Order instructions */}
            <div className="mt-6 border-l-2 border-dc-lime pl-4">
              <p className="text-[10px] text-dc-lime tracking-widest uppercase font-semibold mb-1">How to order</p>
              <p className="text-dc-muted text-xs leading-relaxed">
                Browse → tap Order via WhatsApp → confirm payment via UPI.
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dc-muted mb-5">Shop</p>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs tracking-wide text-dc-cream/70 hover:text-dc-cream transition-colors duration-200 link-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dc-muted mb-5">Info</p>
            <ul className="space-y-3">
              {INFO_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs tracking-wide text-dc-cream/70 hover:text-dc-cream transition-colors duration-200 link-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dc-muted mb-5">Connect</p>
            <div className="space-y-3">
              {instagramHandle && (
                <a
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-dc-cream/70 hover:text-dc-cream transition-colors group"
                >
                  <InstagramIcon size={13} />
                  <span className="link-underline">@{instagramHandle}</span>
                </a>
              )}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/91${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-dc-cream/70 hover:text-dc-lime transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.842L.057 23.885a.5.5 0 0 0 .612.612l6.04-1.453A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 0 1-5.04-1.388l-.361-.215-3.735.899.916-3.636-.236-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.562 6.562 2.182 12 2.182S21.818 6.562 21.818 12 17.438 21.818 12 21.818z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
              {settings?.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="block text-xs text-dc-cream/70 hover:text-dc-cream transition-colors link-underline"
                >
                  {settings.contact_email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dc-grey/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dc-mid text-[10px] tracking-widest uppercase">
            © {year} DripCycle. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-dc-mid text-[10px] tracking-widest uppercase hover:text-dc-muted transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
