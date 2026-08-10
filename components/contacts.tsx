import { Phone, Send, MessageSquare, ArrowUpRight } from 'lucide-react'
import { MotionSection } from '@/components/motion-section'
import { ContactForm } from '@/components/contact-provider'
import { CONTACTS } from '@/lib/contacts'

export function Contacts() {
  return (
    <MotionSection className="bg-card py-24 md:py-40">
      <section id="contacts" className="section-shell">
        <div className="grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <div data-motion="reveal" className="flex flex-col"><p className="section-label">06 / Личный контакт</p><h2 className="display-title mt-7">Начнём с вашей <em className="font-normal text-gold">задачи</em></h2><p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground">Оставьте заявку — я свяжусь с вами в течение 15 минут в рабочее время и предложу ясный план действий.</p><div className="mt-12 border-t border-border"><a href={CONTACTS.phoneHref} className="group flex items-center justify-between border-b border-border py-6 font-serif text-2xl text-primary md:text-3xl">{CONTACTS.phoneDisplay}<ArrowUpRight className="size-5 text-gold transition-transform group-hover:rotate-45" /></a><div className="flex gap-7 border-b border-border py-6"><a href={CONTACTS.telegramUrl} target="_blank" rel="noopener noreferrer" className="editorial-link flex items-center gap-2 text-sm text-primary"><Send className="size-4 text-gold" />Telegram</a><a href={CONTACTS.maxUrl} target="_blank" rel="noopener noreferrer" className="editorial-link flex items-center gap-2 text-sm text-primary"><MessageSquare className="size-4 text-gold" />MAX</a></div></div></div>
          <div data-motion="reveal" className="relative border border-border bg-background p-7 md:p-12"><span className="absolute -right-5 -top-7 font-serif text-7xl text-gold/20" aria-hidden="true">06</span><div className="mb-9"><p className="text-[10px] uppercase tracking-[.22em] text-muted-foreground">Персональная консультация</p><h3 className="mt-3 font-serif text-3xl text-primary">Расскажите, что важно</h3></div><ContactForm /></div>
        </div>
      </section>
    </MotionSection>
  )
}
