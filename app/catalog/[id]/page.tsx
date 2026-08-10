import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, MapPin, ShieldCheck, Scale, Landmark, Phone } from 'lucide-react'
import { CONTACTS } from '@/lib/contacts'
import { getListing, getListings, placeholderFor, type ListingStatus } from '@/lib/listings'
import { ListingGallery } from '@/components/listing-gallery'
import { ListingCard } from '@/components/listing-card'
import { ContactButton } from '@/components/contact-button'

const STATUS_STYLES: Record<ListingStatus, string> = {
  Активно: 'bg-secondary text-primary',
  Эксклюзив: 'bg-gold text-gold-foreground',
  'Снижение цены': 'bg-primary text-primary-foreground',
  Продано: 'bg-primary text-primary-foreground',
  Снято: 'bg-muted text-muted-foreground',
}

export async function generateStaticParams() {
  const listings = await getListings()
  return listings.map((l) => ({ id: l.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) return { title: 'Объект не найден' }
  return {
    title: listing.seoTitle || `${listing.title}, ${listing.location} — Дмитриева Ольга`,
    description: listing.seoDescription || listing.shortDescription || listing.description,
  }
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListing(id)
  if (!listing) notFound()

  const photos = listing.photos.length > 0 ? listing.photos : [placeholderFor(listing)]
  const listings = await getListings()
  const similar = listings
    .filter((l) => l.id !== listing.id && l.category === listing.category)
    .slice(0, 3)

  return (
    <main className="pt-16">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Назад в каталог
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[3fr_2fr]">
          <ListingGallery photos={photos} alt={`${listing.title}, ${listing.location}`} />

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-primary">
                {listing.category}
              </span>
              <span
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${STATUS_STYLES[listing.status]}`}
              >
                {listing.status}
              </span>
            </div>

            <div>
              <h1 className="font-serif text-3xl text-primary text-balance md:text-4xl">
                {listing.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
                {listing.location}
              </p>
            </div>

            {listing.attributes.length > 0 && (
              <dl className="grid grid-cols-2 gap-3">
                {listing.attributes.map((attr, i) => (
                  <div key={attr} className="rounded-2xl border border-border bg-card px-4 py-3">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      {i === 0
                        ? listing.category === 'Участок'
                          ? 'Площадь участка'
                          : 'Площадь'
                        : 'Характеристика'}
                    </dt>
                    <dd className="mt-0.5 font-serif text-lg text-primary">{attr}</dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="leading-relaxed text-muted-foreground">{listing.description}</p>

            <div className="rounded-3xl border border-gold/40 bg-card p-6">
              <p className="text-sm text-muted-foreground">Стоимость</p>
              <p className="mt-1 font-serif text-2xl text-primary">
                {listing.priceOnRequest || listing.price == null
                  ? 'По запросу'
                  : `${new Intl.NumberFormat('ru-RU').format(listing.price)} ₽`}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Свяжитесь со мной — назову актуальную цену, расскажу об истории объекта и
                организую показ в удобное время.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <ContactButton
                  variant="gold"
                  subject={`Объект: ${listing.title}, ${listing.location} (ID ${listing.id})`}
                >
                  Узнать цену и записаться на показ
                </ContactButton>
                <a
                  href={CONTACTS.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-8 py-3.5 text-sm font-medium text-primary transition-colors hover:border-gold hover:bg-secondary"
                >
                  <Phone className="size-4 text-gold" aria-hidden="true" />
                  Позвонить: {CONTACTS.phoneDisplay}
                </a>
                {listing.url ? (
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/20 px-8 py-3.5 text-sm font-medium text-primary transition-colors hover:border-gold hover:bg-secondary"
                  >
                    Объявление на Авито
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>

            <ul className="flex flex-col gap-3 text-sm text-foreground">
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-5 shrink-0 text-gold" aria-hidden="true" />
                Полная юридическая проверка объекта перед сделкой
              </li>
              <li className="flex items-center gap-3">
                <Scale className="size-5 shrink-0 text-gold" aria-hidden="true" />
                Сопровождение юриста на каждом этапе
              </li>
              <li className="flex items-center gap-3">
                <Landmark className="size-5 shrink-0 text-gold" aria-hidden="true" />
                Помощь с ипотекой — лучшие условия банков
              </li>
            </ul>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-secondary/50 py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <h2 className="mb-8 font-serif text-2xl text-primary md:text-3xl">Похожие объекты</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
