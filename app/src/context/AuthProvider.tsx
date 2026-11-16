import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextData } from '@/context/auth-context'
import { TOKEN_KEY } from '@/services/api'
import { autenticar } from '@/services/auth'
import type { User } from '@/types/user'

function decodificarToken(token: string): User | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))

  const user = useMemo(() => (token ? decodificarToken(token) : null), [token])

  const login = useCallback(async (email: string, password: string) => {
    const novoToken = await autenticar(email, password)
    localStorage.setItem(TOKEN_KEY, novoToken)
    setToken(novoToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  const value = useMemo<AuthContextData>(
    () => ({ token, user, isAuthenticated: token !== null, login, logout }),
    [token, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
