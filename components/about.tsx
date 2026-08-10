import Image from 'next/image'
import { MotionSection } from '@/components/motion-section'

const STATS = [{ value: '5+', label: 'лет практики' }, { value: '100%', label: 'юридическая чистота' }, { value: '2', label: 'эксперта в команде' }]

export function About() {
  return (
    <MotionSection className="about-section relative overflow-hidden bg-card py-24 md:py-44">
      <section id="about" className="section-shell relative">
        <span className="pointer-events-none absolute -right-8 -top-32 hidden font-serif text-[18rem] leading-none text-primary/[.035] lg:block" aria-hidden="true">01</span>
        <div className="grid gap-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-8">
          <div className="relative lg:-ml-14">
            <div className="absolute -bottom-8 left-10 right-0 top-14 border border-gold/35 bg-secondary" aria-hidden="true" />
            <div data-motion="image" className="relative ml-auto aspect-[4/5] w-[92%] overflow-hidden lg:w-full">
              <div data-parallax className="absolute -inset-y-10 inset-x-0"><Image src="/images/olga-business.jpg" alt="Дмитриева Ольга — частный эксперт по недвижимости" fill sizes="(max-width: 1024px) 90vw, 55vw" className="object-cover object-top" /></div>
            </div>
            <p className="absolute -bottom-4 left-0 bg-primary px-6 py-4 text-[10px] uppercase tracking-[.24em] text-primary-foreground">Частный советник<br />по недвижимости</p>
          </div>
          <div className="relative lg:-ml-10 lg:pl-20">
            <p data-motion="reveal" className="section-label">01 / Обо мне</p>
            <h2 data-motion="reveal" className="display-title mt-7">Спокойствие начинается с <em className="font-normal text-gold">точного решения</em></h2>
            <div data-motion="line" className="mt-9 h-px origin-left bg-gold/65" />
            <div data-motion="reveal" className="mt-9 grid gap-6 text-[15px] leading-7 text-muted-foreground md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><p>Более 5 лет я сопровождаю сделки — от типовых квартир до объектов с наследством, долями, обременениями и межрегиональной историей.</p><p>Вместе с юристом и ипотечным брокером создаю одну точку ответственности: каждый риск изучен, каждый шаг понятен заранее.</p></div>
            <dl data-stagger className="mt-12 grid grid-cols-3 border-y border-border">
              {STATS.map((stat) => <div key={stat.label} className="py-7 pr-3 md:py-9"><dd className="font-serif text-[clamp(2.4rem,4vw,4.5rem)] leading-none tracking-[-.05em] text-primary">{stat.value}</dd><dt className="mt-3 max-w-28 text-[10px] uppercase leading-4 tracking-[.15em] text-muted-foreground">{stat.label}</dt></div>)}
            </dl>
          </div>
        </div>
      </section>
    </MotionSection>
  )
}
