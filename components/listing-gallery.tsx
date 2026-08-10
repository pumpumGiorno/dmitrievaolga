'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export function ListingGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
      if (event.key === 'ArrowLeft') setActive((i) => (i - 1 + photos.length) % photos.length)
      if (event.key === 'ArrowRight') setActive((i) => (i + 1) % photos.length)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, photos.length])

  if (photos.length === 0) return null

  const prev = () => setActive((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setActive((i) => (i + 1) % photos.length)

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Открыть фото ${active + 1} крупно`}
          className="size-full cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[active] || '/placeholder.svg'}
            alt={`${alt} — фото ${active + 1} из ${photos.length}`}
            className="size-full object-cover"
          />
        </button>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущее фото"
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-primary opacity-0 backdrop-blur-sm transition-opacity hover:bg-card focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующее фото"
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 text-primary opacity-0 backdrop-blur-sm transition-opacity hover:bg-card focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-primary/70 px-3 py-1 text-xs text-primary-foreground backdrop-blur-sm">
              {active + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Показать фото ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl transition-all ${
                i === active ? 'ring-2 ring-gold' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo || '/placeholder.svg'} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {isOpen ? (
        <div role="dialog" aria-modal="true" aria-label={`Фотографии объекта: ${alt}`} className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 p-4 md:p-10" onClick={() => setIsOpen(false)}>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Закрыть просмотр" className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full bg-card/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-card/25 md:right-8 md:top-8"><X className="size-6" aria-hidden="true" /></button>
          <div className="relative flex size-full items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[active] || '/placeholder.svg'} alt={`${alt} — фото ${active + 1} из ${photos.length}`} className="max-h-full max-w-full object-contain" />
            {photos.length > 1 ? (
              <>
                <button type="button" onClick={prev} aria-label="Предыдущее фото" className="absolute left-0 flex size-12 items-center justify-center rounded-full bg-card/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-card/25 md:left-4"><ChevronLeft className="size-6" aria-hidden="true" /></button>
                <button type="button" onClick={next} aria-label="Следующее фото" className="absolute right-0 flex size-12 items-center justify-center rounded-full bg-card/15 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-card/25 md:right-4"><ChevronRight className="size-6" aria-hidden="true" /></button>
              </>
            ) : null}
            <span className="absolute bottom-0 rounded-full bg-card/15 px-4 py-2 text-xs text-primary-foreground backdrop-blur-sm">{active + 1} / {photos.length}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
