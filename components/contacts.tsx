import { Phone, Send, MessageSquare } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { ContactForm } from '@/components/contact-provider'
import { CONTACTS } from '@/lib/contacts'

export function Contacts() {
  return (
    <section id="contacts" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="flex h-full flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Контакты</p>
            <h2 className="mt-3 font-serif text-3xl text-primary text-balance md:text-4xl">
              Обсудим вашу задачу?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Оставьте заявку — я свяжусь с вами в течение 15 минут в рабочее время, отвечу на
              вопросы и предложу план действий. Консультация ни к чему вас не обязывает.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={CONTACTS.phoneHref}
                className="inline-flex w-fit items-center gap-3 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:border-gold"
              >
                <Phone className="size-4 text-gold" aria-hidden="true" />
                {CONTACTS.phoneDisplay}
              </a>
              <div className="flex flex-wrap gap-3">
                <a
                  href={CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:border-gold"
                >
                  <Send className="size-4 text-gold" aria-hidden="true" />
                  Telegram
                </a>
                <a
                  href={CONTACTS.maxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-primary transition-colors hover:border-gold"
                >
                  <MessageSquare className="size-4 text-gold" aria-hidden="true" />
                  MAX
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Telegram: {CONTACTS.telegramHandle} · MAX — по ссылке выше
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
