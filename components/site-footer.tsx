import Link from 'next/link'
import { CONTACTS } from '@/lib/contacts'

const FOOTER_LINKS = [{ href: '/catalog', label: 'Объекты' }, { href: '/sales', label: 'Продажа' }, { href: '/purchase', label: 'Покупка' }, { href: '/legal', label: 'Юридическое сопровождение' }, { href: '/mortgage', label: 'Ипотека' }]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-primary-foreground/10 bg-primary py-14 text-primary-foreground md:py-20">
      <div className="section-shell flex flex-col gap-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div><p className="section-label text-[#c9b58c]">Частный эксперт по недвижимости</p><p className="mt-4 font-serif text-3xl">Дмитриева Ольга</p><p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/60">Комфортные, безопасные и успешные сделки в Чувашии и по всей России.</p><div className="mt-6 flex flex-wrap gap-5 text-sm"><a href={CONTACTS.phoneHref} className="editorial-link">{CONTACTS.phoneDisplay}</a><a href={CONTACTS.telegramUrl} target="_blank" rel="noopener noreferrer" className="editorial-link text-primary-foreground/70">Telegram</a><a href={CONTACTS.maxUrl} target="_blank" rel="noopener noreferrer" className="editorial-link text-primary-foreground/70">MAX</a></div></div>
          <nav aria-label="Разделы сайта"><p className="section-label text-primary-foreground/45">Навигация</p><ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">{FOOTER_LINKS.map((link) => <li key={link.href}><Link href={link.href} className="editorial-link text-sm text-primary-foreground/75 hover:text-primary-foreground">{link.label}</Link></li>)}</ul></nav>
        </div>
        <div className="border-t border-primary-foreground/15 pt-7"><p className="font-serif text-[clamp(2.4rem,7vw,6.8rem)] leading-none tracking-[-.04em] text-primary-foreground/[.07]">ДМИТРИЕВА ОЛЬГА</p><p className="mt-7 text-xs text-primary-foreground/45">{new Date().getFullYear()} — Все права защищены</p></div>
      </div>
    </footer>
  )
}
