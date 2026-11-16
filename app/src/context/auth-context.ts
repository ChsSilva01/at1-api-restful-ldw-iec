import { createContext } from 'react'
import type { User } from '@/types/user'

export interface AuthContextData {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined)
