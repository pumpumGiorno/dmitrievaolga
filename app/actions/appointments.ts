'use server'

import { db } from '@/lib/db'
import { appointments } from '@/lib/db/schema'
import { and, desc, eq, gte } from 'drizzle-orm'
import { sendSmsNotification } from '@/lib/notify'
import { isAdmin } from '@/app/actions/leads'
import { TIME_SLOTS } from '@/lib/booking'

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const max = new Date(today)
  max.setDate(max.getDate() + 30)
  return d >= today && d <= max
}

export async function getBookedSlots(dateStr: string): Promise<string[]> {
  if (!isValidDate(dateStr)) return []
  const rows = await db
    .select({ timeSlot: appointments.timeSlot })
    .from(appointments)
    .where(eq(appointments.date, dateStr))
  return rows.map((r) => r.timeSlot)
}

export async function createAppointment(input: {
  name: string
  phone: string
  date: string
  timeSlot: string
  comment?: string
}): Promise<{ ok: boolean; error?: string }> {
  const name = (input.name || '').trim().slice(0, 200)
  const phone = (input.phone || '').trim().slice(0, 50)
  const dateStr = (input.date || '').trim()
  const timeSlot = (input.timeSlot || '').trim()
  const comment = (input.comment || '').trim().slice(0, 1000)

  if (name.length < 2) return { ok: false, error: 'Укажите имя' }
  if (phone.replace(/\D/g, '').length < 10) return { ok: false, error: 'Укажите корректный телефон' }
  if (!isValidDate(dateStr)) return { ok: false, error: 'Выберите дату в ближайшие 30 дней' }
  if (!TIME_SLOTS.includes(timeSlot)) return { ok: false, error: 'Выберите время из списка' }

  try {
    const existing = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(and(eq(appointments.date, dateStr), eq(appointments.timeSlot, timeSlot)))
    if (existing.length > 0) {
      return { ok: false, error: 'Это время уже занято. Выберите другое.' }
    }

    await db.insert(appointments).values({
      name,
      phone,
      date: dateStr,
      timeSlot,
      comment: comment || null,
    })

    const [y, m, d] = dateStr.split('-')
    await sendSmsNotification({
      name,
      phone,
      message: comment,
      service: `Онлайн-запись на ${d}.${m}.${y} в ${timeSlot}`,
    })
    return { ok: true }
  } catch (error) {
    console.log('[v0] createAppointment error:', error)
    return { ok: false, error: 'Не удалось записаться. Попробуйте позвонить.' }
  }
}

export async function getAppointments() {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  const today = new Date().toISOString().slice(0, 10)
  return db
    .select()
    .from(appointments)
    .where(gte(appointments.date, today))
    .orderBy(appointments.date, appointments.timeSlot)
}

export async function getAllAppointments() {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  return db.select().from(appointments).orderBy(desc(appointments.date))
}
