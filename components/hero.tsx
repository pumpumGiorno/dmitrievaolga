import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Scale, Landmark, ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Full-bleed background photo */}
      <Image
        src="/images/olga-main.jpg"
        alt="Дмитриева Ольга — эксперт по недвижимости"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] md:object-[75%_20%]"
      />
      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1b2330]/90 via-[#1b2330]/70 to-[#1b2330]/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1b2330]/80 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pb-28">
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Чувашия · вся Россия · опыт более 5 лет
          </p>
          <h1 className="font-serif text-4xl leading-tight text-white text-balance md:text-5xl lg:text-6xl">
            Эксперт по недвижимости Дмитриева Ольга
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/85 text-pretty">
            Комфортная, безопасная и успешная сделка под ключ. Я беру на себя все
            организационные, юридические вопросы и вопросы с расчётами — включая сложные сделки
            в Чувашии и по всей России.
          </p>
          <ul className="flex flex-col gap-3 text-sm text-white/90">
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-5 shrink-0 text-gold" aria-hidden="true" />
              Сделка под ключ: от первого звонка до передачи ключей
            </li>
            <li className="flex items-center gap-3">
              <Scale className="size-5 shrink-0 text-gold" aria-hidden="true" />
              В синергии с профессиональным юристом
            </li>
            <li className="flex items-center gap-3">
              <Landmark className="size-5 shrink-0 text-gold" aria-hidden="true" />
              Ипотечный брокер в команде — лучшие условия банков
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#contacts"
              className="rounded-full bg-gold px-8 py-4 text-base font-medium text-[#1b2330] transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
            >
              Получить консультацию
            </a>
            <Link
              href="/catalog"
              className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-colors hover:border-gold hover:bg-white/20"
            >
              Каталог объектов
            </Link>
          </div>
          <div className="mt-2 inline-flex w-fit items-baseline gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
            <p className="font-serif text-2xl text-white">5+ лет</p>
            <p className="text-xs uppercase tracking-wider text-white/70">успешных сделок</p>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 transition-colors hover:text-white"
        aria-label="Прокрутить вниз"
      >
        <ChevronDown className="size-7 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}
