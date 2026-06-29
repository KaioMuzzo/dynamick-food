import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input } from '../../../../components/ui/input'
import { cn } from '../../../../lib/utils'

interface RegisterFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/**
 * Compact field used inside the driver registration wizard: a small label above
 * a rounded, dark, blue-bordered input box. Unlike `AuthField` it has no leading
 * icon and a tighter height, matching the Cadastro de Entregador design.
 */
export const RegisterField = forwardRef<HTMLInputElement, RegisterFieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] font-medium text-white">{label}</span>
      <div className="flex h-[50px] items-center rounded-[18px] border border-accent-blue-soft bg-surface-card px-4">
        <Input
          ref={ref}
          className={cn(
            'h-full flex-1 rounded-none border-0 bg-transparent p-0 text-[15px] text-white shadow-none placeholder:text-text-placeholder focus-visible:ring-0',
            className,
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  ),
)
RegisterField.displayName = 'RegisterField'
