import { ApiError } from './api'

/**
 * Maps backend error codes to user-facing messages (pt-BR).
 * Keep this in sync with the backend's `errorCodes.ts`.
 */
const MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Verifique os dados informados.',
  NOT_FOUND: 'Recurso não encontrado.',
  TOO_MANY_REQUESTS: 'Muitas tentativas. Tente novamente em instantes.',
  INTERNAL_ERROR: 'Algo deu errado. Tente novamente.',
}

const FALLBACK = MESSAGES.INTERNAL_ERROR

export function messageFromError(error: unknown): string {
  if (error instanceof ApiError && error.code in MESSAGES) {
    return MESSAGES[error.code]
  }
  return FALLBACK
}
