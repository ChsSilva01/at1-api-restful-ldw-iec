import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const TOKEN_KEY = 'token'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
})

// Anexa o token JWT (se existir) em toda requisicao
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token expirado/invalido: limpa a sessao e volta para o login
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login')
    ) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)
