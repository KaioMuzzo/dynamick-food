import { useMutation } from '@tanstack/react-query'
import { registerDriver } from '../api'

export function useRegisterDriver() {
  return useMutation({
    mutationFn: registerDriver,
  })
}
