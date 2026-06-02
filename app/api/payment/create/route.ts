import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createSnapTransaction } from '@/lib/midtrans'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import type { UserRow } from '@/lib/utils'

import { PLN_PLAN_PRICES, VALID_BIDANG_SLUGS } from '@/lib/bidang-config'

const PLAN_PRICES: Record<string, number> = {
  premium_monthly:   39000,
  premium_quarterly: 89000,
  package:           10000,
  ...PLN_PLAN_PRICES,        // pln_gat_monthly:30000, pln_tahap2_monthly:30000, pln_complete_monthly:44000
}

const VALID_PLAN_TYPES = Object.keys(PLAN_PRICES)

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

    if (!planType || !VALID_PLAN_TYPES.includes(planType)) {
      return NextResponse.json({ error: 'Plan tidak valid.' }, { status: 400 })
    }

    // Per-paket: wajib packageId
    if (planType === 'package' && !packageId) {
      return NextResponse.json({ error: 'packageId wajib untuk pembelian per-paket.' }, { status: 400 })
    }

    // PLN Tahap 2 & Complete: wajib pilih bidang
    if (['pln_tahap2_monthly', 'pln_complete_monthly'].includes(planType)) {
      if (!bidang || !VALID_BIDANG_SLUGS.includes(bidang)) {
        return NextResponse.json({ error: 'Bidang AKDING wajib dipilih untuk plan ini.' }, { status: 400 })
      }
    }

    const expectedAmount = PLAN_PRICES[planType]

    const service = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profileData } = await (service.from('users') as any)
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const profile = profileData as Pick<UserRow, 'full_name' | 'email'> | null
    const customerName = profile?.full_name ?? 'Pengguna'
    const customerEmail = user.email ?? profile?.email ?? ''

    const suffix = planType === 'package' && packageId
      ? `PKG-${packageId.slice(0, 8)}`
      : planType.toUpperCase()
    const orderId = `ORDER-${user.id.slice(0, 8)}-${suffix}-${Date.now()}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subData, error: subErr } = await (service.from('subscriptions') as any)
      .insert({
        user_id: user.id,
        midtrans_order_id: orderId,
        plan_type: planType,
        amount: expectedAmount,
        status: 'pending',
        ...(planType === 'package' && packageId ? { package_id: packageId } : {}),
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
      premium_monthly:      'Premium 1 Bulan',
      premium_quarterly:    'Premium 3 Bulan',
      package:              'Paket Soal',
      pln_gat_monthly:      'PLN Tahap 1 GAT — 1 Bulan',
      pln_tahap2_monthly:   `PLN Tahap 2 (${bidang ?? ''}) — 1 Bulan`,
      pln_complete_monthly: `PLN Complete (${bidang ?? ''}) — 1 Bulan`,
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
