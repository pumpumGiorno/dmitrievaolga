'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { useContact } from '@/components/contact-provider'
import { CONTACTS } from '@/lib/contacts'

const SERVICE_LINKS = [
  { href: '/sales', label: 'Продажа недвижимости' },
  { href: '/purchase', label: 'Подбор и покупка' },
  { href: '/legal', label: 'Юридическое сопровождение' },
  { href: '/mortgage', label: 'Ипотека' },
]

const NAV_ITEMS = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Объекты' },
  { href: '/#booking', label: 'Онлайн-запись' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openContact } = useContact()

  const isServicePage = SERVICE_LINKS.some((s) => pathname.startsWith(s.href))

  function linkClass(active: boolean) {
    return `text-sm transition-colors hover:text-primary ${
      active ? 'font-medium text-primary' : 'text-muted-foreground'
    }`
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-lg text-primary">Дмитриева Ольга</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold">недвижимость</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(pathname === item.href)}
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <button
              type="button"
              className={`flex items-center gap-1 py-4 ${linkClass(isServicePage)}`}
              aria-haspopup="true"
            >
              Услуги
              <ChevronDown
                className="size-4 transition-transform group-hover:rotate-180"
                aria-hidden="true"
              />
            </button>
            <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-1 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card py-2 shadow-xl">
                {SERVICE_LINKS.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={`px-5 py-2.5 text-sm transition-colors hover:bg-secondary ${
                      pathname.startsWith(s.href) ? 'font-medium text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <a
            href={CONTACTS.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-gold"
          >
            <Phone className="size-4 text-gold" aria-hidden="true" />
            {CONTACTS.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={() => openContact()}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          >
            Консультация
          </button>
        </nav>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md text-primary md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border/60 bg-background md:hidden" aria-label="Мобильная навигация">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {[...NAV_ITEMS, ...SERVICE_LINKS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-3 text-base transition-colors hover:bg-muted ${
                  pathname === item.href ? 'font-medium text-primary' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={CONTACTS.phoneHref}
              className="mt-1 flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-primary"
            >
              <Phone className="size-4 text-gold" aria-hidden="true" />
              {CONTACTS.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                openContact()
              }}
              className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Получить консультацию
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
