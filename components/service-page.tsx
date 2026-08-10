import { Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { ContactButton } from '@/components/contact-button'
import { ContactForm } from '@/components/contact-provider'

export interface ServiceStep {
  title: string
  description: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

export function ServicePage({
  eyebrow,
  title,
  lead,
  price,
  priceNote,
  serviceId,
  ctaLabel,
  steps,
  included,
  faq,
}: {
  eyebrow: string
  title: string
  lead: string
  price: string
  priceNote: string
  serviceId: string
  ctaLabel: string
  steps: ServiceStep[]
  included: string[]
  faq: ServiceFaq[]
}) {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[3fr_2fr] md:px-6 md:py-20">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
            <h1 className="font-serif text-4xl leading-tight text-primary text-balance md:text-5xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {lead}
            </p>
            <div className="pt-2">
              <ContactButton variant="gold" service={serviceId}>
                {ctaLabel}
              </ContactButton>
            </div>
          </div>

          <div className="card-lift rounded-3xl border border-gold/40 bg-background p-8">
            <p className="text-sm text-muted-foreground">Стоимость услуги</p>
            <p className="mt-2 font-serif text-4xl text-primary">{price}</p>
            <p className="mt-1 text-sm text-muted-foreground">{priceNote}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {included.slice(0, 4).map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <Reveal>
          <h2 className="mb-12 font-serif text-3xl text-primary text-balance md:text-4xl">
            Как проходит работа
          </h2>
        </Reveal>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="card-lift flex h-full flex-col gap-3 rounded-3xl border border-border bg-card p-6">
                <span className="font-serif text-4xl text-gold/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-xl text-primary">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Included */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:px-6">
          <Reveal>
            <div>
              <h2 className="font-serif text-3xl text-primary text-balance md:text-4xl">
                Что входит в услугу
              </h2>
              <ul className="mt-8 flex flex-col gap-4">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                      <Check className="size-3.5 text-gold" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-3xl border border-border bg-card p-7 md:p-9">
              <h3 className="font-serif text-2xl text-primary">Оставить заявку</h3>
              <p className="mb-6 mt-2 text-sm leading-relaxed text-muted-foreground">
                Расскажите о вашей задаче — я перезвоню, отвечу на вопросы и предложу план
                действий.
              </p>
              <ContactForm service={serviceId} compact />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <Reveal>
          <h2 className="mb-10 text-center font-serif text-3xl text-primary text-balance md:text-4xl">
            Частые вопросы
          </h2>
        </Reveal>
        <div className="flex flex-col gap-4">
          {faq.map((item, i) => (
            <Reveal key={item.question} delay={i * 60}>
              <details className="group rounded-2xl border border-border bg-card px-6 py-5 transition-colors open:border-gold/50">
                <summary className="cursor-pointer list-none font-medium text-primary marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
