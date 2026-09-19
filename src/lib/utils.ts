import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSKU(categoryName: string, sequence: number): string {
  const prefix = categoryName
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 3)
    .padEnd(3, 'X')
  const seq = String(sequence).padStart(4, '0')
  return `DC-${prefix}-${seq}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function isValidWhatsAppNumber(number: string): boolean {
  const cleaned = number.replace(/[^0-9]/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function buildWhatsAppLink(number: string, message: string): string {
  const cleaned = number.replace(/[^0-9]/g, '')
  const withCountryCode = cleaned.startsWith('91') ? cleaned : `91${cleaned}`
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`
}
