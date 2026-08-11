import type { Metadata } from 'next'
import { isAdmin } from '@/app/actions/leads'
import { getAppointments } from '@/app/actions/appointments'
import { AdminLogin } from '@/components/admin-login'
import { AppointmentsTable } from '@/components/appointments-table'

export const metadata: Metadata = {
  title: 'Заявки с сайта',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ZayavkiPage() {
  const authed = await isAdmin()

  if (!authed) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-24">
        <AdminLogin />
      </main>
    )
  }

  const upcoming = await getAppointments()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-24 md:px-6">
      <h1 className="font-serif text-3xl text-primary md:text-4xl">Онлайн-записи</h1>
      <p className="mt-2 text-muted-foreground">
        {upcoming.length > 0
          ? `Предстоящих консультаций: ${upcoming.length}. Ближайшие сверху.`
          : 'Предстоящих записей на консультацию нет.'}
      </p>
      <div className="mt-8">
        <AppointmentsTable rows={upcoming} />
      </div>
    </main>
  )
}
