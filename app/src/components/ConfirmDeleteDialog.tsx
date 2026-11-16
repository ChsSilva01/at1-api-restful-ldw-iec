import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatarDataHora } from '@/lib/datas'
import type { Agendamento } from '@/types/agendamento'

interface Props {
  agendamento: Agendamento | null
  onConfirm: (agendamento: Agendamento) => Promise<void>
  onCancel: () => void
}

export function ConfirmDeleteDialog({ agendamento, onConfirm, onCancel }: Props) {
  const [excluindo, setExcluindo] = useState(false)

  async function handleConfirm() {
    if (!agendamento) return
    setExcluindo(true)
    await onConfirm(agendamento)
    setExcluindo(false)
  }

  return (
    <Dialog open={agendamento !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir agendamento</DialogTitle>
          <DialogDescription>
            {agendamento
              ? `Tem certeza que deseja excluir o agendamento de ${agendamento.paciente} com ${agendamento.profissional} em ${formatarDataHora(agendamento.data_horario)}? Esta ação não pode ser desfeita.`
              : ''}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={excluindo}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={excluindo}>
            {excluindo && <Loader2 className="animate-spin" />}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
