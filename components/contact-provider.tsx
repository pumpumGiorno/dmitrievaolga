'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { X, CheckCircle2, Phone } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { CONTACTS } from '@/lib/contacts'
import { createLead } from '@/app/actions/leads'

interface ContactPayload {
  /** Human-readable subject, e.g. "Объект: 2-комнатная квартира, Чебоксары" */
  subject?: string
  /** Preselected service id */
  service?: string
}

interface ContactContextValue {
  openContact: (payload?: ContactPayload) => void
}

const ContactContext = createContext<ContactContextValue | null>(null)

export function useContact() {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used within ContactProvider')
  return ctx
}

interface FormErrors {
  name?: string
  phone?: string
}

function validate(name: string, phone: string): FormErrors {
  const errors: FormErrors = {}
  if (name.trim().length < 2) errors.name = 'Укажите ваше имя'
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) errors.phone = 'Укажите корректный номер телефона'
  return errors
}

export function ContactForm({
  subject,
  service,
  onSuccess,
  compact = false,
}: {
  subject?: string
  service?: string
  onSuccess?: () => void
  compact?: boolean
}) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const phone = String(data.get('phone') ?? '')
    const nextErrors = validate(name, phone)
    setErrors(nextErrors)
    setServerError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    const result = await createLead({
      name,
      phone,
      message: String(data.get('message') ?? ''),
      subject,
      service: String(data.get('service') ?? '') || service,
    })
    setSending(false)

    if (!result.ok) {
      setServerError(result.error ?? 'Не удалось отправить заявку. Попробуйте позвонить.')
      return
    }
    setSubmitted(true)
    onSuccess?.()
  }

  if (submitted) {
    return (
      <div className="form-success flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-gold/40 bg-card p-10 text-center">
        <span className="form-success-icon flex size-16 items-center justify-center rounded-full bg-gold/15">
          <CheckCircle2 className="size-9 text-gold" aria-hidden="true" />
        </span>
        <h3 className="font-serif text-2xl text-primary">Заявка принята</h3>
        <p className="max-w-sm leading-relaxed text-muted-foreground">
          Ольга свяжется с вами в течение 15 минут в рабочее время.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {subject && (
        <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          {subject}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
          Ваше имя
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Как к вам обращаться"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold aria-[invalid=true]:border-destructive"
        />
        {errors.name && (
          <p id="contact-name-error" className="text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
          Телефон
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold aria-[invalid=true]:border-destructive"
        />
        {errors.phone && (
          <p id="contact-phone-error" className="text-xs text-destructive">
            {errors.phone}
          </p>
        )}
      </div>

      {!subject && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-service" className="text-sm font-medium text-foreground">
            Что вас интересует
          </label>
          <select
            id="contact-service"
            name="service"
            defaultValue={service ?? ''}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
          >
            <option value="" disabled>
              Выберите услугу
            </option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
            <option value="object">Вопрос по объекту из каталога</option>
            <option value="other">Другой вопрос</option>
          </select>
        </div>
      )}

      {!compact && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
            Комментарий
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={3}
            placeholder="Кратко опишите вашу ситуацию (необязательно)"
            className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
          />
        </div>
      )}

      {serverError && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-1 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-gold-foreground transition-all hover:bg-gold/90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? 'Отправляем…' : 'Отправить заявку'}
      </button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  )
}

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState<ContactPayload>({})
  const dialogRef = useRef<HTMLDivElement>(null)

  const openContact = useCallback((p?: ContactPayload) => {
    setPayload(p ?? {})
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Форма заявки"
        >
          <button
            type="button"
            aria-label="Закрыть форму"
            onClick={close}
            className="modal-backdrop absolute inset-0 bg-primary/50 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            className="modal-panel relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl md:p-8"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-primary">Оставить заявку</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Консультация ни к чему вас не обязывает
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <ContactForm subject={payload.subject} service={payload.service} />
            <a
              href={CONTACTS.phoneHref}
              className="mt-5 flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-primary transition-colors hover:border-gold"
            >
              <Phone className="size-4 text-gold" aria-hidden="true" />
              Или позвоните: {CONTACTS.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </ContactContext.Provider>
  )
}
