// DripCycle Application Types

export type ProductStatus = 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED'

export type ProductCondition =
  | 'New'
  | 'Like New'
  | 'Excellent'
  | 'Very Good'
  | 'Good'
  | 'Vintage/Distressed'

export type OrderStatus =
  | 'REQUESTED'
  | 'RESERVED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'COMPLETED'

export interface Measurements {
  chest?: string
  shoulder?: string
  length?: string
  sleeve?: string
  waist?: string
  hip?: string
  inseam?: string
  [key: string]: string | undefined
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  storage_path: string
  url: string
  sort_order: number
  is_cover: boolean
  alt_text: string | null
  created_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  category_id: string
  price: number
  size: string
  condition: ProductCondition
  brand: string | null
  color: string | null
  fit: string | null
  material: string | null
  measurements: Measurements | null
  description: string
  tags: string[] | null
  status: ProductStatus
  is_featured: boolean
  is_new_drop: boolean
  created_at: string
  updated_at: string
  // Joined fields
  category?: Category
  images?: ProductImage[]
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  products?: Product[]
}

export interface HomepageSection {
  id: string
  section_key: string
  title: string | null
  subtitle: string | null
  content: Record<string, unknown> | null
  image_url: string | null
  cta_label: string | null
  cta_link: string | null
  is_visible: boolean
  sort_order: number
  updated_at: string
}

export interface ContentPage {
  id: string
  slug: string
  title: string
  content: string
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  updated_at: string
}

export interface OrderRequest {
  id: string
  customer_name: string
  whatsapp_number: string
  product_id: string | null
  product_sku: string
  product_name: string
  amount: number
  status: OrderStatus
  payment_note: string | null
  payment_reference: string | null
  created_at: string
  updated_at: string
  product?: Product
}

export interface SiteSettings {
  id: string
  whatsapp_number: string
  store_name: string
  contact_email: string | null
  contact_phone: string | null
  instagram_handle: string | null
  social_links: Record<string, string> | null
  footer_text: string | null
  meta_title: string | null
  meta_description: string | null
  updated_at: string
}
