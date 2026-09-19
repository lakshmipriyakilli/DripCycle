import { cn } from '@/lib/utils'

type BadgeVariant =
  | 'lime'
  | 'sold'
  | 'reserved'
  | 'draft'
  | 'new-drop'
  | 'vintage'
  | 'one-of-one'
  | 'available'
  | 'archived'
  | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  lime: 'bg-[#B6FF21] text-[#070808]',
  sold: 'bg-red-900/50 text-red-300 border border-red-800',
  reserved: 'bg-amber-900/50 text-amber-300 border border-amber-800',
  draft: 'bg-[#2A2A2A] text-[#8A8A8A] border border-[#4A4A4A]',
  'new-drop': 'bg-[#B6FF21] text-[#070808]',
  vintage: 'bg-[#2A2A2A] text-[#F5F1E8] border border-[#4A4A4A]',
  'one-of-one': 'bg-transparent text-[#B6FF21] border border-[#B6FF21]',
  available: 'bg-emerald-900/50 text-emerald-300 border border-emerald-800',
  archived: 'bg-[#1A1A1A] text-[#4A4A4A] border border-[#2A2A2A]',
  neutral: 'bg-[#2A2A2A] text-[#F5F1E8]',
}

export function Badge({ variant = 'neutral', children, className, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold tracking-wider uppercase',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
