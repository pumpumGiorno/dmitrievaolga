import type { Metadata } from 'next'
import { getListings } from '@/lib/listings'
import { CatalogGrid } from '@/components/catalog-grid'

export const metadata: Metadata = {
  title: 'Каталог объектов — Дмитриева Ольга, недвижимость в Чувашии',
  description:
    'Актуальные квартиры, дома, участки и комнаты в продаже в Чебоксарах и Чувашии. Подробные страницы объектов с фото и характеристиками.',
}

export default async function CatalogPage() {
  const listings = await getListings()

  return (
    <main className="pt-16">
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Каталог</p>
          <h1 className="mt-3 font-serif text-4xl text-primary text-balance md:text-5xl">
            Объекты в продаже
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Квартиры, дома, участки и комнаты в Чебоксарах, Чувашии и соседних регионах.
            Нажмите на карточку, чтобы посмотреть фото, характеристики и оставить заявку по
            конкретному объекту.
          </p>
        </div>

        <CatalogGrid listings={listings} />
      </section>
    </main>
  )
}
