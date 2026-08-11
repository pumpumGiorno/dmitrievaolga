import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  phone: z.string().trim().max(50).refine((value) => value.replace(/\D/g, '').length >= 10),
  message: z.string().trim().max(2000).optional().default(''),
  subject: z.string().trim().max(300).optional().default(''),
  service: z.string().trim().max(100).optional().default(''),
  transportType: z.string().trim().max(100).optional().default(''),
  from: z.string().trim().max(200).optional().default(''),
  to: z.string().trim().max(200).optional().default(''),
  passengers: z.string().trim().max(20).optional().default(''),
  date: z.string().trim().max(50).optional().default(''),
  website: z.string().max(200).optional().default(''),
  submittedAt: z.number().int().positive(),
})

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 3
const MIN_FORM_TIME_MS = 1200
const attempts = new Map<string, number[]>()

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function display(value: string): string {
  return escapeHtml(value || '—')
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    attempts.set(key, recent)
    return true
  }
  recent.push(now)
  attempts.set(key, recent)
  return false
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Некорректные данные формы.', 400)
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) return errorResponse('Проверьте обязательные поля формы.', 400)

  const data = parsed.data
  if (data.website) return NextResponse.json({ success: true })

  const elapsed = Date.now() - data.submittedAt
  if (elapsed < MIN_FORM_TIME_MS || elapsed > 60 * 60 * 1000) {
    return errorResponse('Не удалось отправить заявку. Обновите страницу и попробуйте снова.', 400)
  }

  const clientKey = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(clientKey)) {
    return errorResponse('Слишком много попыток. Пожалуйста, попробуйте позже.', 429)
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return errorResponse('Не удалось отправить заявку. Попробуйте позвонить.', 500)

  const type = data.transportType || data.subject || data.service
  const text = [
    '<b>🚀 Новая заявка с сайта LIANTRO</b>',
    '',
    `<b>👤 Имя:</b>\n${display(data.name)}`,
    '',
    `<b>📞 Телефон:</b>\n${display(data.phone)}`,
    '',
    `<b>🚐 Тип перевозки:</b>\n${display(type)}`,
    '',
    `<b>📍 Откуда:</b>\n${display(data.from)}`,
    '',
    `<b>📍 Куда:</b>\n${display(data.to)}`,
    '',
    `<b>👥 Количество пассажиров:</b>\n${display(data.passengers)}`,
    '',
    `<b>📅 Дата:</b>\n${display(data.date)}`,
    '',
    `<b>💬 Комментарий:</b>\n${display(data.message)}`,
  ].join('\n')

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) return errorResponse('Не удалось отправить заявку. Попробуйте позвонить.', 502)
    return NextResponse.json({ success: true })
  } catch {
    return errorResponse('Не удалось отправить заявку. Попробуйте позвонить.', 502)
  }
}
