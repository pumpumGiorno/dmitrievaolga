import Image from 'next/image'
import { Reveal } from '@/components/reveal'

export function EditorialInterlude() {
  return (
    <section className="section-shell py-6 md:py-12" aria-label="Подход к работе">
      <Reveal>
        <div className="relative min-h-[480px] overflow-hidden md:min-h-[620px]">
          <Image src="/objects/7848064247/1.png" alt="Интерьер объекта недвижимости" fill sizes="(max-width: 768px) 100vw, 1152px" className="object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.025]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-14">
            <p className="section-label text-[#d5c39c]">Точность решения</p>
            <blockquote className="mt-5 max-w-3xl font-serif text-[clamp(2rem,4vw,4rem)] leading-[1.08] tracking-[-.025em] text-primary-foreground text-balance">«Недвижимость — это не квадратные метры. Это решение, в котором нельзя ошибиться».</blockquote>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
