import { type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerDriverSchema, type RegisterDriverInput } from 'shared/schemas/auth'
import { useRegisterDriver } from './hooks/useRegisterDriver'
import { messageFromError } from '../../lib/errorMessages'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  )
}

export function RegisterDriverPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDriverInput>({
    resolver: zodResolver(registerDriverSchema),
  })

  const mutation = useRegisterDriver()

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Cadastro de motorista</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Field label="Nome" error={errors.name?.message}>
          <Input {...register('name')} />
        </Field>

        <Field label="CPF" error={errors.cpf?.message}>
          <Input {...register('cpf')} />
        </Field>

        <Field label="CNH" error={errors.cnh?.message}>
          <Input {...register('cnh')} />
        </Field>

        <Field label="Telefone" error={errors.phone?.message}>
          <Input {...register('phone')} />
        </Field>

        <Field label="E-mail" error={errors.email?.message}>
          <Input type="email" {...register('email')} />
        </Field>

        <Field label="Senha" error={errors.password?.message}>
          <Input type="password" {...register('password')} />
        </Field>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enviando...' : 'Cadastrar'}
        </Button>

        {mutation.isError && (
          <p className="text-sm text-red-600">{messageFromError(mutation.error)}</p>
        )}
        {mutation.isSuccess && (
          <p className="text-sm text-green-600">Cadastro realizado com sucesso!</p>
        )}
      </form>
    </main>
  )
}
