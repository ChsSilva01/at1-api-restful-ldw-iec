import { isAxiosError } from 'axios'

interface ApiErro {
  erro?: string
  message?: string
}

export function getErrorMessage(
  error: unknown,
  padrao = 'Não foi possível concluir a operação.',
): string {
  if (isAxiosError<ApiErro>(error)) {
    if (!error.response) {
      return 'Não foi possível conectar à API. Verifique se o servidor está no ar.'
    }
    return error.response.data?.erro ?? error.response.data?.message ?? padrao
  }
  return padrao
}
