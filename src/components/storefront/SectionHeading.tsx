import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  action?: React.ReactNode
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'left',
  size = 'md',
  className,
  action,
}: SectionHeadingProps) {
  const titleSizes = {
    sm: 'text-lg md:text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-5xl',
  }

  return (
    <div
      className={cn(
        'flex items-end justify-between gap-4 mb-8',
        align === 'center' && 'flex-col items-center text-center',
        className
      )}
    >
      <div>
        <h2
          className={cn(
            'font-bold tracking-wider uppercase text-dc-cream',
            titleSizes[size]
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-dc-muted text-sm tracking-wide">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
