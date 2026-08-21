import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export type FeatureKey =
  | 'feature_info_seleksi'
  | 'feature_semua_paket'
  | 'feature_portal_pln'
  | 'feature_portal_bumn'
  | 'feature_portal_antam'

export type FeatureFlags = Record<FeatureKey, boolean>

const DEFAULTS: FeatureFlags = {
  feature_info_seleksi: true,
  feature_semua_paket: true,
  feature_portal_pln: true,
  feature_portal_bumn: true,
  feature_portal_antam: true,
}

export async function getFeatureFlags(): Promise<FeatureFlags> {
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('site_settings') as any)
    .select('key, value')
    .in('key', Object.keys(DEFAULTS))

  const flags = { ...DEFAULTS }
  if (data) {
    for (const row of data as { key: string; value: unknown }[]) {
      if (row.key in flags) {
        flags[row.key as FeatureKey] = row.value === true
      }
    }
  }
  return flags
}

export async function setFeatureFlag(key: FeatureKey, enabled: boolean): Promise<void> {
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('site_settings') as any)
    .upsert({ key, value: enabled, updated_at: new Date().toISOString() }, { onConflict: 'key' })
}

/**
 * Feature flags "efektif" sesuai viewer.
 * Admin selalu melihat SEMUA fitur (untuk preview pengembangan),
 * terlepas dari status flag di Pengaturan Fitur. User biasa hanya
 * melihat fitur yang diaktifkan admin.
 */
export async function getEffectiveFeatureFlags(userEmail?: string | null): Promise<FeatureFlags> {
  if (isAdmin(userEmail)) {
    return Object.fromEntries(
      (Object.keys(DEFAULTS) as FeatureKey[]).map((k) => [k, true])
    ) as FeatureFlags
  }
  return getFeatureFlags()
}
