import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../../lib/utils'

interface RegisterSelectOption {
  value: string
  label: string
}

interface RegisterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  placeholder: string
  options: RegisterSelectOption[]
  error?: string
}

/**
 * Dropdown sibling of `RegisterField` (e.g. "Tipo de veículo"). Wraps a native
 * select so it stays accessible while matching the wizard's field styling, with
 * a trailing chevron drawn over it.
 */
export const RegisterSelect = forwardRef<HTMLSelectElement, RegisterSelectProps>(
  ({ label, placeholder, options, error, className, defaultValue, ...props }, ref) => (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-medium text-white">{label}</span>
      <div className="relative flex h-[50px] items-center rounded-[18px] border border-accent-blue-soft bg-surface-card px-4">
        <select
          ref={ref}
          defaultValue={defaultValue ?? ''}
          className={cn(
            'h-full flex-1 appearance-none rounded-none border-0 bg-transparent pr-6 text-[15px] text-white outline-none [&>option]:text-black',
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 size-5 text-text-muted"
          aria-hidden
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  ),
)
RegisterSelect.displayName = 'RegisterSelect'
