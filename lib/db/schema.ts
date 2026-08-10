import { boolean, date, doublePrecision, integer, jsonb, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  message: text('message'),
  subject: text('subject'),
  service: text('service'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Lead = typeof leads.$inferSelect

export const appointments = pgTable(
  'appointments',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    date: date('date').notNull(),
    timeSlot: text('time_slot').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.date, t.timeSlot)],
)

export type Appointment = typeof appointments.$inferSelect

/** Объявления, автоматически скрытые с сайта (сняты с публикации на Авито). */
export const hiddenListings = pgTable('hidden_listings', {
  id: text('id').primaryKey(),
  reason: text('reason').notNull(),
  hiddenAt: timestamp('hidden_at', { withTimezone: true }).notNull().defaultNow(),
})

export const properties = pgTable('properties', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  externalUrl: text('external_url'),
  category: text('category').notNull(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  address: text('address'),
  price: integer('price'),
  priceOnRequest: boolean('price_on_request').notNull().default(true),
  areaValue: doublePrecision('area_value'),
  rooms: integer('rooms'),
  floor: integer('floor'),
  floors: integer('floors'),
  landArea: doublePrecision('land_area'),
  landCategory: text('land_category'),
  shortDescription: text('short_description'),
  description: text('description').notNull(),
  attributes: jsonb('attributes').$type<string[]>().notNull().default([]),
  status: text('status').notNull().default('Активно'),
  publicationStatus: text('publication_status').notNull().default('published'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  imageQuery: text('image_query').notNull().default('real estate'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const propertyPhotos = pgTable('property_photos', {
  id: serial('id').primaryKey(),
  propertyId: text('property_id').notNull(),
  pathname: text('pathname').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isCover: boolean('is_cover').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Property = typeof properties.$inferSelect
export type PropertyPhoto = typeof propertyPhotos.$inferSelect
