import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { resetPasswordSchema, type ResetPasswordInput } from 'shared/schemas/auth'
import { messageFromError } from '../../lib/errorMessages'
import { AuthLayout } from './components/AuthLayout'
import { AuthField } from './components/AuthField'
import { PasswordField } from './components/PasswordField'
import { useResetPassword } from './hooks/useResetPassword'

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const mutation = useResetPassword()

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => navigate('/login'),
    })
  })

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-[18px] font-semibold text-accent-blue">
          Esqueci minha senha
        </h2>
        <p className="mt-2 text-[13px] font-medium text-text-muted">
          Enviamos um código de autenticação no seu e-mail para a renovação de senha
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
        <AuthField
          label="Código"
          icon={KeyRound}
          autoComplete="one-time-code"
          placeholder="Digite o Código"
          error={errors.code?.message}
          {...register('code')}
        />

        <PasswordField
          label="Nova Senha"
          autoComplete="new-password"
          placeholder="Digite sua senha"
          error={errors.password?.message}
          {...register('password')}
        />

        {mutation.isError && (
          <p className="text-sm text-red-400">{messageFromError(mutation.error)}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-1 w-full rounded-[18px] bg-accent-blue-dark py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending ? 'Enviando...' : 'Entrar'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mt-5 w-full text-center text-[15px] font-semibold text-red-500 transition-opacity hover:opacity-80"
      >
        Cancelar
      </button>
    </AuthLayout>
  )
}
