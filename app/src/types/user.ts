export interface User {
  id: number
  nome: string
  email: string
}

export interface LoginResponse {
  mensagem: string
  token: string
}

export interface NovoUsuario {
  nome: string
  email: string
  password: string
}
