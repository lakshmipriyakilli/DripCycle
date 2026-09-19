import { createClient } from '@/lib/supabase/server'
import ProductWizard from '@/components/admin/ProductWizard'
import type { Category } from '@/types'

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order')
  return (data || []) as Category[]
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Add Product</h1>
        <p className="text-dc-muted text-sm mt-1">Follow the steps to add a new product to your catalog.</p>
      </div>
      <ProductWizard categories={categories} />
    </div>
  )
}
