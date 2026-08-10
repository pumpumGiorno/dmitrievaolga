'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { useContact } from '@/components/contact-provider'
import { CONTACTS } from '@/lib/contacts'
import { cn } from '@/lib/utils'

const SERVICE_LINKS = [
  { href: '/sales', label: 'Продажа недвижимости' }, { href: '/purchase', label: 'Подбор и покупка' },
  { href: '/legal', label: 'Юридическое сопровождение' }, { href: '/mortgage', label: 'Ипотека' },
]
const NAV_ITEMS = [{ href: '/', label: 'Главная' }, { href: '/catalog', label: 'Объекты' }, { href: '/#booking', label: 'Онлайн-запись' }]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { openContact } = useContact()
  const isServicePage = SERVICE_LINKS.some((item) => pathname.startsWith(item.href))

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const linkClass = (active: boolean) => cn('editorial-link text-[13px] transition-colors hover:text-primary', active ? 'font-medium text-primary' : 'text-muted-foreground')

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500', scrolled || menuOpen ? 'border-border/70 bg-background/95 backdrop-blur-md' : 'border-border/35 bg-background/75')}>
      <div className={cn('section-shell flex items-center justify-between transition-[height] duration-500', scrolled ? 'h-16' : 'h-20')}>
        <Link href="/" className="flex flex-col leading-tight" aria-label="Дмитриева Ольга — главная">
          <span className={cn('font-serif text-primary transition-[font-size] duration-500', scrolled ? 'text-lg' : 'text-xl')}>Дмитриева Ольга</span>
          <span className="mt-1 text-[9px] uppercase tracking-[.32em] text-gold">частный эксперт по недвижимости</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className={linkClass(pathname === item.href)}>{item.label}</Link>)}
          <div className="group relative">
            <button type="button" className={cn('flex items-center gap-1 py-5', linkClass(isServicePage))} aria-haspopup="true">
              Услуги <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-1 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col border border-border bg-card p-2 shadow-[0_24px_50px_-30px_rgb(38_50_64/.4)]">
                {SERVICE_LINKS.map((item) => <Link key={item.href} href={item.href} className="px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-primary">{item.label}</Link>)}
              </div>
            </div>
          </div>
          <a href={CONTACTS.phoneHref} className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-gold"><Phone className="size-4 text-gold" aria-hidden="true" />{CONTACTS.phoneDisplay}</a>
          <button type="button" onClick={() => openContact()} className="premium-button rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Консультация</button>
        </nav>
        <button type="button" className="flex size-11 items-center justify-center rounded-md text-primary md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>{menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}</button>
      </div>
      {menuOpen ? <nav className="border-t border-border/60 bg-background md:hidden" aria-label="Мобильная навигация"><div className="section-shell flex flex-col gap-1 py-5">{[...NAV_ITEMS, ...SERVICE_LINKS].map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center border-b border-border/50 px-1 text-base text-foreground">{item.label}</Link>)}<a href={CONTACTS.phoneHref} className="flex min-h-11 items-center gap-2 px-1 font-medium text-primary"><Phone className="size-4 text-gold" />{CONTACTS.phoneDisplay}</a><button type="button" onClick={() => { setMenuOpen(false); openContact() }} className="mt-3 min-h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Получить консультацию</button></div></nav> : null}
    </header>
  )
}
