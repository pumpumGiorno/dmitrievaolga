import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { ListingCard } from '@/components/listing-card'
import type { Listing } from '@/lib/listing-types'

export function Listings({ listings }: { listings: Listing[] }) {
  const preview = listings.slice(0, 6)

  return (
    <section id="listings" className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Объекты</p>
            <h2 className="mt-3 font-serif text-3xl text-primary text-balance md:text-4xl">
              Актуальные объекты в продаже
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Квартиры, дома и участки в Чувашии и соседних регионах. По каждому объекту —
              подробная страница с фотографиями и характеристиками.
            </p>
          </div>
        </Reveal>

        {preview.length === 0 ? (
          <Reveal>
            <p className="text-center text-muted-foreground">
              Сейчас каталог обновляется. Свяжитесь со мной — подберу объект под ваш запрос.
            </p>
          </Reveal>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((listing, i) => (
                <Reveal key={listing.id} delay={(i % 3) * 80}>
                  <ListingCard listing={listing} />
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-12 text-center">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                >
                  Смотреть весь каталог ({listings.length})
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  )
}
