'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { del } from '@vercel/blob'
import { z } from 'zod'
import { isAdmin } from '@/app/actions/leads'
import { db } from '@/lib/db'
import { properties, propertyPhotos } from '@/lib/db/schema'

const categorySchema = z.enum(['Квартира', 'Дом', 'Участок', 'Комната', 'Другое'])
const statusSchema = z.enum(['Активно', 'Продано', 'Снято', 'Эксклюзив', 'Снижение цены'])
const publicationSchema = z.enum(['draft', 'published'])

const propertySchema = z.object({
  id: z.string().trim().optional(),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug должен содержать латиницу, цифры и дефисы'),
  title: z.string().trim().min(2).max(200),
  category: categorySchema,
  location: z.string().trim().min(2).max(200),
  address: z.string().trim().max(300).nullable(),
  externalUrl: z.string().trim().url().or(z.literal('')).nullable(),
  price: z.number().int().nonnegative().nullable(),
  priceOnRequest: z.boolean(),
  areaValue: z.number().positive().nullable(),
  rooms: z.number().int().positive().nullable(),
  floor: z.number().int().positive().nullable(),
  floors: z.number().int().positive().nullable(),
  landArea: z.number().positive().nullable(),
  landCategory: z.string().trim().max(200).nullable(),
  shortDescription: z.string().trim().max(500).nullable(),
  description: z.string().trim().min(10).max(10000),
  attributes: z.array(z.string().trim().min(1).max(100)).max(20),
  status: statusSchema,
  publicationStatus: publicationSchema,
  seoTitle: z.string().trim().max(200).nullable(),
  seoDescription: z.string().trim().max(500).nullable(),
  displayOrder: z.number().int().min(0).max(100000),
})

export type PropertyInput = z.infer<typeof propertySchema>

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error('Unauthorized')
}

function clean(value: string | null | undefined) {
  return value?.trim() || null
}

export async function saveProperty(input: PropertyInput) {
  await requireAdmin()
  const parsed = propertySchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Проверьте данные' }

  const data = parsed.data
  const id = data.id || randomUUID()
  const values = {
    slug: data.slug,
    title: data.title,
    category: data.category,
    location: data.location,
    address: clean(data.address),
    externalUrl: clean(data.externalUrl),
    price: data.price,
    priceOnRequest: data.priceOnRequest,
    areaValue: data.areaValue,
    rooms: data.rooms,
    floor: data.floor,
    floors: data.floors,
    landArea: data.landArea,
    landCategory: clean(data.landCategory),
    shortDescription: clean(data.shortDescription),
    description: data.description,
    attributes: data.attributes,
    status: data.status,
    publicationStatus: data.publicationStatus,
    seoTitle: clean(data.seoTitle),
    seoDescription: clean(data.seoDescription),
    imageQuery: `${data.category} ${data.location}`,
    displayOrder: data.displayOrder,
    updatedAt: new Date(),
  }

  try {
    if (data.id) await db.update(properties).set(values).where(eq(properties.id, data.id))
    else await db.insert(properties).values({ id, ...values })
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) return { ok: false as const, error: 'Такой slug уже используется' }
    return { ok: false as const, error: 'Не удалось сохранить объект' }
  }

  revalidatePath('/')
  revalidatePath('/catalog')
  revalidatePath(`/catalog/${data.slug}`)
  revalidatePath('/admin')
  return { ok: true as const, id }
}

export async function deleteProperty(id: string) {
  await requireAdmin()
  const photos = await db.select().from(propertyPhotos).where(eq(propertyPhotos.propertyId, id))
  const blobPaths = photos.map((photo) => photo.pathname).filter((path) => !path.startsWith('/'))
  if (blobPaths.length) await del(blobPaths)
  await db.delete(propertyPhotos).where(eq(propertyPhotos.propertyId, id))
  await db.delete(properties).where(eq(properties.id, id))
  revalidatePath('/')
  revalidatePath('/catalog')
  revalidatePath('/admin')
  return { ok: true }
}

export async function deletePropertyPhoto(propertyId: string, photoId: number) {
  await requireAdmin()
  const [photo] = await db.select().from(propertyPhotos).where(and(eq(propertyPhotos.id, photoId), eq(propertyPhotos.propertyId, propertyId))).limit(1)
  if (!photo) return { ok: false }
  if (!photo.pathname.startsWith('/')) await del(photo.pathname)
  await db.delete(propertyPhotos).where(and(eq(propertyPhotos.id, photoId), eq(propertyPhotos.propertyId, propertyId)))
  revalidatePath('/admin')
  revalidatePath('/catalog')
  return { ok: true }
}

export async function updatePhotoOrder(propertyId: string, orderedIds: number[], coverId: number) {
  await requireAdmin()
  await Promise.all(orderedIds.map((id, index) => db.update(propertyPhotos).set({ displayOrder: index, isCover: id === coverId }).where(and(eq(propertyPhotos.id, id), eq(propertyPhotos.propertyId, propertyId)))))
  revalidatePath('/admin')
  revalidatePath('/catalog')
  return { ok: true }
}
