'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import type { Product } from '@/types'

interface WhatsAppCTAProps {
  product: Product
  whatsappNumber: string
  siteUrl: string
}

export default function WhatsAppCTA({ product, whatsappNumber, siteUrl }: WhatsAppCTAProps) {
  const isAvailable = product.status === 'AVAILABLE'
  const isReserved = product.status === 'RESERVED'
  const isSold = product.status === 'SOLD'

  if (isSold) {
    return (
      <div className="space-y-3">
        <div className="border border-red-900 bg-red-950/30 px-6 py-4 text-center">
          <p className="text-red-400 font-bold tracking-widest uppercase text-sm">SOLD OUT</p>
          <p className="text-dc-muted text-xs mt-1">This piece has found a new home.</p>
        </div>
      </div>
    )
  }

  if (isReserved) {
    return (
      <div className="border border-amber-900 bg-amber-950/20 px-6 py-4 text-center">
        <p className="text-amber-400 font-bold tracking-widest uppercase text-sm">RESERVED</p>
        <p className="text-dc-muted text-xs mt-1">This item is currently reserved. Check back soon.</p>
      </div>
    )
  }

  if (!isAvailable) return null

  const link = generateWhatsAppLink({
    phoneNumber: whatsappNumber,
    productName: product.name,
    productSku: product.sku,
    price: product.price,
    slug: product.slug,
    siteUrl,
  })

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label={`Order ${product.name} via WhatsApp`}
    >
      <Button
        variant="whatsapp"
        size="lg"
        fullWidth
        className="text-sm tracking-widest"
      >
        <MessageCircle size={20} />
        ORDER VIA WHATSAPP
      </Button>
    </a>
  )
}
