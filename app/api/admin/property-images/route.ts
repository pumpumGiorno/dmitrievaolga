import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { isAdmin } from '@/app/actions/leads'
import { db } from '@/lib/db'
import { properties, propertyPhotos } from '@/lib/db/schema'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const propertyId = String(formData.get('propertyId') ?? '')
  const files = formData.getAll('files').filter((value): value is File => value instanceof File)
  const [property] = await db.select({ id: properties.id }).from(properties).where(eq(properties.id, propertyId)).limit(1)

  if (!property) return NextResponse.json({ error: 'Сначала сохраните объект' }, { status: 404 })
  if (!files.length) return NextResponse.json({ error: 'Выберите изображения' }, { status: 400 })
  if (files.length > 20) return NextResponse.json({ error: 'Не более 20 файлов за раз' }, { status: 400 })
  if (files.some((file) => !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)) {
    return NextResponse.json({ error: 'Допустимы JPG, PNG, WebP и AVIF до 8 МБ' }, { status: 400 })
  }

  const existing = await db.select().from(propertyPhotos).where(eq(propertyPhotos.propertyId, propertyId))
  const uploaded = []
  for (const [index, file] of files.entries()) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
    const blob = await put(`properties/${propertyId}/${crypto.randomUUID()}-${safeName}`, file, {
      access: 'private',
      addRandomSuffix: false,
      contentType: file.type,
    })
    const [photo] = await db.insert(propertyPhotos).values({
      propertyId,
      pathname: blob.pathname,
      displayOrder: existing.length + index,
      isCover: existing.length === 0 && index === 0,
    }).returning()
    uploaded.push({ ...photo, url: `/api/property-image?pathname=${encodeURIComponent(photo.pathname)}` })
  }

  return NextResponse.json({ photos: uploaded })
}
