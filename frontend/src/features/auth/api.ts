import { api } from '../../lib/api'
import type {
  LoginInput,
  RegisterDriverInput,
  ResetPasswordInput,
} from 'shared/schemas/auth'

export interface RegisterDriverResponse {
  id: string
  name: string
  email: string
}

export function registerDriver(input: RegisterDriverInput) {
  return api.post<RegisterDriverResponse>('/auth/register/driver', input)
}

export interface LoginResponse {
  accessToken: string
}

export function login(input: LoginInput) {
  return api.post<LoginResponse>('/auth/login', input)
}

export function resetPassword(input: ResetPasswordInput) {
  return api.post<void>('/auth/reset-password', input)
}
