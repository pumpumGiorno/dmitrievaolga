export type ListingStatus = 'Активно' | 'Эксклюзив' | 'Снижение цены'

export interface Listing {
  id: string
  url: string
  category: 'Квартира' | 'Дом' | 'Участок' | 'Комната'
  title: string
  location: string
  attributes: string[]
  rooms: number | null
  areaValue: number | null
  status: ListingStatus
  description: string
  photos: string[]
  imageQuery: string
}

export function placeholderFor(listing: Pick<Listing, 'imageQuery'>): string {
  return `/placeholder.svg?height=720&width=960&query=${encodeURIComponent(listing.imageQuery)}`
}
