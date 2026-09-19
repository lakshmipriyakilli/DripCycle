// DripCycle Constants

export const PRODUCT_STATUSES = [
  { value: 'DRAFT', label: 'Draft', color: 'dc-muted' },
  { value: 'AVAILABLE', label: 'Available', color: 'dc-lime' },
  { value: 'RESERVED', label: 'Reserved', color: 'amber' },
  { value: 'SOLD', label: 'Sold', color: 'red' },
  { value: 'ARCHIVED', label: 'Archived', color: 'dc-muted' },
] as const

export const PRODUCT_CONDITIONS = [
  { value: 'New', label: 'New', description: 'Unworn with tags' },
  { value: 'Like New', label: 'Like New', description: 'Worn once, no signs of wear' },
  { value: 'Excellent', label: 'Excellent', description: 'Minimal signs of wear' },
  { value: 'Very Good', label: 'Very Good', description: 'Light signs of wear' },
  { value: 'Good', label: 'Good', description: 'Moderate wear, clearly noted' },
  { value: 'Vintage/Distressed', label: 'Vintage/Distressed', description: 'Authentic vintage wear or intentional distressing' },
] as const

export const ORDER_STATUSES = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
] as const

export const FIT_OPTIONS = [
  'Regular',
  'Slim',
  'Oversized',
  'Relaxed',
  'Baggy',
  'Cropped',
  'Tailored',
]

export const SIZE_PRESETS = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '28', '29', '30', '31', '32', '33', '34', '36', '38',
  'One Size',
  'Custom',
]

export const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'length', label: 'Length' },
  { key: 'sleeve', label: 'Sleeve' },
  { key: 'waist', label: 'Waist' },
  { key: 'hip', label: 'Hip' },
  { key: 'inseam', label: 'Inseam' },
] as const

export const TAG_SUGGESTIONS = [
  'Vintage',
  'Streetwear',
  'Y2K',
  'Denim',
  'Luxury',
  '90s',
  '80s',
  'Grunge',
  'Minimalist',
  'Workwear',
  'Casual',
  'Formal',
  'Cottagecore',
  'Gorpcore',
  'Techwear',
]

export const PUBLIC_PRODUCT_STATUSES: string[] = ['AVAILABLE', 'RESERVED', 'SOLD']

export const WHATSAPP_MESSAGE_TEMPLATE = (product: {
  name: string
  sku: string
  price: number
  url: string
}) => `Hi DripCycle! I'd like to order this product.

Product: ${product.name}
SKU: ${product.sku}
Price: ₹${product.price.toLocaleString('en-IN')}
Link: ${product.url}`
