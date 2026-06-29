import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { loginSchema, type LoginInput } from 'shared/schemas/auth'
import { useAuth } from '../../hooks/useAuth'
import { messageFromError } from '../../lib/errorMessages'
import { AuthLayout } from './components/AuthLayout'
import { AuthField } from './components/AuthField'
import { PasswordField } from './components/PasswordField'
import { useLogin } from './hooks/useLogin'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useLogin()

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: (result) => {
        login(result.accessToken)
        navigate('/')
      },
    })
  })

  return (
    <AuthLayout>
      <p className="text-[14px] font-medium text-text-muted">Seja bem-vindo!</p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-5">
        <AuthField
          label="E-mail"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="usuario@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordField
          label="Senha"
          autoComplete="current-password"
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
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate('/forgot-password')}
        className="mt-5 w-full text-center text-[15px] font-semibold text-accent-blue-soft transition-opacity hover:opacity-80"
      >
        Esqueci minha senha
      </button>
    </AuthLayout>
  )
}
