import { useState, type ReactNode } from 'react'
import { getAccessToken, setAccessToken } from '../lib/authStorage'
import { AuthContext } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setToken] = useState<string | null>(getAccessToken())

  function login(token: string) {
    setAccessToken(token)
    setToken(token)
  }

  function logout() {
    setAccessToken(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: accessToken !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
