import { api } from '@/services/api'
import type { LoginResponse, NovoUsuario } from '@/types/user'

export async function autenticar(email: string, password: string): Promise<string> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
  return data.token
}

export async function cadastrarUsuario(dados: NovoUsuario): Promise<void> {
  await api.post('/users', dados)
}
