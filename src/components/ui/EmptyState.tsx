import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-20 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="text-[#2A2A2A] mb-6" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#F5F1E8] uppercase tracking-wider mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#8A8A8A] max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
