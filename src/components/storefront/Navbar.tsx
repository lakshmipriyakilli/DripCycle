'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/sustainability', label: 'Sustainability' },
]

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, searchOpen])

  const isHeroPage = pathname === '/'
  const isActive = (href: string) =>
    href === '/shop'
      ? pathname.startsWith('/shop') || pathname.startsWith('/product')
      : pathname.startsWith(href)

  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || !isHeroPage || menuOpen
            ? 'bg-dc-black/95 backdrop-blur-sm border-b border-dc-grey/40'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* Logo + Brand Name */}
            <Link
              href="/"
              className="shrink-0 flex items-center gap-2.5"
              aria-label="DripCycle home"
            >
              <Image
                src="/logo.png"
                alt="DripCycle"
                width={36}
                height={36}
                className="h-9 w-9 object-contain rounded-full"
                priority
              />
              <span className="text-base md:text-lg font-black tracking-[0.12em] uppercase leading-none">
                DRIP<span className="text-dc-lime">CYCLE</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-200 pb-0.5',
                    isActive(href)
                      ? 'text-dc-cream'
                      : 'text-dc-muted hover:text-dc-cream'
                  )}
                >
                  {label}
                  {/* Active lime underline */}
                  <span
                    className={cn(
                      'absolute -bottom-px left-0 h-px bg-dc-lime transition-all duration-300',
                      isActive(href) ? 'w-full' : 'w-0'
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
                className="p-1.5 text-dc-muted hover:text-dc-cream transition-colors"
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.5} />
              </button>

              {/* Instagram */}
              <Link
                href="https://instagram.com/dripcycle"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-dc-muted hover:text-dc-cream transition-colors hidden sm:flex"
                aria-label="DripCycle on Instagram"
              >
                <InstagramIcon size={17} />
              </Link>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}
                className="p-1.5 text-dc-muted hover:text-dc-cream transition-colors md:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={19} strokeWidth={1.5} /> : <Menu size={19} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-dc-black flex flex-col transition-all duration-300 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!menuOpen}
      >
        <div className="h-14 border-b border-dc-grey/40" />
        <nav className="flex flex-col px-6 pt-10 gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center justify-between py-5 border-b border-dc-grey/30 transition-colors duration-200',
                isActive(href) ? 'text-dc-cream' : 'text-dc-muted hover:text-dc-cream'
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-baseline gap-4">
                <span className="text-section-number text-dc-mid w-4">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-2xl font-black tracking-tight uppercase">{label}</span>
              </div>
              {isActive(href) && <span className="w-1.5 h-1.5 bg-dc-lime" />}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-6 pb-10 flex items-center gap-6">
          <Link href="https://instagram.com/dripcycle" target="_blank" className="text-dc-muted hover:text-dc-lime transition-colors flex items-center gap-2 text-xs tracking-widest uppercase">
            <InstagramIcon size={15} /> @dripcycle
          </Link>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-dc-black/98 flex flex-col" role="search">
          <div className="flex items-center border-b border-dc-grey px-4 sm:px-6 h-14 md:h-16">
            <Search size={16} className="text-dc-muted shrink-0 mr-3" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  window.location.href = `/shop?q=${encodeURIComponent(query.trim())}`
                }
              }}
              placeholder="Search pieces…"
              className="flex-1 bg-transparent text-dc-cream placeholder-dc-mid text-base focus:outline-none"
            />
            <button onClick={() => setSearchOpen(false)} className="p-1.5 text-dc-muted hover:text-dc-cream transition-colors ml-3">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
          <div className="px-4 sm:px-6 pt-8">
            <p className="text-section-number mb-5">Quick search</p>
            <div className="flex flex-wrap gap-2">
              {['Vintage', 'Streetwear', 'Denim', 'Y2K', 'Oversized', '90s'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { window.location.href = `/shop?q=${tag}` }}
                  className="border border-dc-grey text-dc-muted hover:border-dc-lime hover:text-dc-lime transition-colors text-[11px] tracking-[0.12em] uppercase px-3 py-1.5"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
