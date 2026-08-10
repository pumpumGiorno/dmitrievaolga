import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const STATS = [
  { value: '5+', label: 'лет опыта на рынке недвижимости' },
  { value: '100%', label: 'юридическая чистота каждой сделки' },
  { value: '2', label: 'профильных специалиста в команде' },
]

export function About() {
  return (
    <section id="about" className="bg-card">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[2fr_3fr] md:px-6 md:py-24">
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-3xl bg-secondary" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-3xl">
              <Image
                src="/images/olga-business.jpg"
                alt="Дмитриева Ольга — деловой портрет"
                width={640}
                height={960}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-col gap-6">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Обо мне</p>
            <h2 className="font-serif text-3xl text-primary text-balance md:text-4xl">
              Экспертность, которой доверяют самые сложные сделки
            </h2>
            <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
              <p>
                Более 5 лет я помогаю людям покупать и продавать недвижимость — от типовых
                квартир до объектов со сложной историей: наследство, доли, обременения,
                межрегиональные сделки. Моя специализация — ситуации, в которых важно не
                ошибиться.
              </p>
              <p>
                Я работаю в синергии с профессиональным юристом и ипотечным
                брокером. Это значит, что каждый объект проходит глубокую юридическую
                проверку, а условия по ипотеке подбираются под вашу ситуацию — без лишних
                переплат и рисков.
              </p>
              <p>
                Для вас это одна точка входа и полная уверенность: все организационные,
                юридические вопросы и вопросы с расчётами я беру на себя.
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-serif text-3xl text-gold">{stat.value}</dd>
                  <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
