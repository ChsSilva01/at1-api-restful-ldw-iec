import { CalendarX, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AgendamentoFormDialog } from '@/components/AgendamentoFormDialog'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatarDataHora } from '@/lib/datas'
import { getErrorMessage } from '@/lib/errors'
import {
  atualizarAgendamento,
  criarAgendamento,
  excluirAgendamento,
  listarAgendamentos,
} from '@/services/agendamentos'
import type { Agendamento, AgendamentoInput } from '@/types/agendamento'

export default function DashboardPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [carregando, setCarregando] = useState(true)

  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState<Agendamento | null>(null)
  const [excluindo, setExcluindo] = useState<Agendamento | null>(null)

  // GET: carregamento inicial
  useEffect(() => {
    let ativo = true

    listarAgendamentos()
      .then((dados) => {
        if (ativo) setAgendamentos(dados)
      })
      .catch((error: unknown) => {
        if (ativo) toast.error(getErrorMessage(error, 'Erro ao carregar os agendamentos.'))
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const ordenados = useMemo(
    () =>
      [...agendamentos].sort(
        (a, b) => new Date(a.data_horario).getTime() - new Date(b.data_horario).getTime(),
      ),
    [agendamentos],
  )

  const metricas = useMemo(
    () => ({
      total: agendamentos.length,
      agendados: agendamentos.filter((a) => a.status === 'Agendado').length,
      realizados: agendamentos.filter((a) => a.status === 'Realizado').length,
      cancelados: agendamentos.filter((a) => a.status === 'Cancelado').length,
    }),
    [agendamentos],
  )

  function abrirNovo() {
    setEditando(null)
    setFormAberto(true)
  }

  function abrirEdicao(agendamento: Agendamento) {
    setEditando(agendamento)
    setFormAberto(true)
  }

  // POST / PUT
  async function handleSalvar(dados: AgendamentoInput): Promise<boolean> {
    try {
      if (editando) {
        const atualizado = await atualizarAgendamento(editando.id, dados)
        setAgendamentos((anterior) =>
          anterior.map((a) => (a.id === editando.id ? { ...a, ...atualizado } : a)),
        )
        toast.success('Agendamento atualizado com sucesso!')
      } else {
        const novo = await criarAgendamento(dados)
        setAgendamentos((anterior) => [...anterior, novo])
        toast.success('Agendamento cadastrado com sucesso!')
      }
      return true
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar o agendamento.'))
      return false
    }
  }

  // DELETE
  async function handleExcluir(agendamento: Agendamento) {
    try {
      await excluirAgendamento(agendamento.id)
      setAgendamentos((anterior) => anterior.filter((a) => a.id !== agendamento.id))
      toast.success('Agendamento excluído com sucesso!')
      setExcluindo(null)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir o agendamento.'))
    }
  }

  const cartoes = [
    { titulo: 'Total', valor: metricas.total },
    { titulo: 'Agendados', valor: metricas.agendados },
    { titulo: 'Realizados', valor: metricas.realizados },
    { titulo: 'Cancelados', valor: metricas.cancelados },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe e gerencie as consultas marcadas.
          </p>
        </div>
        <Button onClick={abrirNovo}>
          <Plus />
          Novo agendamento
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cartoes.map((cartao) => (
          <Card key={cartao.titulo} className="gap-2 py-4">
            <CardHeader>
              <CardDescription>{cartao.titulo}</CardDescription>
              <CardTitle className="text-3xl">
                {carregando ? <Skeleton className="h-8 w-10" /> : cartao.valor}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de agendamentos</CardTitle>
          <CardDescription>Ordenados por data e horário.</CardDescription>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="grid gap-3" aria-busy="true" aria-label="Carregando agendamentos">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : ordenados.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <CalendarX className="size-10 text-muted-foreground" />
              <div>
                <p className="font-medium">Nenhum agendamento encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Clique em &quot;Novo agendamento&quot; para marcar a primeira consulta.
                </p>
              </div>
              <Button variant="outline" onClick={abrirNovo}>
                <Plus />
                Novo agendamento
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Data e horário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenados.map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell className="font-medium">{agendamento.paciente}</TableCell>
                    <TableCell>{agendamento.profissional}</TableCell>
                    <TableCell>{formatarDataHora(agendamento.data_horario)}</TableCell>
                    <TableCell>
                      <StatusBadge status={agendamento.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirEdicao(agendamento)}
                        >
                          <Pencil />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setExcluindo(agendamento)}
                        >
                          <Trash2 />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AgendamentoFormDialog
        open={formAberto}
        onOpenChange={setFormAberto}
        agendamento={editando}
        onSubmit={handleSalvar}
      />

      <ConfirmDeleteDialog
        agendamento={excluindo}
        onConfirm={handleExcluir}
        onCancel={() => setExcluindo(null)}
      />
    </div>
  )
}
