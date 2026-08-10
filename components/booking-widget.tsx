'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock, Phone } from 'lucide-react'
import { createAppointment, getBookedSlots } from '@/app/actions/appointments'
import { TIME_SLOTS } from '@/lib/booking'
import { CONTACTS } from '@/lib/contacts'
import { Reveal } from '@/components/reveal'

interface DayOption {
  value: string // YYYY-MM-DD
  weekday: string
  day: number
  month: string
  isToday: boolean
}

function buildDays(count: number): DayOption[] {
  const days: DayOption[] = []
  const weekdayFmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
  const monthFmt = new Intl.DateTimeFormat('ru-RU', { month: 'short' })
  const d = new Date()
  for (let i = 0; i < count; i++) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    // Воскресенье — выходной
    if (d.getDay() !== 0) {
      days.push({
        value: `${yyyy}-${mm}-${dd}`,
        weekday: weekdayFmt.format(d),
        day: d.getDate(),
        month: monthFmt.format(d).replace('.', ''),
        isToday: i === 0,
      })
    }
    d.setDate(d.getDate() + 1)
  }
  return days
}

export function BookingWidget() {
  // Даты строим только на клиенте, чтобы не было расхождения
  // серверного и клиентского времени при гидратации
  const [days, setDays] = useState<DayOption[]>([])
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    const built = buildDays(14)
    setDays(built)
    setSelectedDate((prev) => prev || (built[0]?.value ?? ''))
  }, [])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedDate) return
    let cancelled = false
    setLoadingSlots(true)
    setSelectedSlot(null)
    getBookedSlots(selectedDate)
      .then((slots) => {
        if (!cancelled) setBookedSlots(slots)
      })
      .catch(() => {
        if (!cancelled) setBookedSlots([])
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedDate])

  // Скрываем прошедшие слоты для сегодняшней даты
  const availableSlots = useMemo(() => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    if (selectedDate !== todayStr) return TIME_SLOTS
    const nowMinutes = today.getHours() * 60 + today.getMinutes()
    return TIME_SLOTS.filter((slot) => {
      const [h, m] = slot.split(':').map(Number)
      return h * 60 + m > nowMinutes + 30
    })
  }, [selectedDate])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSlot) {
      setError('Выберите удобное время')
      return
    }
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const phone = String(data.get('phone') ?? '')
    if (name.trim().length < 2) {
      setError('Укажите ваше имя')
      return
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Укажите корректный номер телефона')
      return
    }
    setError(null)
    setSending(true)
    const result = await createAppointment({
      name,
      phone,
      date: selectedDate,
      timeSlot: selectedSlot,
      comment: String(data.get('comment') ?? ''),
    })
    setSending(false)
    if (!result.ok) {
      setError(result.error ?? 'Не удалось записаться. Попробуйте позвонить.')
      if (result.error?.includes('занято')) {
        const slots = await getBookedSlots(selectedDate)
        setBookedSlots(slots)
        setSelectedSlot(null)
      }
      return
    }
    setSubmitted(true)
  }

  const selectedDay = days.find((d) => d.value === selectedDate)

  return (
    <section id="booking" className="border-t border-border/60 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Онлайн-запись</p>
          <h2 className="mt-3 max-w-xl text-balance font-serif text-3xl text-primary md:text-4xl">
            Запишитесь на консультацию в удобное время
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Выберите дату и время — Ольга позвонит вам в назначенный час. Консультация бесплатна и
            ни к чему не обязывает.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            {submitted ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-gold/15">
                  <CheckCircle2 className="size-9 text-gold" aria-hidden="true" />
                </span>
                <h3 className="font-serif text-2xl text-primary">Вы записаны</h3>
                <p className="max-w-sm leading-relaxed text-muted-foreground">
                  {selectedDay
                    ? `Ждите звонка ${selectedDay.day} ${selectedDay.month} в ${selectedSlot}. Если планы изменятся — просто позвоните.`
                    : 'Ольга свяжется с вами в выбранное время.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
                <fieldset>
                  <legend className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CalendarDays className="size-4 text-gold" aria-hidden="true" />
                    Выберите дату
                  </legend>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="Дата консультации">
                    {days.length === 0 &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          aria-hidden="true"
                          className="h-[86px] min-w-16 shrink-0 animate-pulse rounded-2xl border border-border bg-muted"
                        />
                      ))}
                    {days.map((day) => {
                      const active = day.value === selectedDate
                      return (
                        <button
                          key={day.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSelectedDate(day.value)}
                          className={`flex min-w-16 shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-3 transition-all ${
                            active
                              ? 'border-gold bg-gold/10 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:border-gold/50'
                          }`}
                        >
                          <span className="text-[11px] uppercase">{day.isToday ? 'сегодня' : day.weekday}</span>
                          <span className={`text-lg ${active ? 'font-semibold text-primary' : 'font-medium'}`}>
                            {day.day}
                          </span>
                          <span className="text-[11px]">{day.month}</span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="size-4 text-gold" aria-hidden="true" />
                    Выберите время
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Время консультации">
                    {availableSlots.length === 0 && !loadingSlots && (
                      <p className="text-sm text-muted-foreground">
                        На сегодня время закончилось — выберите другую дату.
                      </p>
                    )}
                    {availableSlots.map((slot) => {
                      const booked = bookedSlots.includes(slot)
                      const active = slot === selectedSlot
                      return (
                        <button
                          key={slot}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          disabled={booked || loadingSlots}
                          onClick={() => setSelectedSlot(slot)}
                          className={`min-w-20 rounded-full border px-4 py-2.5 text-sm transition-all disabled:cursor-not-allowed ${
                            active
                              ? 'border-gold bg-gold text-gold-foreground font-medium'
                              : booked
                                ? 'border-border bg-muted text-muted-foreground/50 line-through'
                                : 'border-border bg-background text-foreground hover:border-gold/60'
                          } ${loadingSlots ? 'opacity-50' : ''}`}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-name" className="text-sm font-medium text-foreground">
                      Ваше имя
                    </label>
                    <input
                      id="booking-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Как к вам обращаться"
                      className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-phone" className="text-sm font-medium text-foreground">
                      Телефон
                    </label>
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+7 (___) ___-__-__"
                      className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="booking-comment" className="text-sm font-medium text-foreground">
                    Комментарий
                  </label>
                  <textarea
                    id="booking-comment"
                    name="comment"
                    rows={2}
                    placeholder="Кратко опишите ваш вопрос (необязательно)"
                    className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
                  />
                </div>

                {error && (
                  <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-gold-foreground transition-all hover:bg-gold/90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? 'Записываем…' : 'Записаться на консультацию'}
                  </button>
                  <a
                    href={CONTACTS.phoneHref}
                    className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition-colors hover:border-gold"
                  >
                    <Phone className="size-4 text-gold" aria-hidden="true" />
                    Или позвоните: {CONTACTS.phoneDisplay}
                  </a>
                </div>
                <p className="-mt-4 text-xs leading-relaxed text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
