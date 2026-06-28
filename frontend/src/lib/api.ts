import { getAccessToken } from './authStorage'

const BASE_URL = import.meta.env.VITE_API_URL

/**
 * Thrown for any non-2xx response. `code` is the backend's error code
 * (the `{ error: code }` shape) so the UI can map it to a friendly message.
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code)
    this.name = 'ApiError'
  }
}

type RequestBody = Record<string, unknown> | unknown[]

function extractErrorCode(payload: unknown): string {
  if (typeof payload === 'object' && payload !== null && 'error' in payload) {
    const code = payload.error
    if (typeof code === 'string') return code
  }
  return 'INTERNAL_ERROR'
}

async function request<T>(method: string, path: string, body?: RequestBody): Promise<T> {
  const token = getAccessToken()

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null)
    throw new ApiError(extractErrorCode(payload), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  // HTTP trust boundary: the wrapper asserts the caller-declared shape.
  // Features that need stronger guarantees can validate with a Zod schema.
  return response.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: RequestBody) => request<T>('POST', path, body),
  put: <T>(path: string, body?: RequestBody) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: RequestBody) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
