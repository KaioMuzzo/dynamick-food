import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { AuthField } from './AuthField'

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

/** Password variant of `AuthField` with a lock icon and a show/hide toggle. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <AuthField
        ref={ref}
        label={label}
        icon={Lock}
        error={error}
        type={visible ? 'text' : 'password'}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((previous) => !previous)}
            className="shrink-0 text-text-muted transition-colors hover:text-white"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        }
        {...props}
      />
    )
  },
)
PasswordField.displayName = 'PasswordField'
