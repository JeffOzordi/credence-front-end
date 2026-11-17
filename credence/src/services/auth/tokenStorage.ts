const AUTH_TOKEN_STORAGE_KEY = 'credence-auth-token'

export function saveAuthToken(token: string, rememberMe = true) {
  if (typeof window === 'undefined') {
    return
  }

  clearAuthToken()
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return (
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
    null
  )
}

export function clearAuthToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}
