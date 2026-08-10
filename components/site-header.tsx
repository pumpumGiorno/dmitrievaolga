'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, ArrowUpRight } from 'lucide-react'
import { useContact } from '@/components/contact-provider'
import { CONTACTS } from '@/lib/contacts'
import { cn } from '@/lib/utils'

const SERVICE_LINKS = [{ href: '/sales', label: 'Продажа недвижимости' }, { href: '/purchase', label: 'Подбор и покупка' }, { href: '/legal', label: 'Юридическое сопровождение' }, { href: '/mortgage', label: 'Ипотека' }]
const NAV_ITEMS = [{ href: '/', label: 'Главная' }, { href: '/catalog', label: 'Объекты' }, { href: '/#booking', label: 'Онлайн-запись' }]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { openContact } = useContact()
  const isHome = pathname === '/'
  useEffect(() => { const update = () => setScrolled(window.scrollY > 42); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, [])
  const darkTop = isHome && !scrolled && !menuOpen

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 border-b transition-all duration-700', scrolled || menuOpen ? 'border-border/70 bg-background/90 shadow-[0_12px_40px_-32px_rgb(38_50_64/.5)] backdrop-blur-xl' : darkTop ? 'border-primary-foreground/15 bg-transparent' : 'border-border/40 bg-background/80 backdrop-blur-lg')}>
      <div className={cn('section-shell flex items-center justify-between transition-[height] duration-700', scrolled ? 'h-16' : 'h-24')}>
        <Link href="/" className="group flex items-center gap-4" aria-label="Дмитриева Ольга — главная"><span className={cn('flex size-10 items-center justify-center border font-serif text-lg italic transition-all duration-700', darkTop ? 'border-primary-foreground/35 text-primary-foreground' : 'border-gold/50 text-gold', scrolled && 'size-9')}>ДО</span><span className="flex flex-col leading-none"><span className={cn('font-serif text-xl transition-all duration-700', darkTop ? 'text-primary-foreground' : 'text-primary', scrolled && 'text-lg')}>Дмитриева Ольга</span><span className={cn('mt-2 text-[8px] uppercase tracking-[.28em] transition-colors', darkTop ? 'text-primary-foreground/50' : 'text-gold')}>Private real estate advisor</span></span></Link>
        <nav className={cn('hidden items-center transition-[gap] duration-700 md:flex', scrolled ? 'gap-5' : 'gap-8')} aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className={cn('editorial-link text-xs uppercase tracking-[.12em]', darkTop ? 'text-primary-foreground/70 hover:text-primary-foreground' : 'text-muted-foreground hover:text-primary')}>{item.label}</Link>)}
          <div className="group relative"><button type="button" className={cn('flex items-center gap-1 py-5 text-xs uppercase tracking-[.12em]', darkTop ? 'text-primary-foreground/70' : 'text-muted-foreground')} aria-haspopup="true">Услуги <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" /></button><div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-1 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"><div className="flex flex-col border border-border bg-card p-2 shadow-xl">{SERVICE_LINKS.map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-primary">{item.label}<ArrowUpRight className="size-3.5" /></Link>)}</div></div></div>
          <a href={CONTACTS.phoneHref} className={cn('flex items-center gap-2 text-xs', darkTop ? 'text-primary-foreground/70' : 'text-primary')}><Phone className="size-3.5 text-gold" />{CONTACTS.phoneDisplay}</a>
          <button type="button" onClick={() => openContact()} className={cn('premium-button min-h-11 border px-5 text-[10px] font-semibold uppercase tracking-[.14em]', darkTop ? 'border-primary-foreground/40 text-primary-foreground' : 'border-primary bg-primary text-primary-foreground')}>Консультация</button>
        </nav>
        <button type="button" className={cn('flex size-11 items-center justify-center md:hidden', darkTop ? 'text-primary-foreground' : 'text-primary')} onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>{menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}</button>
      </div>
      {menuOpen ? <nav className="border-t border-border bg-background md:hidden" aria-label="Мобильная навигация"><div className="section-shell flex flex-col py-4">{[...NAV_ITEMS, ...SERVICE_LINKS].map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center justify-between border-b border-border/60 text-sm uppercase tracking-[.08em] text-foreground">{item.label}<ArrowUpRight className="size-4 text-gold" /></Link>)}<button type="button" onClick={() => { setMenuOpen(false); openContact() }} className="premium-button mt-5 min-h-12 bg-primary px-5 text-xs uppercase tracking-[.14em] text-primary-foreground">Получить консультацию</button></div></nav> : null}
    </header>
  )
}
