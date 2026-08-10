import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SERVICES } from '@/lib/services'

export function Services() {
  return (
    <section id="services" className="section-shell py-20 md:py-32">
      <Reveal><div className="mb-14 grid gap-6 border-b border-border pb-10 md:grid-cols-[1fr_1.2fr] md:items-end"><div><p className="section-label">02 — Услуги</p><h2 className="display-title mt-5">Полный цикл работы с недвижимостью</h2></div><p className="max-w-lg leading-relaxed text-muted-foreground md:justify-self-end">Прозрачные условия и фиксированная стоимость услуг. Вы всегда знаете, за что платите.</p></div></Reveal>
      <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
        {SERVICES.map((service, index) => <Reveal key={service.id} delay={index * 70}><article className="group relative flex min-h-[390px] flex-col bg-card p-7 transition-colors duration-500 hover:bg-background md:p-10"><div className="flex items-start justify-between gap-4"><span className="font-serif text-2xl text-gold/55">{String(index + 1).padStart(2, '0')}</span><service.icon className="size-6 text-gold transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" /></div><h3 className="mt-10 font-serif text-3xl leading-tight text-primary"><Link href={service.href} className="after:absolute after:inset-0">{service.title}</Link></h3><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{service.description}</p><ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-foreground">{service.points.map((point) => <li key={point} className="before:mr-2 before:text-gold before:content-['—']">{point}</li>)}</ul><div className="mt-auto flex items-end justify-between gap-4 border-t border-border/70 pt-6"><div><p className="font-serif text-xl text-primary">{service.price}</p><p className="mt-1 text-xs text-muted-foreground">{service.priceNote}</p></div><span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold">Подробнее <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" /></span></div></article></Reveal>)}
      </div>
    </section>
  )
}
