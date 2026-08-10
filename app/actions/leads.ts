'use server'

import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { sendSmsNotification } from '@/lib/notify'

const ADMIN_COOKIE = 'olga_admin'

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'olga2026'
}

export async function createLead(input: {
  name: string
  phone: string
  message?: string
  subject?: string
  service?: string
}): Promise<{ ok: boolean; error?: string }> {
  const name = (input.name || '').trim().slice(0, 200)
  const phone = (input.phone || '').trim().slice(0, 50)
  const message = (input.message || '').trim().slice(0, 2000)
  const subject = (input.subject || '').trim().slice(0, 300)
  const service = (input.service || '').trim().slice(0, 100)

  if (name.length < 2) return { ok: false, error: 'Укажите имя' }
  if (phone.replace(/\D/g, '').length < 10) return { ok: false, error: 'Укажите корректный телефон' }

  try {
    await db.insert(leads).values({
      name,
      phone,
      message: message || null,
      subject: subject || null,
      service: service || null,
    })
    // Уведомление по СМС — не блокирует ответ клиенту, ошибки не срывают заявку
    await sendSmsNotification({ name, phone, message, service })
    return { ok: true }
  } catch (error) {
    console.log('[v0] createLead error:', error)
    return { ok: false, error: 'Не удалось отправить заявку. Попробуйте позвонить.' }
  }
}

export async function adminSignIn(password: string): Promise<{ ok: boolean }> {
  if (password !== getAdminPassword()) return { ok: false }
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, getAdminPassword(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return { ok: true }
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === getAdminPassword()
}

export async function getLeads() {
  if (!(await isAdmin())) throw new Error('Unauthorized')
  return db.select().from(leads).orderBy(desc(leads.createdAt))
}
