import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'
import { hiddenListings } from '@/lib/db/schema'
import type { Listing, ListingStatus } from '@/lib/listing-types'

export type { Listing, ListingStatus } from '@/lib/listing-types'
export { placeholderFor } from '@/lib/listing-types'

const CITY_MAP: Record<string, string> = {
  cheboksary: 'Чебоксары',
  chuvashiya_kozlovka: 'Козловка, Чувашия',
  kugesi: 'Кугеси',
  kozmodemyansk: 'Козьмодемьянск',
}

const CATEGORY_MAP: Record<string, Listing['category']> = {
  kvartiry: 'Квартира',
  doma_dachi_kottedzhi: 'Дом',
  zemelnye_uchastki: 'Участок',
  komnaty: 'Комната',
}

/** Manual per-listing statuses to keep the catalog feeling alive. */
const STATUS_MAP: Record<string, ListingStatus> = {
  '7944703179': 'Эксклюзив',
  '7848548653': 'Эксклюзив',
  '7880679211': 'Эксклюзив',
  '8104150579': 'Снижение цены',
  '7848064247': 'Снижение цены',
}

/** Avito slugs drop the decimal comma: "502" for an apartment means 50,2 м². */
function parseAreaNumber(raw: string, kind: 'flat' | 'house' | 'room'): number {
  const value = Number.parseInt(raw, 10)
  const threshold = kind === 'flat' ? 200 : kind === 'room' ? 100 : 1000
  return value >= threshold ? value / 10 : value
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',')
}

function formatSot(raw: string): string {
  const value = Number.parseInt(raw, 10)
  if (value >= 100) {
    return `${(value / 10).toFixed(1).replace('.', ',')} сот.`
  }
  return `${value} сот.`
}

/** "518" → "5/18 эт." — split so that floor ≤ total floors. */
function formatFloor(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 2) return null
  for (let split = 1; split < digits.length; split++) {
    const floor = Number.parseInt(digits.slice(0, split), 10)
    const total = Number.parseInt(digits.slice(split), 10)
    if (floor >= 1 && total >= floor) {
      return `${floor}/${total} эт.`
    }
  }
  return null
}

interface ParsedSlug {
  category: Listing['category']
  title: string
  location: string
  attributes: string[]
  rooms: number | null
  areaValue: number | null
  description: string
  imageQuery: string
}

function parseSlug(citySlug: string, categorySlug: string, slug: string): ParsedSlug | null {
  const category = CATEGORY_MAP[categorySlug]
  const location = CITY_MAP[citySlug] ?? citySlug
  if (!category) return null

  const attributes: string[] = []
  let title = ''
  let imageQuery = ''
  let rooms: number | null = null
  let areaValue: number | null = null
  let description = ''

  if (category === 'Квартира') {
    const roomsRaw = slug.match(/^(\d)-k/)?.[1]
    const area = slug.match(/kvartira_(\d+)_m/)?.[1]
    const floor = slug.match(/m_(\d+)_et/)?.[1]
    rooms = roomsRaw ? Number.parseInt(roomsRaw, 10) : null
    title = rooms ? `${rooms}-комнатная квартира` : 'Квартира'
    if (area) {
      areaValue = parseAreaNumber(area, 'flat')
      attributes.push(`${formatNumber(areaValue)} м²`)
    }
    if (floor) {
      const f = formatFloor(floor)
      if (f) attributes.push(f)
    }
    description = `${title}${areaValue ? ` площадью ${formatNumber(areaValue)} м²` : ''} в городе ${location}. Объект проходит полную юридическую проверку перед сделкой. Организую показ в удобное для вас время, помогу с ипотекой и проведу сделку под ключ — от аванса до передачи ключей.`
    imageQuery = 'modern apartment interior living room warm light'
  } else if (category === 'Комната') {
    const area = slug.match(/komnata_(\d+)_m/)?.[1]
    const inFlat = slug.match(/v_(\d)-k/)?.[1]
    const floor = slug.match(/k\._(\d+)_et/)?.[1]
    title = inFlat ? `Комната в ${inFlat}-комнатной квартире` : 'Комната'
    if (area) {
      areaValue = parseAreaNumber(area, 'room')
      attributes.push(`${formatNumber(areaValue)} м²`)
    }
    if (floor) {
      const f = formatFloor(floor)
      if (f) attributes.push(f)
    }
    description = `${title}${areaValue ? ` площадью ${formatNumber(areaValue)} м²` : ''} в городе ${location}. Отличный вариант для старта или инвестиции. Проверю историю объекта, помогу с оформлением и безопасным расчетом.`
    imageQuery = 'cozy bright room interior'
  } else if (category === 'Дом') {
    const area = slug.match(/dom_(\d+)_m/)?.[1]
    const sot = slug.match(/uchastke_(\d+)_sot/)?.[1]
    title = 'Дом'
    if (area) {
      areaValue = parseAreaNumber(area, 'house')
      attributes.push(`${formatNumber(areaValue)} м²`)
    }
    if (sot) attributes.push(`участок ${formatSot(sot)}`)
    description = `Дом${areaValue ? ` площадью ${formatNumber(areaValue)} м²` : ''}${sot ? ` на участке ${formatSot(sot)}` : ''} — ${location}. Расскажу все об объекте, коммуникациях и документах, организую выезд на просмотр и сопровожу сделку от начала до конца.`
    imageQuery = 'beautiful country house exterior garden'
  } else {
    const sot = slug.match(/uchastok_(\d+)_sot/)?.[1]
    const izhs = /izhs/.test(slug)
    title = 'Земельный участок'
    if (sot) attributes.push(formatSot(sot))
    if (izhs) attributes.push('ИЖС')
    description = `Земельный участок${sot ? ` ${formatSot(sot)}` : ''}${izhs ? ' под ИЖС' : ''} — ${location}. Проверю границы, категорию земли и разрешенное использование, помогу с оформлением сделки.`
    imageQuery = 'green land plot countryside'
  }

  return { category, title, location, attributes, rooms, areaValue, description, imageQuery }
}

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i

/** Photos live in public/objects/{id}/ — drop real Avito photos there and they appear automatically. */
async function getPhotos(id: string): Promise<string[]> {
  const dir = path.join(process.cwd(), 'public', 'objects', id)
  try {
    const files = await fs.readdir(dir)
    return files
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/objects/${id}/${f}`)
  } catch {
    return []
  }
}

/** Объявления, автоматически скрытые ежедневной проверкой Авито. */
async function getHiddenIds(): Promise<Set<string>> {
  try {
    const rows = await db.select({ id: hiddenListings.id }).from(hiddenListings)
    return new Set(rows.map((r) => r.id))
  } catch {
    // База недоступна — не скрываем ничего (безопасное поведение)
    return new Set()
  }
}

export async function getListings(): Promise<Listing[]> {
  const filePath = path.join(process.cwd(), 'data', 'объявления.txt')
  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf-8')
  } catch {
    return []
  }

  const hidden = await getHiddenIds()

  const listings: Listing[] = []
  for (const line of raw.split('\n')) {
    const url = line.trim()
    if (!url.startsWith('http')) continue
    const match = url.match(/avito\.ru\/([^/]+)\/([^/]+)\/(.+)_(\d+)$/)
    if (!match) continue
    const [, citySlug, categorySlug, slug, id] = match
    // Снято с публикации на Авито — не показываем
    if (hidden.has(id)) continue
    const parsed = parseSlug(citySlug, categorySlug, slug)
    if (!parsed) continue
    const photos = await getPhotos(id)
    // Объявления без фотографий не показываем на сайте.
    // Добавьте фото в public/objects/{id}/ — и объявление появится автоматически.
    if (photos.length === 0) continue
    listings.push({
      id,
      url,
      status: STATUS_MAP[id] ?? 'Активно',
      photos,
      ...parsed,
    })
  }
  return listings
}

export async function getListing(id: string): Promise<Listing | null> {
  const listings = await getListings()
  return listings.find((l) => l.id === id) ?? null
}
