'use client'

import { useRef, useState } from 'react'
import { Upload, X, Star } from 'lucide-react'

interface UploadedImage {
  id?: string
  file?: File
  url: string
  storage_path?: string
  is_cover: boolean
  sort_order: number
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 8

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const newImages: UploadedImage[] = []
    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) return
      if (file.size > MAX_SIZE_MB * 1024 * 1024) return
      const url = URL.createObjectURL(file)
      newImages.push({
        file,
        url,
        is_cover: images.length === 0 && newImages.length === 0,
        sort_order: images.length + newImages.length,
      })
    })
    onChange([...images, ...newImages])
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    // If removed was cover, set first as cover
    if (images[index].is_cover && updated.length > 0) {
      updated[0] = { ...updated[0], is_cover: true }
    }
    onChange(updated.map((img, i) => ({ ...img, sort_order: i })))
  }

  const setCover = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, is_cover: i === index })))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
          dragging ? 'border-dc-lime bg-dc-lime/5' : 'border-dc-grey hover:border-dc-lime/50'
        }`}
      >
        <Upload size={32} className="mx-auto text-dc-muted mb-3" />
        <p className="text-dc-cream text-sm font-medium">Drop photos here or click to upload</p>
        <p className="text-dc-muted text-xs mt-1">JPEG, PNG, WebP · Max {MAX_SIZE_MB}MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative group border-2 transition-all ${img.is_cover ? 'border-dc-lime' : 'border-dc-grey'}`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-dc-grey">
                <img src={img.url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
              </div>

              {/* Cover indicator */}
              {img.is_cover && (
                <div className="absolute top-1 left-1 bg-dc-lime text-dc-black text-[9px] font-bold px-1.5 py-0.5 tracking-wider uppercase">
                  Cover
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-dc-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_cover && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCover(i) }}
                    className="p-1.5 bg-dc-lime text-dc-black hover:bg-[#a8f010] transition-colors"
                    title="Set as cover"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                  className="p-1.5 bg-red-700 text-white hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-dc-muted text-xs">
          {images.length} photo{images.length !== 1 ? 's' : ''} · Hover to set cover or remove
        </p>
      )}
    </div>
  )
}
