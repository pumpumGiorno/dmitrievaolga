import { CalendarDays, Phone } from 'lucide-react'
import type { Appointment } from '@/lib/db/schema'

function formatDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(d)
}

export function AppointmentsTable({ rows }: { rows: Appointment[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Предстоящих записей нет.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((a) => (
        <li key={a.id} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-lg font-medium text-primary">{a.name}</p>
            <p className="inline-flex items-center gap-1.5 text-sm font-medium text-gold">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDay(a.date)}, {a.timeSlot}
            </p>
          </div>
          <a
            href={`tel:${a.phone.replace(/[^\d+]/g, '')}`}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-gold"
          >
            <Phone className="size-4 text-gold" aria-hidden="true" />
            {a.phone}
          </a>
          {a.comment && (
            <p className="mt-2 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
              {a.comment}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
