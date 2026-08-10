import { get } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname || !pathname.startsWith('properties/')) return new NextResponse('Not found', { status: 404 })

  const result = await get(pathname, {
    access: 'private',
    ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
  })
  if (!result) return new NextResponse('Not found', { status: 404 })
  if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, 'Cache-Control': 'public, max-age=0, must-revalidate' } })

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      ETag: result.blob.etag,
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
