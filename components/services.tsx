import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MotionSection } from '@/components/motion-section'
import { SERVICES } from '@/lib/services'

export function Services() {
  return (
    <MotionSection className="relative overflow-hidden bg-background py-24 md:py-40">
      <section id="services" className="section-shell">
        <div data-motion="reveal" className="grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-end"><p className="section-label">03 / Экспертиза</p><div><h2 className="display-title max-w-4xl">Сервис, выстроенный вокруг <em className="font-normal text-gold">ваших интересов</em></h2><p className="mt-6 max-w-xl leading-7 text-muted-foreground">Прозрачные условия, фиксированная стоимость и полная ответственность за каждый этап.</p></div></div>
        <div data-motion="line" className="my-12 h-px origin-left bg-border md:my-16" />
        <div data-stagger className="grid border-x border-t border-border md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <article key={service.id} className="service-card group relative flex min-h-[430px] flex-col overflow-hidden border-b border-border p-7 md:min-h-[500px] md:p-11 md:odd:border-r">
              <div className="flex items-start justify-between"><span className="font-serif text-5xl text-primary/15 transition-colors duration-500 group-hover:text-gold/60">{String(index + 1).padStart(2, '0')}</span><service.icon className="size-7 text-gold" aria-hidden="true" /></div>
              <h3 className="mt-12 max-w-md font-serif text-[clamp(2rem,3vw,3.2rem)] leading-[1.02] tracking-[-.03em] text-primary"><Link href={service.href} className="after:absolute after:inset-0">{service.title}</Link></h3>
              <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">{service.description}</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[.1em] text-foreground/65">{service.points.map((point) => <li key={point}>— {point}</li>)}</ul>
              <div className="mt-auto flex items-end justify-between gap-5 border-t border-border pt-7"><div><p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">Стоимость</p><p className="mt-2 font-serif text-3xl text-primary">{service.price}</p><p className="mt-1 text-xs text-muted-foreground">{service.priceNote}</p></div><span className="flex size-12 items-center justify-center border border-gold text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-gold-foreground"><ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" /></span></div>
            </article>
          ))}
        </div>
      </section>
    </MotionSection>
  )
}
