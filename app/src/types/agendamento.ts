export const STATUS_AGENDAMENTO = ['Agendado', 'Realizado', 'Cancelado'] as const

export type StatusAgendamento = (typeof STATUS_AGENDAMENTO)[number]

export interface Agendamento {
  id: number
  paciente: string
  profissional: string
  data_horario: string
  status: StatusAgendamento
  createdAt?: string
  updatedAt?: string
}

export interface AgendamentoInput {
  paciente: string
  profissional: string
  data_horario: string
  status?: StatusAgendamento
}
