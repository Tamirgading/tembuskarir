/**
 * lib/access.ts
 * Utilitas terpusat untuk cek hak akses user ke paket soal.
 *
 * Hierarki akses:
 *   1. Paket gratis (is_free = true) → semua user
 *   2. Langganan Premium aktif (premium_monthly / premium_quarterly)
 *      → semua paket non-PLN-bidang (ASTRA, PLN GAT, dll.)
 *   3. Langganan PLN GAT (pln_gat_monthly)
 *      → paket slug prefix 'gat-pln-*'
 *   4. Langganan PLN Tahap 2 (pln_tahap2_monthly, bidang=X)
 *      → paket BI ('bi-pln-*') + AKDING bidang X ('akding-X-*')
 *   5. Langganan PLN Complete (pln_complete_monthly, bidang=X)
 *      → GAT + BI + AKDING bidang X
 *   6. Paket dibeli satuan (unlocked_packages)
 */

import { createServiceClient } from '@/lib/supabase/server'
import { BI_DEMO_SLUG, BI_FULL_SLUG, akdingSlug } from '@/lib/bidang-config'

// Plan langganan premium generik (non-PLN-bidang)
const PREMIUM_PLANS = ['premium_monthly', 'premium_quarterly']

export type AccessStatus =
  | 'free'          // paket gratis
  | 'subscribed'    // punya langganan aktif
  | 'unlocked'      // beli satuan
  | 'locked'        // belum beli apapun

interface SubRow {
  id: string
  plan_type: string
  bidang: string | null
}

/**
 * Cek apakah paket dengan slug ini bisa diakses oleh PLN plan tertentu.
 */
function plnPlanCoversSlug(
  planType: string,
  bidang: string | null,
  packageSlug: string
): boolean {
  const isBI    = packageSlug.startsWith('bi-pln-')
  const isGAT   = packageSlug.startsWith('gat-pln-')
  const isAkding = bidang ? packageSlug.startsWith(`akding-${bidang}-`) : false

  if (planType === 'pln_gat_monthly')      return isGAT
  if (planType === 'pln_tahap2_monthly')   return isBI || isAkding
  if (planType === 'pln_complete_monthly') return isGAT || isBI || isAkding
  return false
}

/**
 * Cek apakah user bisa akses satu paket tertentu.
 * packageSlug diperlukan untuk logika PLN bidang-specific.
 */
export async function checkPackageAccess(
  userId: string,
  packageId: string,
  isFree: boolean,
  packageSlug?: string
): Promise<AccessStatus> {
  if (isFree) return 'free'

  const supabase = createServiceClient()
  const now = new Date().toISOString()

  // Ambil semua subscription aktif user (satu query)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subs } = await (supabase.from('subscriptions') as any)
    .select('id, plan_type, bidang')
    .eq('user_id', userId)
    .eq('status', 'paid')
    .gt('expires_at', now)

  const activeSubs = (subs ?? []) as SubRow[]

  // 1. Premium generik → akses semua kecuali bidang-specific AKDING
  const hasPremium = activeSubs.some((s) => PREMIUM_PLANS.includes(s.plan_type))
  if (hasPremium) {
    // Premium generik tidak cover AKDING bidang-specific
    const isAkdingFull = packageSlug ? (
      packageSlug.startsWith('akding-') && !packageSlug.endsWith('-demo')
    ) : false
    if (!isAkdingFull) return 'subscribed'
  }

  // 2. PLN plans (perlu cek slug paket)
  if (packageSlug) {
    const hasPlnAccess = activeSubs.some((s) =>
      ['pln_gat_monthly', 'pln_tahap2_monthly', 'pln_complete_monthly'].includes(s.plan_type)
      && plnPlanCoversSlug(s.plan_type, s.bidang, packageSlug)
    )
    if (hasPlnAccess) return 'subscribed'
  }

  // 3. Unlock satuan
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
 * Cek apakah user punya langganan Premium generik aktif.
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
  return { active: true, expiresAt: data.expires_at, planType: data.plan_type }
}

/**
 * Cek apakah user punya langganan PLN aktif (semua jenis plan PLN).
 */
export async function getPlnSubscriptionStatus(userId: string): Promise<{
  active: boolean
  planType: string | null
  bidang: string | null
  expiresAt: string | null
}> {
  const supabase = createServiceClient()
  const now = new Date().toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('subscriptions') as any)
    .select('plan_type, bidang, expires_at')
    .eq('user_id', userId)
    .in('plan_type', ['pln_gat_monthly', 'pln_tahap2_monthly', 'pln_complete_monthly'])
    .eq('status', 'paid')
    .gt('expires_at', now)
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return { active: false, planType: null, bidang: null, expiresAt: null }
  return { active: true, planType: data.plan_type, bidang: data.bidang, expiresAt: data.expires_at }
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

// Re-export BI_FULL_SLUG & akdingSlug agar tidak perlu import dari dua tempat
export { BI_DEMO_SLUG, BI_FULL_SLUG, akdingSlug }
