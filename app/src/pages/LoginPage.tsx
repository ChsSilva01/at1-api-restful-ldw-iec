import { CalendarCheck, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/errors'
import { cadastrarUsuario } from '@/services/auth'

type Modo = 'login' | 'cadastro'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()

  const [modo, setModo] = useState<Modo>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const cadastro = modo === 'cadastro'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)
    try {
      if (cadastro) {
        await cadastrarUsuario({ nome, email, password })
        toast.success('Conta criada com sucesso!')
      }
      await login(email, password)
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao autenticar. Verifique os dados.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <CalendarCheck className="size-5 text-primary" />
            Agenda de Consultas
          </div>
          <CardTitle>{cadastro ? 'Criar conta' : 'Entrar'}</CardTitle>
          <CardDescription>
            {cadastro
              ? 'Cadastre-se para gerenciar os agendamentos.'
              : 'Acesse o painel de agendamentos.'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {cadastro && (
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder={cadastro ? 'Mínimo de 6 caracteres' : 'Sua senha'}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                minLength={cadastro ? 6 : undefined}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando && <Loader2 className="animate-spin" />}
              {cadastro ? 'Criar conta e entrar' : 'Entrar'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => setModo(cadastro ? 'login' : 'cadastro')}
            >
              {cadastro ? 'Já tenho conta' : 'Ainda não tenho conta'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
