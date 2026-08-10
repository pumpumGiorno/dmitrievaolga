import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const STATS = [{ value: '5+', label: 'лет опыта на рынке недвижимости' }, { value: '100%', label: 'юридическая чистота каждой сделки' }, { value: '2', label: 'профильных специалиста в команде' }]

export function About() {
  return (
    <section id="about" className="bg-card py-20 md:py-32">
      <div className="section-shell grid items-center gap-14 md:grid-cols-[.88fr_1.12fr] md:gap-20">
        <Reveal><div className="relative mx-auto w-full max-w-md pb-5 pr-5"><div className="absolute inset-0 translate-x-5 translate-y-5 border border-gold/35 bg-secondary" aria-hidden="true" /><div className="relative aspect-[2/3] overflow-hidden"><Image src="/images/olga-business.jpg" alt="Дмитриева Ольга — деловой портрет" fill sizes="(max-width: 768px) 90vw, 440px" className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.025]" /></div></div></Reveal>
        <Reveal delay={120}><div className="flex flex-col"><p className="section-label">01 — Обо мне</p><h2 className="display-title mt-6 max-w-3xl">Экспертность, которой доверяют самые сложные сделки</h2><div className="mt-8 max-w-2xl columns-1 gap-8 text-[15px] leading-7 text-muted-foreground lg:columns-2"><p className="mb-5">Более 5 лет я помогаю людям покупать и продавать недвижимость — от типовых квартир до объектов со сложной историей: наследство, доли, обременения, межрегиональные сделки. Моя специализация — ситуации, в которых важно не ошибиться.</p><p className="mb-5">Я работаю в синергии с профессиональным юристом и ипотечным брокером. Каждый объект проходит глубокую юридическую проверку, а условия по ипотеке подбираются под вашу ситуацию.</p><p>Для вас это одна точка входа и полная уверенность: все организационные, юридические вопросы и вопросы с расчётами я беру на себя.</p></div><dl className="mt-10 grid grid-cols-1 border-t border-border sm:grid-cols-3">{STATS.map((stat) => <div key={stat.label} className="border-b border-border py-6 sm:border-b-0 sm:border-r sm:px-5 first:pl-0 last:border-r-0"><dt className="sr-only">{stat.label}</dt><dd className="font-serif text-4xl text-gold">{stat.value}</dd><dd className="mt-2 max-w-36 text-xs leading-relaxed text-muted-foreground">{stat.label}</dd></div>)}</dl></div></Reveal>
      </div>
    </section>
  )
}
