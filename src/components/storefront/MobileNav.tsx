'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { X } from 'lucide-react'

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?filter=new_drop', label: 'New Drop', accent: true },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/sustainability', label: 'Sustainability' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-dc-black flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-dc-grey">
        <Link
          href="/"
          onClick={onClose}
          className="font-bold text-xl tracking-[0.2em] uppercase"
        >
          DRIP<span className="text-dc-lime">CYCLE</span>
        </Link>
        <button
          onClick={onClose}
          className="p-2 text-dc-muted hover:text-dc-cream transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col justify-center px-6 gap-2" aria-label="Mobile navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`text-3xl font-bold tracking-widest uppercase py-3 border-b border-dc-grey/30 transition-colors ${
              link.accent
                ? 'text-dc-lime hover:text-dc-cream'
                : 'text-dc-cream hover:text-dc-lime'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-dc-grey">
        <Link
          href="https://instagram.com/dripcycle"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-dc-muted hover:text-dc-lime transition-colors text-sm tracking-widest uppercase"
        >
          <InstagramIcon size={18} />
          @dripcycle
        </Link>
      </div>
    </div>
  )
}
