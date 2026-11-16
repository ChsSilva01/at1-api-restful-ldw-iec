const pad = (n: number): string => String(n).padStart(2, '0')

/** ISO (UTC) -> "dd/mm/aaaa HH:mm" no fuso do navegador */
export function formatarDataHora(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

/** ISO (UTC) -> valor aceito por <input type="datetime-local"> no fuso local */
export function paraInputDatetime(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
