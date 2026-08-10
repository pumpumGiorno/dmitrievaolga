import type { Metadata } from 'next'
import { getListings } from '@/lib/listings'
import { CatalogGrid } from '@/components/catalog-grid'

export const metadata: Metadata = { title: 'Каталог объектов — Дмитриева Ольга, недвижимость в Чувашии', description: 'Актуальные квартиры, дома, участки и комнаты в продаже в Чебоксарах и Чувашии.' }

export default async function CatalogPage() {
  const listings = await getListings()
  return <main className="pt-24"><section className="relative overflow-hidden border-b border-border bg-primary py-20 text-primary-foreground md:py-32"><span className="pointer-events-none absolute -right-8 -top-24 font-serif text-[18rem] leading-none text-primary-foreground/[.035]">COLLECTION</span><div className="section-shell relative grid gap-10 md:grid-cols-[1.3fr_.7fr] md:items-end"><div><p className="section-label text-[#d5c39c]">Private collection · {listings.length} объектов</p><h1 className="mt-7 max-w-5xl font-serif text-[clamp(4rem,8vw,8.5rem)] leading-[.86] tracking-[-.055em]">Объекты<br /><em className="ml-[10vw] font-normal text-[#d5c39c]">в продаже</em></h1></div><p className="max-w-md border-t border-primary-foreground/25 pt-6 leading-7 text-primary-foreground/60 md:justify-self-end">Отобранные квартиры, дома, участки и комнаты в Чебоксарах, Чувашии и соседних регионах.</p></div></section><section className="section-shell py-16 md:py-24"><CatalogGrid listings={listings} /></section></main>
}
