import { Preloader } from '@/components/preloader'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Services } from '@/components/services'
import { Listings } from '@/components/listings'
import { BookingWidget } from '@/components/booking-widget'
import { Contacts } from '@/components/contacts'
import { getListings } from '@/lib/listings'

export default async function Page() {
  const listings = await getListings()

  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <About />
        <Services />
        <Listings listings={listings} />
        <BookingWidget />
        <Contacts />
      </main>
    </>
  )
}
