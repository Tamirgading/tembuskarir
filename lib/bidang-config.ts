/**
 * lib/bidang-config.ts
 * Konfigurasi 12 bidang AKDING PLN Tahap 2.
 * Slug digunakan sebagai URL param dan nilai `bidang` di tabel subscriptions.
 */

export interface BidangInfo {
  slug: string       // URL-safe identifier
  name: string       // Nama lengkap bidang
  short: string      // Label pendek untuk kartu/badge
  color: string      // Tailwind accent color class untuk kartu
}

export const AKDING_BIDANG: BidangInfo[] = [
  { slug: 'akuntansi-keuangan',    name: 'Akuntansi & Keuangan',            short: 'Akuntansi',      color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { slug: 'hukum-regulasi',        name: 'Hukum & Regulasi Energi',         short: 'Hukum',          color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { slug: 'komunikasi-humas',      name: 'Komunikasi & Hubungan Masyarakat',short: 'Komunikasi',     color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { slug: 'manajemen-bisnis',      name: 'Manajemen & Bisnis',              short: 'Manajemen',      color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { slug: 'matematika-sains-data', name: 'Matematika & Sains Data',         short: 'Sains Data',     color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { slug: 'psikologi',             name: 'Psikologi',                       short: 'Psikologi',      color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { slug: 'teknik-elektro',        name: 'Teknik Elektro & Energi',         short: 'T. Elektro',     color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { slug: 'teknik-industri',       name: 'Teknik Industri & Logistik',      short: 'T. Industri',    color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { slug: 'teknik-informatika',    name: 'Teknik Informatika',              short: 'Informatika',    color: 'bg-brand/10 text-brand-700 border-brand/20' },
  { slug: 'teknik-kimia',          name: 'Teknik Kimia & Lingkungan',       short: 'T. Kimia',       color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { slug: 'teknik-mesin',          name: 'Teknik Mesin & Material',         short: 'T. Mesin',       color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { slug: 'teknik-sipil',          name: 'Teknik Sipil & Geoteknik',        short: 'T. Sipil',       color: 'bg-sky-50 text-sky-700 border-sky-200' },
]

/** Map slug → BidangInfo untuk lookup cepat */
export const BIDANG_BY_SLUG: Record<string, BidangInfo> = Object.fromEntries(
  AKDING_BIDANG.map((b) => [b.slug, b])
)

/** Semua slug yang valid */
export const VALID_BIDANG_SLUGS = AKDING_BIDANG.map((b) => b.slug)

/** PLN plan types yang butuh bidang */
export const PLN_BIDANG_PLANS = ['pln_tahap2_monthly', 'pln_complete_monthly'] as const

/** Semua PLN plan types */
export const PLN_PLAN_TYPES = [
  'pln_gat_monthly',
  'pln_tahap2_monthly',
  'pln_complete_monthly',
] as const

/** Harga PLN plans (Rupiah) */
export const PLN_PLAN_PRICES: Record<string, number> = {
  pln_gat_monthly:      30000,
  pln_tahap2_monthly:   30000,
  pln_complete_monthly: 44000,
}

/** Label human-readable untuk plan PLN */
export const PLN_PLAN_LABELS: Record<string, string> = {
  pln_gat_monthly:      'PLN Tahap 1 — GAT Bulanan',
  pln_tahap2_monthly:   'PLN Tahap 2 — Akademik Bulanan',
  pln_complete_monthly: 'PLN Complete Bulanan',
}

/**
 * Slug paket BI (satu paket, shared semua bidang).
 * Paket ini di-seed di migration.
 */
export const BI_FULL_SLUG   = 'bi-pln-full'
export const BI_DEMO_SLUG   = 'bi-pln-demo'

/** Prefix slug AKDING: akding-{bidang-slug}-{full|demo} */
export function akdingSlug(bidangSlug: string, tier: 'full' | 'demo') {
  return `akding-${bidangSlug}-${tier}`
}
