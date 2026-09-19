import { WHATSAPP_MESSAGE_TEMPLATE } from './constants'

export function generateWhatsAppLink({
  phoneNumber,
  productName,
  productSku,
  price,
  slug,
  siteUrl,
}: {
  phoneNumber: string
  productName: string
  productSku: string
  price: number
  slug: string
  siteUrl: string
}): string {
  const productUrl = `${siteUrl}/product/${slug}`
  
  const message = WHATSAPP_MESSAGE_TEMPLATE({
    name: productName,
    sku: productSku,
    price,
    url: productUrl,
  })

  const cleaned = phoneNumber.replace(/[^0-9]/g, '')
  const withCountryCode = cleaned.startsWith('91') ? cleaned : `91${cleaned}`
  
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`
}

export function formatWhatsAppNumber(number: string): string {
  const cleaned = number.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`
  }
  return `+${cleaned}`
}
