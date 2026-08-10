import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { EditorialInterlude } from '@/components/editorial-interlude'
import { Services } from '@/components/services'
import { Listings } from '@/components/listings'
import { BookingWidget } from '@/components/booking-widget'
import { Contacts } from '@/components/contacts'
import { getListings } from '@/lib/listings'

export default async function Page() {
  const listings = await getListings()
  return <main><Hero /><About /><EditorialInterlude /><Services /><Listings listings={listings} /><BookingWidget /><Contacts /></main>
}
