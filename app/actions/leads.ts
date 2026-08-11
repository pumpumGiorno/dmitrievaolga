'use server'

import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

const ADMIN_COOKIE = 'olga_admin'

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD || process.env.password
  if (!password) throw new Error('Admin password is not configured')
  return password
}

function sessionToken() {
  return createHmac('sha256', getAdminPassword()).update('olga-admin-session-v1').digest('hex')
}

function safeEqual(value: string, expected: string) {
  const left = Buffer.from(value)
  const right = Buffer.from(expected)
  return left.length === right.length && timingSafeEqual(left, right)
}

export async function adminSignIn(password: string): Promise<{ ok: boolean }> {
  if (!safeEqual(password, getAdminPassword())) return { ok: false }
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return { ok: true }
}

export async function adminSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const value = cookieStore.get(ADMIN_COOKIE)?.value
  return value ? safeEqual(value, sessionToken()) : false
}

