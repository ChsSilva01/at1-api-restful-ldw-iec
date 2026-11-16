import { Badge } from '@/components/ui/badge'
import type { StatusAgendamento } from '@/types/agendamento'

const VARIANTES = {
  Agendado: 'default',
  Realizado: 'secondary',
  Cancelado: 'destructive',
} as const satisfies Record<StatusAgendamento, 'default' | 'secondary' | 'destructive'>

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  return <Badge variant={VARIANTES[status]}>{status}</Badge>
}
