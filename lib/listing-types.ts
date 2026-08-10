export type ListingStatus = 'Активно' | 'Продано' | 'Снято' | 'Эксклюзив' | 'Снижение цены'
export type PublicationStatus = 'draft' | 'published'
export type ListingCategory = 'Квартира' | 'Дом' | 'Участок' | 'Комната' | 'Другое'

export interface Listing {
  id: string
  slug: string
  url: string
  category: ListingCategory
  title: string
  location: string
  address: string | null
  price: number | null
  priceOnRequest: boolean
  attributes: string[]
  rooms: number | null
  areaValue: number | null
  floor: number | null
  floors: number | null
  landArea: number | null
  landCategory: string | null
  status: ListingStatus
  publicationStatus: PublicationStatus
  shortDescription: string | null
  description: string
  photos: string[]
  imageQuery: string
  seoTitle: string | null
  seoDescription: string | null
  displayOrder: number
}

export function placeholderFor(listing: Pick<Listing, 'imageQuery'>): string {
  return `/placeholder.svg?height=720&width=960&query=${encodeURIComponent(listing.imageQuery)}`
}
