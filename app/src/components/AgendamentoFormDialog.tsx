import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { paraInputDatetime } from '@/lib/datas'
import {
  STATUS_AGENDAMENTO,
  type Agendamento,
  type AgendamentoInput,
  type StatusAgendamento,
} from '@/types/agendamento'

interface FormValues {
  paciente: string
  profissional: string
  data_horario: string
  status: StatusAgendamento
}

interface FormProps {
  agendamento: Agendamento | null
  onSubmit: (dados: AgendamentoInput) => Promise<boolean>
  onCancel: () => void
}

function AgendamentoForm({ agendamento, onSubmit, onCancel }: FormProps) {
  const editando = agendamento !== null

  const [valores, setValores] = useState<FormValues>({
    paciente: agendamento?.paciente ?? '',
    profissional: agendamento?.profissional ?? '',
    data_horario: agendamento ? paraInputDatetime(agendamento.data_horario) : '',
    status: agendamento?.status ?? 'Agendado',
  })
  const [enviando, setEnviando] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setValores((anterior) => ({ ...anterior, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)

    const dados: AgendamentoInput = {
      paciente: valores.paciente.trim(),
      profissional: valores.profissional.trim(),
      // datetime-local nao tem fuso: converte para ISO (UTC) antes de enviar
      data_horario: new Date(valores.data_horario).toISOString(),
      ...(editando ? { status: valores.status } : {}),
    }

    await onSubmit(dados)
    setEnviando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="paciente">Paciente</Label>
        <Input
          id="paciente"
          name="paciente"
          placeholder="Nome do paciente"
          value={valores.paciente}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profissional">Profissional</Label>
        <Input
          id="profissional"
          name="profissional"
          placeholder="Nome do profissional"
          value={valores.profissional}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="data_horario">Data e horário</Label>
        <Input
          id="data_horario"
          name="data_horario"
          type="datetime-local"
          value={valores.data_horario}
          onChange={handleChange}
          required
        />
      </div>

      {editando && (
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={valores.status}
            onChange={handleChange}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {STATUS_AGENDAMENTO.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando && <Loader2 className="animate-spin" />}
          {editando ? 'Salvar alterações' : 'Cadastrar'}
        </Button>
      </DialogFooter>
    </form>
  )
}

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agendamento: Agendamento | null
  /** Retorna true se salvou com sucesso (o modal fecha); false mantem o modal aberto */
  onSubmit: (dados: AgendamentoInput) => Promise<boolean>
}

export function AgendamentoFormDialog({
  open,
  onOpenChange,
  agendamento,
  onSubmit,
}: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {agendamento ? 'Editar agendamento' : 'Novo agendamento'}
          </DialogTitle>
          <DialogDescription>
            {agendamento
              ? 'Altere os dados do agendamento e salve.'
              : 'Preencha os dados para marcar uma nova consulta.'}
          </DialogDescription>
        </DialogHeader>

        {/* O formulario monta/desmonta junto com o modal, entao o estado reinicia a cada abertura */}
        <AgendamentoForm
          agendamento={agendamento}
          onSubmit={async (dados) => {
            const sucesso = await onSubmit(dados)
            if (sucesso) onOpenChange(false)
            return sucesso
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
