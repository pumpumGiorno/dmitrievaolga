import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import type { Listing, ListingStatus } from '@/lib/listing-types'
import { placeholderFor } from '@/lib/listing-types'

const STATUS_STYLES: Record<ListingStatus, string> = { Активно: 'bg-card/90 text-primary', Эксклюзив: 'bg-gold text-gold-foreground', 'Снижение цены': 'bg-primary text-primary-foreground' }

export function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.photos[0] ?? placeholderFor(listing)
  return (
    <article className="card-lift group relative flex h-full flex-col overflow-hidden border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover || '/placeholder.svg'} alt={`${listing.title}, ${listing.location}`} className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2"><span className="rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">{listing.category}</span>{listing.status !== 'Активно' ? <span className={`rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLES[listing.status]}`}>{listing.status}</span> : null}</div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-[.14em] text-muted-foreground"><MapPin className="size-3.5 shrink-0 text-gold" aria-hidden="true" />{listing.location}</p>
        <h3 className="mt-3 font-serif text-[1.4rem] leading-snug text-primary transition-transform duration-500 group-hover:translate-x-1"><Link href={`/catalog/${listing.id}`} className="after:absolute after:inset-0">{listing.title}</Link></h3>
        {listing.attributes.length > 0 ? <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">{listing.attributes.map((attr) => <li key={attr}>{attr}</li>)}</ul> : null}
        <div className="mt-auto flex items-end justify-between gap-4 pt-6"><div><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Стоимость</p><p className="mt-1 font-serif text-lg text-primary">По запросу</p></div><span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold">Подробнее <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" /></span></div>
      </div>
    </article>
  )
}
