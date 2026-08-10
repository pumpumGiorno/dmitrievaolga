import { Phone } from 'lucide-react'
import type { Lead } from '@/lib/db/schema'
import { SERVICES } from '@/lib/services'

function serviceLabel(id: string | null): string | null {
  if (!id) return null
  if (id === 'object') return 'Вопрос по объекту'
  if (id === 'other') return 'Другой вопрос'
  return SERVICES.find((s) => s.id === id)?.title ?? id
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(date)
}

export function LeadsTable({ rows }: { rows: Lead[] }) {
  if (rows.length === 0) return null

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((lead) => (
        <li key={lead.id} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-lg font-medium text-primary">{lead.name}</p>
            <p className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</p>
          </div>
          <a
            href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-gold"
          >
            <Phone className="size-4 text-gold" aria-hidden="true" />
            {lead.phone}
          </a>
          {(lead.subject || serviceLabel(lead.service)) && (
            <p className="mt-2 text-sm text-secondary-foreground">
              {lead.subject || serviceLabel(lead.service)}
            </p>
          )}
          {lead.message && (
            <p className="mt-2 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
              {lead.message}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
