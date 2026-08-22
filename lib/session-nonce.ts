/**
 * lib/session-nonce.ts
 * Anti-sharing: enforce 1 akun = 1 perangkat aktif.
 *
 * Setiap login membuat session_nonce baru (kolom users) + cookie httpOnly `tk_nonce`.
 * Layout server membandingkan cookie vs users.session_nonce:
 *   - tidak cocok  → sesi ini bukan yang terbaru → sign out.
 */

import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'

export const NONCE_COOKIE = 'tk_nonce'

/** Set nonce baru untuk user (panggil setelah login sukses). */
export async function setSessionNonce(userId: string): Promise<string> {
  const nonce = crypto.randomUUID()
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (service.from('users') as any).update({ session_nonce: nonce }).eq('id', userId)

  const cookieStore = await cookies()
  cookieStore.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 hari
  })
  return nonce
}

/** Baca cookie nonce perangkat saat ini. */
export async function getDeviceNonce(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(NONCE_COOKIE)?.value ?? null
  } catch {
    return null
  }
}

/**
 * Cek apakah perangkat saat ini adalah yang aktif untuk user ini.
 * Jika user belum pernah login sejak fitur ini (session_nonce null) → dianggap valid.
 */
export function isSingleSessionValid(userSessionNonce: string | null | undefined, deviceNonce: string | null): boolean {
  if (!userSessionNonce) return true
  return deviceNonce === userSessionNonce
}
