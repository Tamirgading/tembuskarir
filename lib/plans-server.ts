/**
 * lib/plans-server.ts
 * Server-only module untuk membaca dan menyimpan konfigurasi plan ke database.
 */

import { createServiceClient } from '@/lib/supabase/server'
import { DEFAULT_PLANS, type PlanConfig } from '@/lib/plans'

/** Ambil seluruh konfigurasi plan dari database (dengan fallback default) */
export async function getPlansConfig(): Promise<Record<string, PlanConfig>> {
  try {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('site_settings') as any)
      .select('value')
      .eq('key', 'plans_config')
      .maybeSingle()

    if (data && data.value && typeof data.value === 'object') {
      const saved = data.value as Record<string, Partial<PlanConfig>>
      const merged: Record<string, PlanConfig> = {}
      for (const [k, def] of Object.entries(DEFAULT_PLANS)) {
        merged[k] = {
          ...def,
          ...(saved[k] || {}),
        }
      }
      return merged
    }
  } catch (err) {
    console.error('[PlansConfig] Error reading plans_config:', err)
  }
  return { ...DEFAULT_PLANS }
}

/** Ambil satu plan dinamis untuk validasi transaksi/pembayaran */
export async function getDynamicPlan(planType: string): Promise<PlanConfig | undefined> {
  const all = await getPlansConfig()
  return all[planType]
}

/** Simpan konfigurasi plan ke database (site_settings) */
export async function savePlansConfig(config: Record<string, Partial<PlanConfig>>): Promise<void> {
  const supabase = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('site_settings') as any)
    .upsert(
      { key: 'plans_config', value: config, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )
}
