import { useId, type ChangeEvent } from 'react'
import { Upload, type LucideIcon } from 'lucide-react'

interface DocumentUploadProps {
  icon: LucideIcon
  title: string
  description: string
  value: File | null
  onChange: (file: File | null) => void
  error?: string
}

/**
 * Single document slot in the wizard's Documentos step: a thumbnail box, a label
 * with instructions, and an "ADICIONAR ARQUIVO" trigger backed by a hidden file
 * input. The selected file's name replaces the instructions once chosen.
 */
export function DocumentUpload({
  icon: Icon,
  title,
  description,
  value,
  onChange,
  error,
}: DocumentUploadProps) {
  const inputId = useId()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null)
  }

  return (
    <div className="flex gap-4 border-b border-card-border py-4">
      <div className="flex size-[65px] shrink-0 items-center justify-center rounded-[5px] border border-text-muted">
        <Icon className="size-8 text-accent-blue-soft" aria-hidden />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-medium text-white">{title}</span>
        <span className="text-[10px] font-medium text-text-muted">
          {value ? value.name : description}
        </span>

        <label
          htmlFor={inputId}
          className="mt-1 inline-flex w-fit cursor-pointer items-center gap-1 rounded-[3px] border border-white bg-card-border px-2 py-1 text-[8px] font-medium uppercase text-white transition-opacity hover:opacity-80"
        >
          <Upload className="size-3" aria-hidden />
          Adicionar arquivo
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={handleChange}
        />

        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </div>
  )
}
