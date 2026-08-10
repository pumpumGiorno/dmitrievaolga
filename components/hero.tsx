import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="hero-stage relative min-h-[100svh] overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-y-0 right-0 w-full md:w-[57%]">
        <Image src="/images/olga-main.jpg" alt="Дмитриева Ольга — эксперт по недвижимости" fill priority sizes="(max-width: 768px) 100vw, 58vw" className="hero-image object-cover object-[62%_center] md:object-[58%_20%]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(26_35_45)_0%,rgb(26_35_45/.96)_39%,rgb(26_35_45/.56)_70%,rgb(26_35_45/.15)_100%)] md:bg-[linear-gradient(90deg,rgb(26_35_45)_0%,rgb(26_35_45/.98)_38%,rgb(26_35_45/.22)_73%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary to-transparent" aria-hidden="true" />
      <div className="section-shell relative flex min-h-[100svh] flex-col justify-end pb-12 pt-32 md:pb-16">
        <div className="max-w-[980px]">
          <p className="hero-kicker section-label text-[#d5c39c]">Private real estate advisor · Россия</p>
          <h1 className="hero-title mt-7 max-w-[920px] font-serif text-[clamp(3.6rem,7.8vw,8rem)] leading-[.86] tracking-[-.055em] text-balance">
            Точные решения<br /><span className="ml-[9vw] italic text-[#d5c39c]">в недвижимости</span>
          </h1>
          <div className="hero-copy mt-9 grid max-w-4xl gap-8 border-t border-primary-foreground/25 pt-7 md:grid-cols-[1fr_auto] md:items-end">
            <div><p className="text-xs uppercase tracking-[.24em] text-primary-foreground/55">Дмитриева Ольга</p><p className="mt-3 max-w-xl text-base leading-7 text-primary-foreground/78 md:text-lg">Персональное сопровождение покупки и продажи — от первого решения до передачи ключей.</p></div>
            <div className="flex flex-wrap gap-3"><a href="#contacts" className="premium-button inline-flex min-h-13 items-center gap-3 border border-[#c9b58c] bg-[#c9b58c] px-7 text-sm font-semibold uppercase tracking-[.12em] text-primary">Консультация <ArrowRight className="size-4" /></a><Link href="/catalog" className="premium-button inline-flex min-h-13 items-center border border-primary-foreground/35 px-7 text-sm font-medium uppercase tracking-[.12em] text-primary-foreground">Объекты</Link></div>
          </div>
        </div>
        <div className="mt-12 flex items-end justify-between gap-6"><p className="max-w-xs text-[10px] uppercase leading-5 tracking-[.2em] text-primary-foreground/45">5+ лет опыта · юридическая экспертиза · сложные сделки</p><a href="#about" className="group hidden items-center gap-3 text-[10px] uppercase tracking-[.25em] text-primary-foreground/55 md:flex">Исследовать <span className="flex size-10 items-center justify-center border border-primary-foreground/25 transition-transform duration-500 group-hover:rotate-45"><ArrowDownRight className="size-4" /></span></a></div>
      </div>
    </section>
  )
}
