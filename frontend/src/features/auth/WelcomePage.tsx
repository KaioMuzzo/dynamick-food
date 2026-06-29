import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Store } from 'lucide-react'
import { AuthLayout } from './components/AuthLayout'

function RoleButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1 text-center transition-opacity hover:opacity-80"
    >
      <span className="text-accent-yellow-soft">{icon}</span>
      <span className="text-[12px] font-medium text-white">{label}</span>
      <span className="text-[8px] font-medium uppercase text-text-muted">
        Faça seu cadastro
      </span>
    </button>
  )
}

export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <p className="text-[14px] font-medium text-text-muted">Seja bem-vindo!</p>

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mt-5 w-full rounded-[18px] bg-accent-blue-dark py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
      >
        Acessar sua Conta
      </button>

      <div className="mt-8 flex justify-between gap-4">
        <RoleButton
          icon={<Bike className="size-7" />}
          label="SOU ENTREGADOR"
          onClick={() => navigate('/register/driver')}
        />
        <RoleButton
          icon={<Store className="size-7" />}
          label="SOU CLIENTE"
          onClick={() => navigate('/register/client')}
        />
      </div>
    </AuthLayout>
  )
}
