import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import { ContactProvider } from '@/components/contact-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Дмитриева Ольга — эксперт по недвижимости в Чувашии и по всей России',
  description:
    'Комфортная, безопасная и успешная сделка с недвижимостью под ключ. Опыт более 5 лет, сложные сделки, юридическое сопровождение, ипотека. Чебоксары, Чувашия, вся Россия.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f4ee',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`bg-background ${manrope.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <ContactProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ContactProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
