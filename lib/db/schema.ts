import { date, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

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
