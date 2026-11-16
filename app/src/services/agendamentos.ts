import { api } from '@/services/api'
import type { Agendamento, AgendamentoInput } from '@/types/agendamento'

export async function listarAgendamentos(): Promise<Agendamento[]> {
  const { data } = await api.get<Agendamento[]>('/agendamentos')
  return data
}

export async function criarAgendamento(dados: AgendamentoInput): Promise<Agendamento> {
  const { data } = await api.post<Agendamento>('/agendamentos', dados)
  return data
}

export async function atualizarAgendamento(
  id: number,
  dados: AgendamentoInput,
): Promise<Partial<Agendamento>> {
  const { data } = await api.put<Partial<Agendamento>>(`/agendamentos/${id}`, dados)
  return data
}

export async function excluirAgendamento(id: number): Promise<void> {
  await api.delete(`/agendamentos/${id}`)
}
