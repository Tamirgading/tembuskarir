/**
 * lib/plans.ts
 * Konfigurasi terpusat harga & plan berbayar.
 * Mendukung kustomisasi dinamis oleh Admin melalui tabel site_settings (key: 'plans_config').
 *
 * Satuan (per paket): 2 tier
 *   Rp 10.000 -> ASTRA ('astra-*'), PLN GAT Tahap 1 ('gat-pln-*')
 *   Rp 15.000 -> lainnya (BUMN, AKDING, BI, ANTAM, dll.)
 */


/** Prefix slug paket yang dihargai Rp 10.000 */
const SATUAN_10K_PREFIXES = ['astra-', 'gat-pln-']

export const SATUAN_10K = 10000
export const SATUAN_15K = 15000

/** Harga satuan sebuah paket berdasarkan slug. */
export function getSatuanPrice(slug: string | undefined): number {
  if (slug && SATUAN_10K_PREFIXES.some((p) => slug.startsWith(p))) return SATUAN_10K
  return SATUAN_15K
}

export interface PlanConfig {
  id: string
  category: 'premium' | 'company' | 'pln'
  price: number
  label: string
  period: string
  description: string
  features?: string[]
  badge?: string | null
  highlight?: boolean
  isActive: boolean
  requiresBidang?: boolean
}

/** Konfigurasi default semua plan langganan */
export const DEFAULT_PLANS: Record<string, PlanConfig> = {
  premium_monthly: {
    id: 'premium_monthly',
    category: 'premium',
    price: 49000,
    label: 'Premium All Access',
    period: '/ bulan',
    description: 'Akses SEMUA paket: ASTRA, BUMN (Tahap 1 & 2), PLN (GAT + Akademik semua bidang), OJK, dan ANTAM',
    features: [
      'Psikotes ASTRA (semua paket)',
      'RBB BUMN Tahap 1 & 2',
      'PLN GAT + Akademik semua bidang',
      'ANTAM semua stream',
      'Pembahasan lengkap & analisis skor',
    ],
    badge: 'Populer',
    highlight: true,
    isActive: true,
  },
  premium_quarterly: {
    id: 'premium_quarterly',
    category: 'premium',
    price: 129000,
    label: 'Premium All Access',
    period: '/ 3 bulan',
    description: 'Semua akses Premium selama 90 hari',
    features: [
      'Semua fitur Bulanan',
      'Hemat vs beli 3x bulanan',
      'Akses fitur baru selama periode',
    ],
    badge: 'Hemat 12%',
    highlight: false,
    isActive: true,
  },
  astra_monthly: {
    id: 'astra_monthly',
    category: 'company',
    price: 30000,
    label: 'ASTRA Bulanan',
    period: '/ bulan',
    description: 'Akses semua paket Psikotes ASTRA selama 30 hari.',
    features: [
      'Semua paket Psikotes ASTRA',
      'Timer simulasi real-time',
      'Pembahasan & analisis skor',
    ],
    badge: null,
    isActive: false, // Disembunyikan sesuai permintaan
  },
  bumn_t1_monthly: {
    id: 'bumn_t1_monthly',
    category: 'company',
    price: 35000,
    label: 'BUMN Tahap 1 Bulanan',
    period: '/ bulan',
    description: 'Akses paket RBB BUMN Tahap 1 (TKD · AKHLAK · TWK) selama 30 hari.',
    features: [
      'Semua paket BUMN Tahap 1',
      'TKD · AKHLAK · TWK',
      'Pembahasan & analisis skor',
    ],
    badge: null,
    isActive: false, // Disembunyikan sesuai permintaan
  },
  bumn_t2_monthly: {
    id: 'bumn_t2_monthly',
    category: 'company',
    price: 35000,
    label: 'BUMN Tahap 2 Bulanan',
    period: '/ bulan',
    description: 'Akses paket RBB BUMN Tahap 2 (Bahasa Inggris · LA) selama 30 hari.',
    features: [
      'Semua paket BUMN Tahap 2',
      'Bahasa Inggris & Learning Agility',
      'Pembahasan & analisis skor',
    ],
    badge: null,
    isActive: false, // Disembunyikan sesuai permintaan
  },
  antam_monthly: {
    id: 'antam_monthly',
    category: 'company',
    price: 25000,
    label: 'ANTAM Bulanan',
    period: '/ bulan',
    description: 'Akses semua paket ANTAM IMPACT (semua stream) selama 30 hari.',
    features: [
      'Semua paket ANTAM IMPACT',
      '14 Job Stream lengkap',
      'Pembahasan & analisis skor',
    ],
    badge: null,
    isActive: false, // Disembunyikan sesuai permintaan
  },
  pln_gat_monthly: {
    id: 'pln_gat_monthly',
    category: 'pln',
    price: 30000,
    label: 'Tahap 1: GAT',
    period: '/ bulan',
    description: 'Akses semua paket GAT PLN selama 30 hari. TKD 1 (Deret), TKD 2 (Silogisme & Sinonim), Pengetahuan PLN.',
    features: [
      'Semua paket GAT PLN',
      'Timer 30 dtk per soal',
      'Tes Pengetahuan PLN',
      'Riwayat & analisis skor',
    ],
    badge: null,
    isActive: true,
    requiresBidang: false,
  },
  pln_tahap2_monthly: {
    id: 'pln_tahap2_monthly',
    category: 'pln',
    price: 30000,
    label: 'Tahap 2: Akademik',
    period: '/ bulan',
    description: 'BI + AKDING 1 bidang pilihanmu selama 30 hari. Pilih bidang sebelum bayar.',
    features: [
      'Bahasa Inggris PLN (full)',
      'AKDING 1 bidang (full)',
      'Pilih bidang saat checkout',
      '1 bidang per subscription',
    ],
    badge: null,
    isActive: true,
    requiresBidang: true,
  },
  pln_complete_monthly: {
    id: 'pln_complete_monthly',
    category: 'pln',
    price: 44000,
    label: 'PLN Complete',
    period: '/ bulan',
    description: 'GAT + BI + AKDING 1 bidang. Persiapan PLN paling lengkap dalam 1 plan.',
    features: [
      'Semua paket GAT PLN',
      'Bahasa Inggris PLN (full)',
      'AKDING 1 bidang (full)',
      'Hemat vs beli terpisah',
    ],
    badge: 'Best Value',
    highlight: true,
    isActive: true,
    requiresBidang: true,
  },
}

/** Kompatibilitas mundur */
export const MONTHLY_PLANS = DEFAULT_PLANS
export type MonthlyPlanKey = keyof typeof DEFAULT_PLANS
export const VALID_PLAN_TYPES = ['package', ...Object.keys(DEFAULT_PLANS)] as const

export function getPlanPrice(planType: string): number | undefined {
  return DEFAULT_PLANS[planType]?.price
}

export function getPlanLabel(planType: string): string {
  return DEFAULT_PLANS[planType]?.label ?? planType
}


