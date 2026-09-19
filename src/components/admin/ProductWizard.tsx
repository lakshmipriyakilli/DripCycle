'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { PRODUCT_CONDITIONS, FIT_OPTIONS, SIZE_PRESETS, MEASUREMENT_FIELDS, TAG_SUGGESTIONS } from '@/lib/constants'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Category, Measurements, ProductCondition } from '@/types'
import { Check, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { createProduct, uploadProductImage } from '@/app/admin/products/actions'

interface ProductWizardProps {
  categories: Category[]
  productId?: string
  initialData?: Partial<WizardData>
}

interface UploadedImage {
  id?: string
  file?: File
  url: string
  storage_path?: string
  is_cover: boolean
  sort_order: number
}

interface WizardData {
  images: UploadedImage[]
  name: string
  category_id: string
  price: string
  size: string
  condition: ProductCondition | ''
  brand: string
  color: string
  fit: string
  material: string
  measurements: Measurements
  description: string
  tags: string
  status: 'DRAFT' | 'AVAILABLE'
  is_featured: boolean
  is_new_drop: boolean
}

const STEPS = [
  { id: 1, label: 'Photos' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Pricing' },
  { id: 4, label: 'Optional' },
  { id: 5, label: 'Measurements' },
  { id: 6, label: 'Description' },
  { id: 7, label: 'Publish' },
]

const emptyData: WizardData = {
  images: [], name: '', category_id: '', price: '', size: '', condition: '',
  brand: '', color: '', fit: '', material: '',
  measurements: {}, description: '', tags: '',
  status: 'DRAFT', is_featured: false, is_new_drop: false,
}

export default function ProductWizard({ categories, productId, initialData }: ProductWizardProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>({ ...emptyData, ...initialData })
  const [errors, setErrors] = useState<Partial<Record<keyof WizardData, string>>>({})
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const update = (field: keyof WizardData, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validateStep = (s: number): boolean => {
    const errs: typeof errors = {}
    if (s === 1 && data.images.length === 0) errs.images = 'At least one photo is required to publish.'
    if (s === 2) {
      if (!data.name.trim()) errs.name = 'Product name is required.'
      if (!data.category_id) errs.category_id = 'Category is required.'
    }
    if (s === 3) {
      if (!data.price || isNaN(Number(data.price)) || Number(data.price) < 0) errs.price = 'Valid price is required.'
      if (!data.size.trim()) errs.size = 'Size is required.'
      if (!data.condition) errs.condition = 'Condition is required.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length))
  }
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSave = async (publish: boolean) => {
    if (!validateStep(step)) return
    if (!data.name || !data.category_id || !data.price || !data.size || !data.condition) {
      toast.error('Please complete all required fields before saving.')
      return
    }

    setSaving(true)
    try {
      // Step 1: Create the product via server action
      const result = await createProduct({
        name: data.name,
        category_id: data.category_id,
        price: data.price,
        size: data.size,
        condition: data.condition,
        brand: data.brand,
        color: data.color,
        fit: data.fit,
        material: data.material,
        measurements: Object.keys(data.measurements).length ? data.measurements : undefined,
        description: data.description,
        tags: data.tags,
        is_featured: data.is_featured,
        is_new_drop: data.is_new_drop,
      }, publish)

      if (result.error) {
        toast.error(result.error)
        return
      }

      const pid = result.productId!

      // Step 2: Upload images via server action (convert File → base64)
      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i]
        if (img.file) {
          try {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(img.file!)
            })
            await uploadProductImage(pid, base64, img.file.name, img.is_cover, i, data.name)
          } catch {
            // Image upload failure is non-fatal — product still created
            console.warn('Image upload failed for image', i)
          }
        }
      }

      toast.success(publish ? 'Product published!' : 'Draft saved!')
      router.push('/admin/products')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const conditionOptions = PRODUCT_CONDITIONS.map((c) => ({ value: c.value, label: c.label }))
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))
  const fitOptions = FIT_OPTIONS.map((f) => ({ value: f, label: f }))

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
        {STEPS.map((s) => (
          <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center justify-center w-8 h-8 text-xs font-bold transition-all ${
                s.id === step
                  ? 'bg-dc-lime text-dc-black'
                  : s.id < step
                    ? 'bg-dc-lime/20 text-dc-lime cursor-pointer hover:bg-dc-lime/30'
                    : 'bg-dc-grey text-dc-muted cursor-default'
              }`}
            >
              {s.id < step ? <Check size={14} /> : s.id}
            </button>
            <span className={`text-xs tracking-widest uppercase hidden sm:block ${s.id === step ? 'text-dc-cream' : 'text-dc-muted'}`}>
              {s.label}
            </span>
            {s.id < STEPS.length && <div className="w-6 h-px bg-dc-grey hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="max-w-2xl">

        {/* STEP 1: Images */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-2">Upload Photos</h2>
            <p className="text-dc-muted text-sm mb-6">Upload 3–6 photos. First image will be used as the cover unless you change it.</p>
            <ImageUploader
              images={data.images}
              onChange={(imgs) => update('images', imgs)}
            />
            {errors.images && <p className="text-red-400 text-sm mt-2">{errors.images}</p>}
          </div>
        )}

        {/* STEP 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-2">Product Details</h2>
            <Input
              label="Product Name"
              required
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Vintage Oversized Denim Jacket"
              error={errors.name}
            />
            <Select
              label="Category"
              required
              value={data.category_id}
              onChange={(e) => update('category_id', e.target.value)}
              options={categoryOptions}
              placeholder="Select a category"
              error={errors.category_id}
            />
          </div>
        )}

        {/* STEP 3: Pricing */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-2">Pricing & Size</h2>
            <Input
              label="Price (₹)"
              required
              type="number"
              min="0"
              value={data.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="1499"
              error={errors.price}
            />
            <div>
              <label className="text-sm font-medium text-dc-cream mb-2 block">
                Size <span className="text-dc-lime">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SIZE_PRESETS.filter(s => s !== 'Custom').map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update('size', s)}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-widest uppercase border transition-colors ${
                      data.size === s
                        ? 'bg-dc-lime text-dc-black border-dc-lime'
                        : 'border-dc-grey text-dc-muted hover:border-dc-lime hover:text-dc-lime'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or type custom size…"
                value={!SIZE_PRESETS.includes(data.size) ? data.size : ''}
                onChange={(e) => update('size', e.target.value)}
                error={errors.size}
              />
            </div>
            <Select
              label="Condition"
              required
              value={data.condition}
              onChange={(e) => update('condition', e.target.value as ProductCondition)}
              options={conditionOptions}
              placeholder="Select condition"
              error={errors.condition}
              helper={data.condition ? PRODUCT_CONDITIONS.find(c => c.value === data.condition)?.description : undefined}
            />
          </div>
        )}

        {/* STEP 4: Optional */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-1">Additional Details</h2>
            <p className="text-dc-muted text-sm mb-4">All optional — fill in what you know.</p>
            <Input label="Brand" value={data.brand} onChange={(e) => update('brand', e.target.value)} placeholder="e.g. Levi's, Nike, Unknown" />
            <Input label="Color" value={data.color} onChange={(e) => update('color', e.target.value)} placeholder="e.g. Indigo Blue" />
            <Select label="Fit" value={data.fit} onChange={(e) => update('fit', e.target.value)} options={fitOptions} placeholder="Select fit" />
            <Input label="Material / Fabric" value={data.material} onChange={(e) => update('material', e.target.value)} placeholder="e.g. 100% Cotton" />
          </div>
        )}

        {/* STEP 5: Measurements */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-1">Measurements</h2>
            <p className="text-dc-muted text-sm mb-4">Optional but highly recommended. Fill in what applies.</p>
            {MEASUREMENT_FIELDS.map(({ key, label }) => (
              <Input
                key={key}
                label={label}
                value={data.measurements[key] || ''}
                onChange={(e) => update('measurements', { ...data.measurements, [key]: e.target.value })}
                placeholder={`e.g. 42 inches`}
              />
            ))}
          </div>
        )}

        {/* STEP 6: Description */}
        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-1">Description</h2>
            <Textarea
              label="Product Description"
              value={data.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe this piece — its story, unique features, why it's special…"
              rows={5}
            />
            <div>
              <label className="text-sm font-medium text-dc-cream mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TAG_SUGGESTIONS.map((tag) => {
                  const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean)
                  const active = tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const newTags = active ? tags.filter(t => t !== tag) : [...tags, tag]
                        update('tags', newTags.join(', '))
                      }}
                      className={`px-3 py-1 text-xs font-medium tracking-widest uppercase border transition-colors ${
                        active ? 'bg-dc-lime text-dc-black border-dc-lime' : 'border-dc-grey text-dc-muted hover:border-dc-lime hover:text-dc-lime'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
              <Input
                value={data.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="Vintage, Streetwear, Y2K…"
                helper="Comma-separated tags"
              />
            </div>
          </div>
        )}

        {/* STEP 7: Publish */}
        {step === 7 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold tracking-widest uppercase text-dc-cream mb-1">Ready to Publish?</h2>

            {/* Summary */}
            <div className="bg-dc-charcoal border border-dc-grey p-6 space-y-3 text-sm">
              <p className="text-dc-cream font-semibold">{data.name || '—'}</p>
              <p className="text-dc-muted">Category: {categories.find(c => c.id === data.category_id)?.name || '—'}</p>
              <p className="text-dc-muted">Price: {data.price ? `₹${Number(data.price).toLocaleString('en-IN')}` : '—'}</p>
              <p className="text-dc-muted">Size: {data.size || '—'} · Condition: {data.condition || '—'}</p>
              <p className="text-dc-muted">Images: {data.images.length}</p>
            </div>

            {/* Flags */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.is_new_drop}
                  onChange={(e) => update('is_new_drop', e.target.checked)}
                  className="w-4 h-4 accent-dc-lime"
                />
                <span className="text-sm text-dc-cream group-hover:text-dc-lime transition-colors">Mark as New Drop</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.is_featured}
                  onChange={(e) => update('is_featured', e.target.checked)}
                  className="w-4 h-4 accent-dc-lime"
                />
                <span className="text-sm text-dc-cream group-hover:text-dc-lime transition-colors">Feature on Homepage</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleSave(false)}
                loading={saving}
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleSave(true)}
                loading={saving}
                className="flex-1"
              >
                Publish Product
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-dc-grey">
          <Button variant="ghost" onClick={prev} disabled={step === 1}>
            <ChevronLeft size={16} /> Back
          </Button>
          <div className="flex gap-3">
            {step < STEPS.length && (
              <>
                {step >= 2 && (
                  <Button variant="ghost" size="sm" onClick={() => handleSave(false)} loading={saving}>
                    Save Draft
                  </Button>
                )}
                <Button variant="primary" onClick={next}>
                  Next <ChevronRight size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
