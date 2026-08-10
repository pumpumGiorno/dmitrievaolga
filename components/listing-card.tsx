import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import type { Listing, ListingStatus } from '@/lib/listing-types'
import { placeholderFor } from '@/lib/listing-types'

const STATUS_STYLES: Record<ListingStatus, string> = {
  Активно: 'bg-card/90 text-primary',
  Эксклюзив: 'bg-gold text-gold-foreground',
  'Снижение цены': 'bg-primary text-primary-foreground',
}

export function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.photos[0] ?? placeholderFor(listing)

  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover || '/placeholder.svg'}
          alt={`${listing.title}, ${listing.location}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-card/90 px-3.5 py-1.5 text-xs font-medium text-primary backdrop-blur-sm">
            {listing.category}
          </span>
          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm ${STATUS_STYLES[listing.status]}`}
          >
            {listing.status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-serif text-xl text-primary">
          <Link href={`/catalog/${listing.id}`} className="after:absolute after:inset-0">
            {listing.title}
          </Link>
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
          {listing.location}
        </p>

        {listing.attributes.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {listing.attributes.map((attr) => (
              <li key={attr} className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">
                {attr}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-sm text-muted-foreground">Цена — по запросу</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-transform duration-300 group-hover:translate-x-1">
            Подробнее
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  )
}
