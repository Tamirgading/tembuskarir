/**
 * lib/access.ts
 * Utilitas terpusat untuk cek hak akses user ke paket soal.
 *
 * Hierarki akses:
 *   1. Paket gratis (is_free = true) → semua user
 *   2. Langganan Premium aktif (premium_monthly / premium_quarterly, status paid, belum expired)
 *      — berlaku untuk semua kategori paket
 *   3. Paket dibeli satuan (unlocked_packages)
 */

// Plan langganan premium yang membuka akses ke semua paket
const PREMIUM_PLANS = ['premium_monthly', 'premium_quarterly']

import { createServiceClient } from '@/lib/supabase/server'

export type AccessStatus =
  | 'free'          // paket gratis
  | 'subscribed'    // punya langganan aktif untuk kategori ini
  | 'unlocked'      // beli satuan
  | 'locked'        // belum beli apapun

/**
 * Cek apakah user bisa akses satu paket tertentu.
 * Gunakan di Server Components / API routes.
 */
export async function checkPackageAccess(
  userId: string,
  packageId: string,
  isFree: boolean
): Promise<AccessStatus> {
  if (isFree) return 'free'

  const supabase = createServiceClient()
  const now = new Date().toISOString()

  // Cek langganan premium aktif (berlaku untuk semua kategori paket)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sub } = await (supabase.from('subscriptions') as any)
    .select('id')
    .eq('user_id', userId)
    .in('plan_type', PREMIUM_PLANS)
    .eq('status', 'paid')
    .gt('expires_at', now)
    .limit(1)
    .maybeSingle()

  if (sub) return 'subscribed'

  // Cek unlock satuan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: unlock } = await (supabase.from('unlocked_packages') as any)
    .select('id')
    .eq('user_id', userId)
    .eq('package_id', packageId)
    .maybeSingle()

  if (unlock) return 'unlocked'

  return 'locked'
}

/**
 * Cek apakah user punya langganan Premium aktif.
 * Gunakan di dashboard / halaman harga untuk tampilkan status subscription.
 */
export async function getPremiumSubscriptionStatus(userId: string): Promise<{
  active: boolean
  expiresAt: string | null
  planType: string | null
}> {
  const supabase = createServiceClient()
  const now = new Date().toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('subscriptions') as any)
    .select('plan_type, expires_at')
    .eq('user_id', userId)
    .in('plan_type', PREMIUM_PLANS)
    .eq('status', 'paid')
    .gt('expires_at', now)
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return { active: false, expiresAt: null, planType: null }
  return {
    active: true,
    expiresAt: data.expires_at,
    planType: data.plan_type,
  }
}

/**
 * Ambil daftar package_id yang sudah di-unlock satuan oleh user.
 */
export async function getUnlockedPackageIds(userId: string): Promise<string[]> {
  const supabase = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('unlocked_packages') as any)
    .select('package_id')
    .eq('user_id', userId)

  return ((data ?? []) as { package_id: string }[]).map((r) => r.package_id)
}
