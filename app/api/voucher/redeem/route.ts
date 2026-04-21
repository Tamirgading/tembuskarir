import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

interface VoucherRow {
  id: string
  discount_type: string
  duration_days: number
  max_uses: number
  used_count: number
  expires_at: string | null
  is_active: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json() as { code?: string }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Kode voucher tidak boleh kosong.' }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu.' }, { status: 401 })
    }

    const service = createServiceClient()

    // 1. Cari voucher
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: voucherData, error: voucherErr } = await (service.from('vouchers') as any)
      .select('id, discount_type, duration_days, max_uses, used_count, expires_at, is_active')
      .eq('code', normalizedCode)
      .maybeSingle()

    if (voucherErr || !voucherData) {
      return NextResponse.json({ error: 'Kode voucher tidak ditemukan.' }, { status: 404 })
    }

    const voucher = voucherData as VoucherRow

    // 2. Validasi aktif
    if (!voucher.is_active) {
      return NextResponse.json({ error: 'Voucher ini sudah tidak aktif.' }, { status: 400 })
    }

    // 3. Validasi expired
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Voucher sudah kadaluarsa.' }, { status: 400 })
    }

    // 4. Validasi kuota (max_uses 0 = unlimited)
    if (voucher.max_uses > 0 && voucher.used_count >= voucher.max_uses) {
      return NextResponse.json({ error: 'Kuota voucher ini sudah habis.' }, { status: 400 })
    }

    // 5. Cek apakah user sudah pernah pakai voucher ini
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingUse } = await (service.from('voucher_uses') as any)
      .select('id')
      .eq('voucher_id', voucher.id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingUse) {
      return NextResponse.json({ error: 'Kamu sudah pernah menggunakan voucher ini.' }, { status: 400 })
    }

    // 6. Hitung expires_at baru untuk user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userData } = await (service.from('users') as any)
      .select('plan, plan_expires_at')
      .eq('id', user.id)
      .single()

    const userPlan: string = (userData as { plan: string; plan_expires_at: string | null } | null)?.plan ?? 'free'
    const currentExpiry: string | null = (userData as { plan: string; plan_expires_at: string | null } | null)?.plan_expires_at ?? null

    const now = new Date()
    let baseDate: Date

    if (userPlan === 'premium' && currentExpiry && new Date(currentExpiry) > now) {
      // Sudah premium — extend dari tanggal expire saat ini
      baseDate = new Date(currentExpiry)
    } else {
      // Free / expired — mulai dari sekarang
      baseDate = now
    }

    const newExpiry = new Date(baseDate.getTime() + voucher.duration_days * 24 * 60 * 60 * 1000)

    // 7. Jalankan dalam "transaksi" (sequential updates — Supabase tidak punya multi-row transaction di client)
    // Update user plan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateUserErr } = await (service.from('users') as any)
      .update({
        plan: 'premium',
        plan_expires_at: newExpiry.toISOString(),
      })
      .eq('id', user.id)

    if (updateUserErr) {
      console.error('[Voucher] Failed to update user plan:', updateUserErr)
      return NextResponse.json({ error: 'Gagal mengaktifkan voucher. Coba lagi.' }, { status: 500 })
    }

    // Catat penggunaan voucher
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (service.from('voucher_uses') as any)
      .insert({ voucher_id: voucher.id, user_id: user.id })

    // Increment used_count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (service.from('vouchers') as any)
      .update({ used_count: voucher.used_count + 1 })
      .eq('id', voucher.id)

    console.log('[Voucher] ✅ Redeemed:', normalizedCode, 'by user:', user.id, 'until:', newExpiry.toISOString())

    return NextResponse.json({
      message: 'Voucher berhasil digunakan!',
      expires_at: newExpiry.toISOString(),
      duration_days: voucher.duration_days,
    })
  } catch (err) {
    console.error('[Voucher] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 })
  }
}
