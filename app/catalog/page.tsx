import type { Metadata } from 'next'
import { getListings } from '@/lib/listings'
import { CatalogGrid } from '@/components/catalog-grid'

export const metadata: Metadata = { title: 'Каталог объектов — Дмитриева Ольга, недвижимость в Чувашии', description: 'Актуальные квартиры, дома, участки и комнаты в продаже в Чебоксарах и Чувашии. Подробные страницы объектов с фото и характеристиками.' }

export default async function CatalogPage() {
  const listings = await getListings()
  return <main className="pt-20"><section className="section-shell py-16 md:py-24"><div className="mb-14 grid gap-7 border-b border-border pb-10 md:grid-cols-[1fr_1fr] md:items-end"><div><p className="section-label">Коллекция объектов</p><h1 className="display-title mt-5">Объекты в продаже</h1></div><p className="max-w-xl leading-relaxed text-muted-foreground md:justify-self-end">Квартиры, дома, участки и комнаты в Чебоксарах, Чувашии и соседних регионах. Откройте объект, чтобы посмотреть фотографии, характеристики и оставить заявку.</p></div><CatalogGrid listings={listings} /></section></main>
}
