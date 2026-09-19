'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    disabled,
    className,
    children,
    ...props
  },
  ref
) => {
  const baseStyles = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold tracking-wider uppercase',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF21] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070808]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none',
  ]

  const variants = {
    primary: 'bg-[#B6FF21] text-[#070808] hover:bg-[#a8f010] active:bg-[#96d80e]',
    secondary: 'bg-transparent text-[#F5F1E8] border border-[#F5F1E8] hover:bg-[#F5F1E8] hover:text-[#070808]',
    outline: 'bg-transparent text-[#B6FF21] border border-[#B6FF21] hover:bg-[#B6FF21] hover:text-[#070808]',
    ghost: 'bg-transparent text-[#F5F1E8] hover:bg-[#1A1A1A]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#1fb855] active:bg-[#19a34a]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
