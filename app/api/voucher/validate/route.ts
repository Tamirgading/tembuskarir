import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getDynamicPlan } from '@/lib/plans-server'
import { getSatuanPrice } from '@/lib/plans'
import { validateVoucherForCheckout } from '@/lib/voucher'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu.' }, { status: 401 })
    }

    const body = await req.json() as { code?: string; planType?: string; packageId?: string }
    const { code, planType, packageId } = body

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Kode voucher tidak boleh kosong.' }, { status: 400 })
    }
    if (!planType || typeof planType !== 'string') {
      return NextResponse.json({ error: 'Plan tidak valid.' }, { status: 400 })
    }

    // Tentukan harga dasar di server (jangan percaya client)
    let price: number
    if (planType === 'package') {
      if (!packageId) {
        return NextResponse.json({ error: 'packageId wajib untuk paket satuan.' }, { status: 400 })
      }
      const service = createServiceClient()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: pkgData } = await (service.from('packages') as any)
        .select('slug')
        .eq('id', packageId)
        .single()
      if (!pkgData) {
        return NextResponse.json({ error: 'Paket tidak ditemukan.' }, { status: 404 })
      }
      price = getSatuanPrice((pkgData as { slug: string }).slug)
    } else {
      const plan = await getDynamicPlan(planType)
      if (!plan || !plan.isActive) {
        return NextResponse.json({ error: 'Plan ini sedang tidak aktif.' }, { status: 400 })
      }
      price = plan.price
    }

    const result = await validateVoucherForCheckout({
      code,
      userId: user.id,
      planType,
      packageId,
      price,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      code: result.voucher!.code,
      name: result.voucher!.name,
      discount_type: result.voucher!.discount_type,
      discount_value: result.voucher!.discount_value,
      original_amount: price,
      discount_amount: result.discount,
      final_amount: result.finalAmount,
    })
  } catch (err) {
    console.error('[Voucher Validate] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan. Coba lagi.' }, { status: 500 })
  }
}
