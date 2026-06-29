import { Fragment } from 'react'
import { cn } from '../../../../lib/utils'

const STEPS = [1, 2, 3] as const

export type RegisterStep = (typeof STEPS)[number]

/**
 * Three numbered circles joined by lines, marking progress through the driver
 * registration wizard. The active step is highlighted in yellow.
 */
export function StepIndicator({ current }: { current: RegisterStep }) {
  return (
    <div className="flex items-center" aria-hidden>
      {STEPS.map((step) => (
        <Fragment key={step}>
          {step > 1 && <span className="h-px flex-1 bg-card-border" />}
          <span
            className={cn(
              'flex size-[38px] shrink-0 items-center justify-center rounded-full text-[20px] font-semibold',
              step === current
                ? 'bg-accent-yellow-soft text-black'
                : 'border border-card-border bg-surface-card text-white',
            )}
          >
            {step}
          </span>
        </Fragment>
      ))}
    </div>
  )
}
