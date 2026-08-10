import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { hiddenListings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Ежедневная проверка: сняты ли объявления с публикации на Авито.
// Безопасное поведение: скрываем объект только при УВЕРЕННОСТИ, что он снят.
// Если Авито вернул капчу/блокировку — ничего не меняем.

export const maxDuration = 300
export const dynamic = 'force-dynamic'

type CheckResult = 'active' | 'removed' | 'unknown'

const REMOVED_MARKERS = [
  'снято с публикации',
  'объявление снято',
  'закрыто продавцом',
  'больше не размещается',
  'истек срок размещения',
  'истёк срок размещения',
]

const CAPTCHA_MARKERS = ['доступ ограничен', 'firewall', 'captcha', 'проверка, что вы не робот']

async function checkAvitoUrl(url: string): Promise<CheckResult> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      },
    })

    // 404/410 — объявление удалено
    if (res.status === 404 || res.status === 410) return 'removed'
    // Блокировка/капча/лимиты — статус неизвестен, не трогаем
    if (res.status === 403 || res.status === 429 || res.status >= 500) return 'unknown'
    if (!res.ok) return 'unknown'

    const html = (await res.text()).toLowerCase()
    if (CAPTCHA_MARKERS.some((m) => html.includes(m))) return 'unknown'
    if (REMOVED_MARKERS.some((m) => html.includes(m))) return 'removed'
    // Страница открылась и признаков снятия нет — считаем активным
    return 'active'
  } catch {
    return 'unknown'
  }
}

async function getListingUrls(): Promise<{ id: string; url: string }[]> {
  const filePath = path.join(process.cwd(), 'data', 'объявления.txt')
  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf-8')
  } catch {
    return []
  }
  const items: { id: string; url: string }[] = []
  for (const line of raw.split('\n')) {
    const url = line.trim()
    if (!url.startsWith('http')) continue
    const id = url.match(/_(\d+)$/)?.[1]
    if (id) items.push({ id, url })
  }
  return items
}

export async function GET(request: Request) {
  // Если задан CRON_SECRET — принимаем только запросы от Vercel Cron
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const items = await getListingUrls()
  const summary = { checked: 0, active: 0, removed: 0, unknown: 0, hidden: [] as string[], restored: [] as string[] }

  for (const { id, url } of items) {
    const result = await checkAvitoUrl(url)
    summary.checked++
    summary[result]++

    if (result === 'removed') {
      await db
        .insert(hiddenListings)
        .values({ id, reason: 'Снято с публикации на Авито' })
        .onConflictDoNothing()
      summary.hidden.push(id)
    } else if (result === 'active') {
      // Объявление снова активно — возвращаем на сайт
      const res = await db.delete(hiddenListings).where(eq(hiddenListings.id, id)).returning({ id: hiddenListings.id })
      if (res.length > 0) summary.restored.push(id)
    }
    // 'unknown' — ничего не меняем (безопасное поведение)

    // Пауза между запросами, чтобы не провоцировать блокировку
    await new Promise((r) => setTimeout(r, 1500))
  }

  // Обновляем страницы каталога, если что-то изменилось
  if (summary.hidden.length > 0 || summary.restored.length > 0) {
    revalidatePath('/')
    revalidatePath('/catalog')
  }

  return Response.json(summary)
}
