/**
 * lib/voucher.ts
 * Helper terpusat untuk voucher: validasi, scope, dan perhitungan diskon.
 *
 * Dua jenis voucher:
 *   - free_days / plan_upgrade : memberi akses premium gratis X hari (redeem di /redeem)
 *   - percent                  : potongan harga (%) saat checkout pembayaran
 */

import { createServiceClient } from '@/lib/supabase/server'

export interface VoucherRow {
  id: string
  code: string
  name: string | null
  discount_type: string
  discount_value: number
  duration_days: number
  applies_to: string
  plan_types: string[] | null
  package_ids: string[] | null
  max_uses: number
  used_count: number
  expires_at: string | null
  is_active: boolean
  note: string | null
}

export async function getVoucherByCode(code: string): Promise<VoucherRow | null> {
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (service.from('vouchers') as any)
    .select('id, code, name, discount_type, discount_value, duration_days, applies_to, plan_types, package_ids, max_uses, used_count, expires_at, is_active, note')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle()
  return (data as VoucherRow | null) ?? null
}

export async function hasUserUsedVoucher(voucherId: string, userId: string): Promise<boolean> {
  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (service.from('voucher_uses') as any)
    .select('id')
    .eq('voucher_id', voucherId)
    .eq('user_id', userId)
    .maybeSingle()
  return Boolean(data)
}

/** Apakah voucher berlaku untuk pembelian plan/paket tertentu. */
export function voucherAppliesTo(
  voucher: VoucherRow,
  planType: string,
  packageId?: string | null
): boolean {
  if (voucher.applies_to === 'all') return true
  if (voucher.applies_to === 'plan') return (voucher.plan_types ?? []).includes(planType)
  if (voucher.applies_to === 'package') {
    return Boolean(packageId && (voucher.package_ids ?? []).includes(packageId))
  }
  return false
}

/** Hitung nominal potongan harga (dibulatkan ke rupiah). */
export function computeVoucherDiscount(voucher: VoucherRow, price: number): number {
  if (voucher.discount_type !== 'percent') return 0
  const pct = Math.max(0, Math.min(100, voucher.discount_value))
  return Math.round((price * pct) / 100)
}

export interface VoucherCheckoutResult {
  ok: boolean
  error?: string
  voucher?: VoucherRow
  discount?: number
  finalAmount?: number
}

/**
 * Validasi voucher untuk pembayaran checkout + hitung harga akhir.
 * Semua pengecekan dilakukan server-side.
 */
export async function validateVoucherForCheckout(opts: {
  code: string
  userId: string
  planType: string
  packageId?: string | null
  price: number
}): Promise<VoucherCheckoutResult> {
  const { code, userId, planType, packageId, price } = opts

  const voucher = await getVoucherByCode(code)
  if (!voucher) return { ok: false, error: 'Kode voucher tidak ditemukan.' }
  if (!voucher.is_active) return { ok: false, error: 'Voucher ini sudah tidak aktif.' }
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return { ok: false, error: 'Voucher sudah kedaluwarsa.' }
  }
  if (voucher.max_uses > 0 && voucher.used_count >= voucher.max_uses) {
    return { ok: false, error: 'Kuota voucher ini sudah habis.' }
  }
  if (voucher.discount_type !== 'percent') {
    return { ok: false, error: 'Voucher ini bukan voucher diskon pembayaran.' }
  }
  if (!voucherAppliesTo(voucher, planType, packageId)) {
    return { ok: false, error: 'Voucher tidak berlaku untuk pembelian ini.' }
  }
  if (await hasUserUsedVoucher(voucher.id, userId)) {
    return { ok: false, error: 'Kamu sudah pernah menggunakan voucher ini.' }
  }

  const rawDiscount = computeVoucherDiscount(voucher, price)
  const finalAmount = Math.max(1, price - rawDiscount)
  const discount = price - finalAmount
  if (discount <= 0) {
    return { ok: false, error: 'Voucher tidak menghasilkan potongan harga.' }
  }

  return { ok: true, voucher, discount, finalAmount }
}

// ── Parsing input dari admin ────────────────────────────────────────────────

export interface VoucherInput {
  code: string
  name: string | null
  discount_type: 'percent' | 'free_days'
  discount_value: number
  duration_days: number
  max_uses: number
  expires_at: string | null
  is_active: boolean
  applies_to: 'all' | 'plan' | 'package'
  plan_types: string[]
  package_ids: string[]
  note: string | null
}

export function parseVoucherInput(
  body: Record<string, unknown>
): { ok: true; value: VoucherInput } | { ok: false; error: string } {
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
  if (!code) return { ok: false, error: 'Kode voucher wajib diisi.' }

  const discount_type: 'percent' | 'free_days' =
    body.discount_type === 'percent' ? 'percent' : 'free_days'

  const discount_value = Number(body.discount_value ?? 0)
  if (discount_type === 'percent' && (!Number.isFinite(discount_value) || discount_value < 1 || discount_value > 100)) {
    return { ok: false, error: 'Persentase diskon harus antara 1 sampai 100.' }
  }

  const duration_days = Number(body.duration_days ?? 0)
  if (discount_type === 'free_days' && (!Number.isFinite(duration_days) || duration_days < 1)) {
    return { ok: false, error: 'Durasi hari minimal 1.' }
  }

  const applies_to: 'all' | 'plan' | 'package' =
    body.applies_to === 'plan' || body.applies_to === 'package' ? body.applies_to : 'all'

  const plan_types = Array.isArray(body.plan_types)
    ? (body.plan_types as unknown[]).filter((x): x is string => typeof x === 'string')
    : []
  const package_ids = Array.isArray(body.package_ids)
    ? (body.package_ids as unknown[]).filter((x): x is string => typeof x === 'string')
    : []

  if (applies_to === 'plan' && plan_types.length === 0) {
    return { ok: false, error: 'Pilih minimal satu plan yang berlaku.' }
  }
  if (applies_to === 'package' && package_ids.length === 0) {
    return { ok: false, error: 'Pilih minimal satu paket yang berlaku.' }
  }

  const maxUsesRaw = Number(body.max_uses ?? 1)
  const max_uses = Number.isFinite(maxUsesRaw) && maxUsesRaw >= 0 ? Math.floor(maxUsesRaw) : 1

  const expires_at =
    typeof body.expires_at === 'string' && body.expires_at
      ? new Date(body.expires_at).toISOString()
      : null

  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null
  const note = typeof body.note === 'string' && body.note.trim() ? body.note.trim() : null
  const is_active = body.is_active === undefined ? true : Boolean(body.is_active)

  return {
    ok: true,
    value: {
      code,
      name,
      discount_type,
      discount_value: discount_type === 'percent' ? Math.floor(discount_value) : 0,
      duration_days: discount_type === 'free_days' ? Math.floor(duration_days) : 0,
      max_uses,
      expires_at,
      is_active,
      applies_to,
      plan_types,
      package_ids,
      note,
    },
  }
}
