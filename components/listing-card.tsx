import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Listing } from '@/lib/listing-types'
import { placeholderFor } from '@/lib/listing-types'

export function ListingCard({ listing, featured = false }: { listing: Listing; featured?: boolean }) {
  const cover = listing.photos[0] ?? placeholderFor(listing)
  return (
    <article className={`property-card group relative flex flex-col self-start ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-secondary ${featured ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[620px]' : 'aspect-[4/5]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover || '/placeholder.svg'} alt={`${listing.title}, ${listing.location}`} className="size-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.065]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/5 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-95" aria-hidden="true" />
        <div className="absolute left-5 top-5 flex gap-2"><span className="border border-primary-foreground/30 bg-primary/35 px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-primary-foreground backdrop-blur-md">{listing.category}</span>{listing.status !== 'Активно' ? <span className="bg-gold px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-gold-foreground">{listing.status}</span> : null}</div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground md:p-7"><p className="text-[10px] uppercase tracking-[.2em] text-primary-foreground/60">{listing.location}</p><div className="mt-3 flex items-end justify-between gap-5"><h3 className={`max-w-lg font-serif leading-[1.06] tracking-[-.025em] ${featured ? 'text-3xl md:text-5xl' : 'text-2xl'}`}><Link href={`/catalog/${listing.slug}`} className="after:absolute after:inset-0">{listing.title}</Link></h3><span className="flex size-11 shrink-0 translate-y-4 items-center justify-center border border-primary-foreground/40 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="size-5" /></span></div><ul className="mt-5 flex flex-wrap gap-4 border-t border-primary-foreground/20 pt-4 text-[10px] uppercase tracking-[.12em] text-primary-foreground/65">{listing.attributes.slice(0, 3).map((attr) => <li key={attr}>{attr}</li>)}</ul></div>
      </div>
    </article>
  )
}
