import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { cn } from '../../../lib/utils'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
  trailing?: ReactNode
  error?: string
}

/**
 * Auth screen input: a label above a rounded, dark, blue-bordered box with a
 * leading icon and an optional trailing adornment (e.g. a password toggle).
 * Wraps the base `Input` so it stays a single source of input behavior.
 */
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, icon: Icon, trailing, error, className, ...props }, ref) => (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text-muted">{label}</span>
      <div className="flex h-16 items-center gap-3 rounded-[18px] border border-accent-blue-soft bg-surface-card px-4">
        <Icon className="size-5 shrink-0 text-text-muted" aria-hidden />
        <Input
          ref={ref}
          className={cn(
            'h-full flex-1 rounded-none border-0 bg-transparent p-0 text-[15px] text-white shadow-none placeholder:text-text-placeholder focus-visible:ring-0',
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {error && <span className="text-sm text-red-400">{error}</span>}
    </label>
  ),
)
AuthField.displayName = 'AuthField'
