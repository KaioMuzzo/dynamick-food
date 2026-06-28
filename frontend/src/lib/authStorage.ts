const ACCESS_TOKEN_KEY = 'dynamick.accessToken'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string | null): void {
  if (token === null) {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    return
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}
