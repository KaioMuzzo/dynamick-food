import { type ReactNode } from 'react'
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react'

interface AccordionSectionProps {
  icon: LucideIcon
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

/**
 * Collapsible card used for each wizard step (Dados Pessoais, Dados do Veículo,
 * Documentos). The header is always visible; the body renders only when open.
 */
export function AccordionSection({
  icon: Icon,
  title,
  isOpen,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <section className="rounded-[18px] border border-card-border bg-surface-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-5 py-5 text-left"
      >
        <Icon className="size-5 shrink-0 text-accent-blue" aria-hidden />
        <span className="flex-1 text-[14px] font-semibold text-white">{title}</span>
        {isOpen ? (
          <ChevronUp className="size-5 text-white" aria-hidden />
        ) : (
          <ChevronDown className="size-5 text-white" aria-hidden />
        )}
      </button>

      {isOpen && <div className="px-5 pb-6">{children}</div>}
    </section>
  )
}
