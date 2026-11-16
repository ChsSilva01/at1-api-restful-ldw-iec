import { CalendarCheck, LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    toast.info('Você saiu da conta.')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-semibold">
              <CalendarCheck className="size-5 text-primary" />
              Agenda de Consultas
            </div>
            <nav className="flex items-center gap-4">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )
                }
              >
                Dashboard
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.nome}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
