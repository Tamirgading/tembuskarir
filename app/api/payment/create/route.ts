import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createSnapTransaction } from '@/lib/midtrans'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import type { UserRow } from '@/lib/utils'

import { VALID_BIDANG_SLUGS } from '@/lib/bidang-config'
import { getPlanPrice, VALID_PLAN_TYPES, getSatuanPrice } from '@/lib/plans'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const limit = rateLimit(`payment:${ip}`, { limit: 5, windowSeconds: 60 })
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { planType?: string; packageId?: string; bidang?: string }
    const { planType, packageId, bidang } = body

    if (!planType || !VALID_PLAN_TYPES.includes(planType as (typeof VALID_PLAN_TYPES)[number])) {
      return NextResponse.json({ error: 'Plan tidak valid.' }, { status: 400 })
    }

    const service = createServiceClient()

    // Per-paket: wajib packageId, harga dari tier paket (10k/15k)
    if (planType === 'package') {
      if (!packageId) {
        return NextResponse.json({ error: 'packageId wajib untuk pembelian per-paket.' }, { status: 400 })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: pkgData } = await (service.from('packages') as any)
        .select('slug')
        .eq('id', packageId)
        .single()
      if (!pkgData) {
        return NextResponse.json({ error: 'Paket tidak ditemukan.' }, { status: 404 })
      }
      const expectedAmount = getSatuanPrice((pkgData as { slug: string }).slug)
      const suffix = `PKG-${packageId.slice(0, 8)}`
      const orderId = `ORDER-${user.id.slice(0, 8)}-${suffix}-${Date.now()}`

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: subErr } = await (service.from('subscriptions') as any)
        .insert({
          user_id: user.id,
          midtrans_order_id: orderId,
          plan_type: 'package',
          amount: expectedAmount,
          status: 'pending',
          package_id: packageId,
        })

      if (subErr) {
        console.error('[Payment Create] DB error:', subErr)
        return NextResponse.json({ error: 'Gagal menyimpan data transaksi.' }, { status: 500 })
      }

      const snapData = await createSnapTransaction({
        orderId,
        amount: expectedAmount,
        customerName: '',
        customerEmail: user.email ?? '',
        planType: 'Paket Soal',
      })

      return NextResponse.json({ snapToken: snapData.token }, { status: 200 })
    }

    // PLN Tahap 2 & Complete: wajib pilih bidang
    if (['pln_tahap2_monthly', 'pln_complete_monthly'].includes(planType)) {
      if (!bidang || !VALID_BIDANG_SLUGS.includes(bidang)) {
        return NextResponse.json({ error: 'Bidang AKDING wajib dipilih untuk plan ini.' }, { status: 400 })
      }
    }

    const expectedAmount = getPlanPrice(planType)
    if (expectedAmount === undefined) {
      return NextResponse.json({ error: 'Plan tidak valid.' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profileData } = await (service.from('users') as any)
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const profile = profileData as Pick<UserRow, 'full_name' | 'email'> | null
    const customerName = profile?.full_name ?? 'Pengguna'
    const customerEmail = user.email ?? profile?.email ?? ''

    const suffix = planType.toUpperCase()
    const orderId = `ORDER-${user.id.slice(0, 8)}-${suffix}-${Date.now()}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subData, error: subErr } = await (service.from('subscriptions') as any)
      .insert({
        user_id: user.id,
        midtrans_order_id: orderId,
        plan_type: planType,
        amount: expectedAmount,
        status: 'pending',
        ...(bidang ? { bidang } : {}),
      })
      .select('id')
      .single()

    if (subErr) {
      console.error('[Payment Create] DB error:', subErr)
      return NextResponse.json({ error: 'Gagal menyimpan data transaksi.' }, { status: 500 })
    }

    console.log('[Payment Create] Subscription created:', subData?.id)

    const planLabels: Record<string, string> = {
      premium_monthly:      'Premium All Access — 1 Bulan',
      premium_quarterly:    'Premium All Access — 3 Bulan',
      astra_monthly:        'ASTRA Bulanan',
      bumn_t1_monthly:      'BUMN Tahap 1 Bulanan',
      bumn_t2_monthly:      'BUMN Tahap 2 Bulanan',
      pln_gat_monthly:      'PLN Tahap 1 GAT — 1 Bulan',
      pln_tahap2_monthly:   `PLN Tahap 2 (${bidang ?? ''}) — 1 Bulan`,
      pln_complete_monthly: `PLN Complete (${bidang ?? ''}) — 1 Bulan`,
      antam_monthly:        'ANTAM Bulanan',
    }

    const snapData = await createSnapTransaction({
      orderId,
      amount: expectedAmount,
      customerName,
      customerEmail,
      planType: planLabels[planType] ?? planType,
    })

    return NextResponse.json({ snapToken: snapData.token }, { status: 200 })
  } catch (err) {
    console.error('[Payment Create] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
