import type { Metadata } from 'next'
import { asc } from 'drizzle-orm'
import { isAdmin } from '@/app/actions/leads'
import { AdminLogin } from '@/components/admin-login'
import { PropertyAdmin } from '@/components/property-admin'
import { getAdminListings } from '@/lib/listings'
import { db } from '@/lib/db'
import { propertyPhotos } from '@/lib/db/schema'

export const metadata: Metadata = { title: 'Управление объектами', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-24"><AdminLogin /></main>
  }

  const [listings, photos] = await Promise.all([
    getAdminListings(),
    db.select().from(propertyPhotos).orderBy(asc(propertyPhotos.displayOrder)),
  ])
  const adminPhotos = photos.map((photo) => ({
    ...photo,
    url: photo.pathname.startsWith('/') ? photo.pathname : `/api/property-image?pathname=${encodeURIComponent(photo.pathname)}`,
  }))

  return <PropertyAdmin initialListings={listings} initialPhotos={adminPhotos} />
}
