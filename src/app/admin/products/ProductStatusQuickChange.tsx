'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/Toast'

const STATUS_OPTIONS = ['DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED'] as const
type Status = typeof STATUS_OPTIONS[number]

const statusColors: Record<Status, string> = {
  AVAILABLE: 'text-dc-lime',
  RESERVED: 'text-amber-400',
  SOLD: 'text-red-400',
  DRAFT: 'text-dc-muted',
  ARCHIVED: 'text-dc-mid',
}

export default function ProductStatusQuickChange({
  productId,
  currentStatus,
}: {
  productId: string
  currentStatus: Status
}) {
  const [status, setStatus] = useState<Status>(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: Status) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', productId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      setStatus(newStatus)
      toast.success(`Status updated to ${newStatus}`)
    }
    setLoading(false)
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={loading}
      className={`bg-transparent border border-dc-grey text-xs tracking-widest uppercase px-2 py-1 focus:outline-none focus:border-dc-lime cursor-pointer ${statusColors[status]} disabled:opacity-50`}
      aria-label="Change product status"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s} className="bg-dc-charcoal text-dc-cream normal-case tracking-normal">
          {s}
        </option>
      ))}
    </select>
  )
}
