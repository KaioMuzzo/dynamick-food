import { api } from '../../lib/api'
import type { RegisterDriverInput } from 'shared/schemas/auth'

export interface RegisterDriverResponse {
  id: string
  name: string
  email: string
}

export function registerDriver(input: RegisterDriverInput) {
  return api.post<RegisterDriverResponse>('/auth/register/driver', input)
}
