import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Scale, Landmark, ArrowDownRight } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[min(920px,100svh)] items-end overflow-hidden bg-primary">
      <Image src="/images/olga-main.jpg" alt="Дмитриева Ольга — эксперт по недвижимости" fill priority sizes="100vw" className="object-cover object-[68%_center] md:object-[75%_20%]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(25_34_44/.93)_0%,rgb(25_34_44/.72)_48%,rgb(25_34_44/.18)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/75 to-transparent" aria-hidden="true" />
      <div className="section-shell relative w-full pb-20 pt-32 md:pb-24">
        <div className="max-w-3xl">
          <p className="hero-reveal section-label text-[#c9b58c]">Чувашия · вся Россия · опыт более 5 лет</p>
          <h1 className="hero-reveal hero-reveal-2 mt-6 max-w-3xl font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-[.98] tracking-[-.035em] text-primary-foreground text-balance">Эксперт по недвижимости <span className="italic text-[#d5c39c]">Дмитриева Ольга</span></h1>
          <div className="rule-grow mt-7 h-px max-w-xl bg-[#c9b58c]/60" />
          <p className="hero-reveal hero-reveal-3 mt-7 max-w-xl text-base leading-relaxed text-primary-foreground/82 md:text-lg">Комфортная, безопасная и успешная сделка под ключ. Организационные, юридические вопросы и расчёты — включая сложные сделки в Чувашии и по всей России.</p>
          <div className="hero-reveal hero-reveal-3 mt-8 flex flex-wrap gap-3"><a href="#contacts" className="premium-button rounded-full border border-[#c9b58c] bg-[#c9b58c] px-7 py-3.5 text-sm font-medium text-primary">Получить консультацию</a><Link href="/catalog" className="premium-button rounded-full border border-primary-foreground/35 px-7 py-3.5 text-sm font-medium text-primary-foreground">Каталог объектов</Link></div>
          <ul className="hero-reveal hero-reveal-3 mt-10 grid max-w-3xl gap-4 border-t border-primary-foreground/18 pt-6 text-sm text-primary-foreground/78 md:grid-cols-3">
            <li className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#c9b58c]" aria-hidden="true" /><span>Сделка под ключ — до передачи ключей</span></li>
            <li className="flex items-start gap-3"><Scale className="mt-0.5 size-4 shrink-0 text-[#c9b58c]" aria-hidden="true" /><span>В синергии с профессиональным юристом</span></li>
            <li className="flex items-start gap-3"><Landmark className="mt-0.5 size-4 shrink-0 text-[#c9b58c]" aria-hidden="true" /><span>Ипотечный брокер в команде</span></li>
          </ul>
        </div>
      </div>
      <a href="#about" className="absolute bottom-7 right-5 hidden items-center gap-2 text-[10px] uppercase tracking-[.25em] text-primary-foreground/60 transition-colors hover:text-primary-foreground md:flex" aria-label="Перейти к разделу обо мне">Далее <ArrowDownRight className="size-4" /></a>
    </section>
  )
}
