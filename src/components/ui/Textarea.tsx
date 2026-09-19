import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  { label, error, helper, required, className, id, ...props },
  ref
) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#F5F1E8]">
          {label}
          {required && <span className="text-[#B6FF21] ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full bg-[#1A1A1A] border text-[#F5F1E8] placeholder-[#4A4A4A]',
          'px-4 py-3 text-sm resize-y min-h-[120px]',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#B6FF21] focus:ring-offset-0',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-[#2A2A2A] focus:border-[#B6FF21]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-xs text-[#8A8A8A]">{helper}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }
