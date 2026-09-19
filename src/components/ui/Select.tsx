import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  options: { value: string; label: string; disabled?: boolean }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>((
  { label, error, helper, required, options, placeholder, className, id, ...props },
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
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[#1A1A1A] border text-[#F5F1E8]',
            'px-4 py-3 pr-10 text-sm appearance-none',
            'transition-colors duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#B6FF21] focus:ring-offset-0',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[#2A2A2A] focus:border-[#B6FF21]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-[#1A1A1A]"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p className="text-xs text-[#8A8A8A]">{helper}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export { Select }
