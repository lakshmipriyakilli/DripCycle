'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

interface ProductData {
  name: string
  category_id: string
  price: string
  size: string
  condition: string
  brand?: string
  color?: string
  fit?: string
  material?: string
  measurements?: Record<string, string | undefined>
  description: string
  tags?: string
  is_featured: boolean
  is_new_drop: boolean
}

export async function createProduct(data: ProductData, publish: boolean) {
  // Verify the user is an authenticated admin via server-side session
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: 'Not authorized' }

  // Use admin client to bypass RLS for insert
  const admin = createAdminClient()

  const slug = generateSlug(data.name)
  const sku = `DC-${data.name.slice(0, 3).toUpperCase().padEnd(3, 'X')}-${Date.now().toString().slice(-4)}`
  const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
  const measurements = data.measurements && Object.keys(data.measurements).length ? data.measurements : null

  const { data: created, error } = await admin
    .from('products')
    .insert({
      name: data.name.trim(),
      slug,
      sku,
      category_id: data.category_id,
      price: Number(data.price),
      size: data.size.trim(),
      condition: data.condition,
      brand: data.brand || null,
      color: data.color || null,
      fit: data.fit || null,
      material: data.material || null,
      measurements,
      description: data.description.trim(),
      tags,
      status: publish ? 'AVAILABLE' : 'DRAFT',
      is_featured: data.is_featured,
      is_new_drop: data.is_new_drop,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return { productId: created.id }
}

export async function uploadProductImage(
  productId: string,
  fileBase64: string,
  fileName: string,
  isCover: boolean,
  sortOrder: number,
  productName: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: 'Not authorized' }

  const admin = createAdminClient()

  // Convert base64 back to binary
  const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, '')
  const buffer = Buffer.from(base64Data, 'base64')
  const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${productId}/${Date.now()}-${sortOrder}.${ext}`
  const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`

  const { error: uploadErr } = await admin.storage
    .from('product-images')
    .upload(path, buffer, { contentType: mimeType, upsert: false })

  if (uploadErr) return { error: uploadErr.message }

  const { data: urlData } = admin.storage.from('product-images').getPublicUrl(path)

  await admin.from('product_images').insert({
    product_id: productId,
    storage_path: path,
    url: urlData.publicUrl,
    sort_order: sortOrder,
    is_cover: isCover,
    alt_text: productName,
  })

  return { url: urlData.publicUrl, path }
}

export async function updateProductStatus(productId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return { error: 'Not authorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('products').update({ status }).eq('id', productId)
  if (error) return { error: error.message }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}
