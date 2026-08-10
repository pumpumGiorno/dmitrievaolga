import Image from 'next/image'
import { MotionSection } from '@/components/motion-section'

export function EditorialInterlude() {
  return (
    <MotionSection>
      <section className="cinematic relative min-h-[78svh] overflow-hidden bg-primary md:min-h-[94svh]" aria-label="Подход к работе">
        <div data-parallax className="absolute -inset-y-12 inset-x-0"><Image src="/objects/7848064247/1.png" alt="Современный интерьер объекта недвижимости" fill sizes="100vw" className="object-cover" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(24_33_43/.82),rgb(24_33_43/.18)_75%),linear-gradient(0deg,rgb(24_33_43/.78),transparent_55%)]" aria-hidden="true" />
        <div className="section-shell relative flex min-h-[78svh] flex-col justify-between py-14 text-primary-foreground md:min-h-[94svh] md:py-20">
          <div className="flex items-center justify-between border-t border-primary-foreground/30 pt-5"><p className="section-label text-[#d5c39c]">Философия работы</p><span className="font-serif text-2xl text-primary-foreground/40">02</span></div>
          <blockquote data-motion="reveal" className="max-w-5xl font-serif text-[clamp(2.8rem,6.7vw,7rem)] leading-[.92] tracking-[-.045em] text-balance">Недвижимость —<br />не квадратные метры.<br /><em className="ml-[8vw] font-normal text-[#d5c39c]">Это решение,</em><br />в котором нельзя ошибиться.</blockquote>
          <div className="grid gap-6 border-t border-primary-foreground/25 pt-6 md:grid-cols-2"><p className="text-xs uppercase tracking-[.22em] text-primary-foreground/55">Точность · конфиденциальность · ответственность</p><p className="max-w-md text-sm leading-6 text-primary-foreground/70 md:justify-self-end">Каждая сделка рассматривается не как процесс, а как персональная стратегия защиты ваших интересов.</p></div>
        </div>
      </section>
    </MotionSection>
  )
}
