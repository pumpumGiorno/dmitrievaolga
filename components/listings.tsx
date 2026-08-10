import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MotionSection } from '@/components/motion-section'
import { ListingCard } from '@/components/listing-card'
import type { Listing } from '@/lib/listing-types'

export function Listings({ listings }: { listings: Listing[] }) {
  const preview = listings.slice(0, 5)
  return (
    <MotionSection className="bg-primary py-24 text-primary-foreground md:py-40">
      <section id="listings" className="section-shell">
        <div data-motion="reveal" className="grid gap-8 md:grid-cols-[1.2fr_.8fr] md:items-end"><div><p className="section-label text-[#d5c39c]">04 / Частная коллекция</p><h2 className="mt-7 max-w-4xl font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[.9] tracking-[-.045em] text-balance">Объекты с <em className="font-normal text-[#d5c39c]">характером</em></h2></div><p className="max-w-md leading-7 text-primary-foreground/60 md:justify-self-end">Отобранные квартиры, дома и участки. Подробная история и характеристики каждого объекта — без визуального шума.</p></div>
        <div data-motion="line" className="my-12 h-px origin-left bg-primary-foreground/20 md:my-16" />
        {preview.length ? <div data-stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{preview.map((listing, index) => <ListingCard key={listing.id} listing={listing} featured={index === 0} />)}</div> : <p>Каталог обновляется.</p>}
        <div className="mt-12 flex justify-end"><Link href="/catalog" className="premium-button inline-flex min-h-14 items-center gap-4 border border-primary-foreground/30 px-7 text-xs font-semibold uppercase tracking-[.16em] text-primary-foreground">Вся коллекция · {listings.length} <ArrowRight className="size-4" /></Link></div>
      </section>
    </MotionSection>
  )
}
