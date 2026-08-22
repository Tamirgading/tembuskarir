/**
 * lib/plans.ts
 * Konfigurasi terpusat harga & plan berbayar.
 *
 * Satuan (per paket): 2 tier
 *   Rp 10.000 → ASTRA ('astra-*'), PLN GAT Tahap 1 ('gat-pln-*')
 *   Rp 15.000 → lainnya (BUMN, AKDING, BI, ANTAM, dll.)
 *
 * Langganan (bulanan / per tahap / All Access)
 */

/** Prefix slug paket yang dihargai Rp 10.000 */
const SATUAN_10K_PREFIXES = ['astra-', 'gat-pln-']

/** Harga satuan sebuah paket berdasarkan slug. */
export function getSatuanPrice(slug: string | undefined): number {
  if (slug && SATUAN_10K_PREFIXES.some((p) => slug.startsWith(p))) return 10000
  return 15000
}

export const SATUAN_10K = 10000
export const SATUAN_15K = 15000

export interface PlanConfig {
  price: number
  label: string
  period: string
  /** True = butuh pemilihan bidang (PLN Tahap 2 / Complete) */
  requiresBidang?: boolean
}

/** Semua plan langganan (bulanan/tahunan). */
export const MONTHLY_PLANS: Record<string, PlanConfig> = {
  premium_monthly:       { price: 49000,  label: 'Premium All Access', period: '/bulan' },
  premium_quarterly:     { price: 129000, label: 'Premium All Access', period: '/3 bulan' },
  astra_monthly:         { price: 30000,  label: 'ASTRA Bulanan',       period: '/bulan' },
  bumn_t1_monthly:       { price: 35000,  label: 'BUMN Tahap 1 Bulanan', period: '/bulan' },
  bumn_t2_monthly:       { price: 35000,  label: 'BUMN Tahap 2 Bulanan', period: '/bulan' },
  pln_gat_monthly:       { price: 30000,  label: 'PLN Tahap 1 GAT Bulanan', period: '/bulan' },
  pln_tahap2_monthly:    { price: 30000,  label: 'PLN Tahap 2 Bulanan',  period: '/bulan', requiresBidang: true },
  pln_complete_monthly:  { price: 44000,  label: 'PLN Complete Bulanan', period: '/bulan', requiresBidang: true },
  antam_monthly:         { price: 25000,  label: 'ANTAM Bulanan',       period: '/bulan' },
}

export type MonthlyPlanKey = keyof typeof MONTHLY_PLANS

/** Semua plan type yang valid (termasuk satuan 'package'). */
export const VALID_PLAN_TYPES = ['package', ...Object.keys(MONTHLY_PLANS)] as const

export function getPlanPrice(planType: string): number | undefined {
  return MONTHLY_PLANS[planType]?.price
}

export function getPlanLabel(planType: string): string {
  return MONTHLY_PLANS[planType]?.label ?? planType
}
