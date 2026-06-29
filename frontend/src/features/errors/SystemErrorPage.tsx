import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import illustration from '../../assets/system-error-illustration.svg'

interface SystemErrorPageProps {
  onRetry?: () => void
  onBack?: () => void
}

export function SystemErrorPage({ onRetry, onBack }: SystemErrorPageProps) {
  const navigate = useNavigate()

  const handleBack = onBack ?? (() => navigate(-1))
  const handleRetry = onRetry ?? (() => window.location.reload())

  return (
    <main className="flex min-h-screen flex-col bg-surface-dark px-6 font-poppins text-text-light">
      <header className="pt-5">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Voltar"
          className="text-text-light transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="size-8" />
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-10">
        <img
          src={illustration}
          alt="Tomada desconectada"
          className="w-[317px] max-w-full"
        />

        <div className="w-full max-w-[327px] rounded-[18px] border-[5px] border-card-border p-6">
          <h1 className="text-[20px] font-medium text-accent-blue">
            Erro no Sistema!
          </h1>
          <p className="mt-3 text-[15px] font-light leading-snug">
            Lamentamos muito, nossos servidores estão instáveis no momento, por
            favor aguarde.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-2 text-[20px] font-semibold italic text-accent-blue-soft underline decoration-solid underline-offset-4 transition-opacity hover:opacity-80"
        >
          <RefreshCw className="size-5" />
          Tentar Novamente
        </button>
      </div>
    </main>
  )
}
