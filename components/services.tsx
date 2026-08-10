import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SERVICES } from '@/lib/services'

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Услуги</p>
          <h2 className="mt-3 font-serif text-3xl text-primary text-balance md:text-4xl">
            Полный цикл работы с недвижимостью
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Прозрачные условия и фиксированная стоимость услуг. Вы всегда знаете, за что платите.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {SERVICES.map((service, i) => (
          <Reveal key={service.id} delay={i * 80}>
            <article className="card-lift group relative flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-7 md:p-9">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                  <service.icon className="size-6" aria-hidden="true" />
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-primary">{service.price}</p>
                  <p className="text-xs text-muted-foreground">{service.priceNote}</p>
                </div>
              </div>
              <h3 className="font-serif text-2xl text-primary">
                <Link
                  href={service.href}
                  className="transition-colors hover:text-gold after:absolute after:inset-0 after:z-10"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="leading-relaxed text-muted-foreground">{service.description}</p>
              <ul className="flex flex-col gap-2 text-sm text-foreground">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="relative z-20 mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-sm font-medium text-gold transition-transform duration-300 group-hover:translate-x-1"
              >
                Подробнее об услуге
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
