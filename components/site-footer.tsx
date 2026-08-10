import Link from 'next/link'
import { CONTACTS } from '@/lib/contacts'

const FOOTER_LINKS = [
  { href: '/catalog', label: 'Объекты' },
  { href: '/sales', label: 'Продажа' },
  { href: '/purchase', label: 'Покупка' },
  { href: '/legal', label: 'Юридическое сопровождение' },
  { href: '/mortgage', label: 'Ипотека' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary py-12 text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div>
            <p className="font-serif text-xl">Дмитриева Ольга</p>
            <p className="mt-1 text-sm text-primary-foreground/70">
              Эксперт по недвижимости — Чувашия и вся Россия
            </p>
            <div className="mt-4 flex flex-col items-center gap-1.5 md:items-start">
              <a
                href={CONTACTS.phoneHref}
                className="text-sm font-medium text-primary-foreground transition-colors hover:text-primary-foreground/80"
              >
                {CONTACTS.phoneDisplay}
              </a>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-start">
                <a
                  href={CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Telegram {CONTACTS.telegramHandle}
                </a>
                <a
                  href={CONTACTS.maxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  MAX
                </a>
              </div>
            </div>
          </div>
          <nav aria-label="Разделы сайта">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="border-t border-primary-foreground/15 pt-6 text-center text-xs text-primary-foreground/60 md:text-left">
          {new Date().getFullYear()} — Комфортные, безопасные и успешные сделки под ключ
        </p>
      </div>
    </footer>
  )
}
