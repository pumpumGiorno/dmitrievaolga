'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ListingCard } from '@/components/listing-card'
import type { Listing } from '@/lib/listing-types'

type CategoryFilter = 'Все' | Listing['category']
type RoomsFilter = 'any' | '1' | '2' | '3' | '4+'
type AreaFilter = 'any' | 'lt40' | '40-70' | 'gt70'

const CATEGORIES: CategoryFilter[] = ['Все', 'Квартира', 'Дом', 'Участок', 'Комната']
const ROOMS: { value: RoomsFilter; label: string }[] = [
  { value: 'any', label: 'Любая' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4+', label: '4+' },
]
const AREAS: { value: AreaFilter; label: string }[] = [
  { value: 'any', label: 'Любая' },
  { value: 'lt40', label: 'до 40 м²' },
  { value: '40-70', label: '40–70 м²' },
  { value: 'gt70', label: 'от 70 м²' },
]

export function CatalogGrid({ listings }: { listings: Listing[] }) {
  const [category, setCategory] = useState<CategoryFilter>('Все')
  const [rooms, setRooms] = useState<RoomsFilter>('any')
  const [area, setArea] = useState<AreaFilter>('any')
  const [location, setLocation] = useState<string>('any')

  const locations = useMemo(
    () => Array.from(new Set(listings.map((l) => l.location))).sort(),
    [listings],
  )

  const showRooms = category === 'Все' || category === 'Квартира'
  const showArea = category !== 'Участок'

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (category !== 'Все' && l.category !== category) return false
      if (location !== 'any' && l.location !== location) return false
      if (showRooms && rooms !== 'any') {
        if (l.category !== 'Квартира') return false
        if (rooms === '4+') {
          if ((l.rooms ?? 0) < 4) return false
        } else if (String(l.rooms) !== rooms) {
          return false
        }
      }
      if (showArea && area !== 'any') {
        if (l.areaValue == null) return false
        if (area === 'lt40' && l.areaValue >= 40) return false
        if (area === '40-70' && (l.areaValue < 40 || l.areaValue > 70)) return false
        if (area === 'gt70' && l.areaValue <= 70) return false
      }
      return true
    })
  }, [listings, category, rooms, area, location, showRooms, showArea])

  function chipClass(active: boolean) {
    return `rounded-full px-4 py-2 text-sm transition-all ${
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'border border-border bg-card text-muted-foreground hover:border-gold hover:text-primary'
    }`
  }

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 md:p-7">
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <SlidersHorizontal className="size-4 text-gold" aria-hidden="true" />
          Фильтры
        </p>

        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="mb-2 w-full text-xs uppercase tracking-wider text-muted-foreground">
            Тип объекта
          </legend>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c)
                if (c !== 'Все' && c !== 'Квартира') setRooms('any')
                if (c === 'Участок') setArea('any')
              }}
              aria-pressed={category === c}
              className={chipClass(category === c)}
            >
              {c === 'Все' ? 'Все' : c === 'Квартира' ? 'Квартиры' : c === 'Дом' ? 'Дома' : c === 'Участок' ? 'Участки' : 'Комнаты'}
            </button>
          ))}
        </fieldset>

        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {showRooms && (
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="mb-2 w-full text-xs uppercase tracking-wider text-muted-foreground">
                Комнат
              </legend>
              {ROOMS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRooms(r.value)}
                  aria-pressed={rooms === r.value}
                  className={chipClass(rooms === r.value)}
                >
                  {r.label}
                </button>
              ))}
            </fieldset>
          )}

          {showArea && (
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="mb-2 w-full text-xs uppercase tracking-wider text-muted-foreground">
                Площадь
              </legend>
              {AREAS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setArea(a.value)}
                  aria-pressed={area === a.value}
                  className={chipClass(area === a.value)}
                >
                  {a.label}
                </button>
              ))}
            </fieldset>
          )}

          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="mb-2 w-full text-xs uppercase tracking-wider text-muted-foreground">
              Расположение
            </legend>
            <button
              type="button"
              onClick={() => setLocation('any')}
              aria-pressed={location === 'any'}
              className={chipClass(location === 'any')}
            >
              Все города
            </button>
            {locations.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                aria-pressed={location === loc}
                className={chipClass(location === loc)}
              >
                {loc}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length === 0
          ? 'По выбранным фильтрам объектов не найдено'
          : `Найдено объектов: ${filtered.length}`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center">
          <p className="font-serif text-xl text-primary">Ничего не нашлось</p>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted-foreground">
            Попробуйте изменить фильтры — или оставьте заявку, и я подберу объект под ваш запрос,
            включая вари��нты, которых нет в открытом каталоге.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
