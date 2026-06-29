import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, Store } from 'lucide-react'
import background from '../../assets/welcome-background.png'
import logo from '../../assets/brand-logo.svg'

// Decorative "speed line" strokes from the design (Figma: azul-detalhes lines).
// Positions match the 375px-wide reference frame.
// Nudged down so the topmost stroke clears the "D" of the title.
const SPEED_LINES_OFFSET_Y = 24

const SPEED_LINES = [
  { left: 340, top: 117, opacity: 1 },
  { left: 315, top: 131, opacity: 0.6 },
  { left: 351, top: 147, opacity: 1 },
  { left: 340, top: 170, opacity: 0.6 },
  { left: 308, top: 196, opacity: 1 },
  { left: 358, top: 203, opacity: 0.6 },
  { left: 343, top: 222, opacity: 1 },
  { left: 319, top: 227, opacity: 0.8 },
]

function SpeedLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPEED_LINES.map((line) => (
        <span
          key={`${line.left}-${line.top}`}
          className="absolute h-px w-[114px] origin-center -rotate-[167.91deg] bg-accent-blue"
          style={{
            left: line.left,
            top: line.top + SPEED_LINES_OFFSET_Y,
            opacity: line.opacity,
          }}
        />
      ))}
    </div>
  )
}

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
    <main className="relative mx-auto flex min-h-screen max-w-[375px] flex-col overflow-hidden bg-surface-dark font-poppins">
      <img
        src={background}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />

      <SpeedLines />

      <div className="relative flex flex-1 flex-col">
        <header className="flex flex-col items-center pt-6 text-center">
          <img src={logo} alt="" aria-hidden className="size-[140px]" />
          <h1 className="text-[36px] font-extrabold italic leading-none text-accent-blue">
            Dynamick Food
          </h1>
          <p className="mt-2 text-[16px] font-medium text-accent-blue">
            Valorizando o Trabalhador
          </p>
        </header>

        <div className="flex-1" />

        <section className="mx-6 mt-6 rounded-t-[18px] border border-b-0 border-card-border bg-surface-card p-6 pb-10">
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
        </section>
      </div>
    </main>
  )
}
