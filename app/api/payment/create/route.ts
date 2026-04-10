import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSnapTransaction } from '@/lib/midtrans'
import { rateLimit, getClientIp } from '@/lib/rateLimit'
import type { UserRow, SubscriptionRow } from '@/lib/utils'

const PLAN_PRICES = {
  monthly: 49000,
  yearly: 399000,
} as const

export async function POST(req: NextRequest) {
  try {
    // Rate limit: maks 5 request per menit per IP
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

    const body = await req.json() as { planType?: string; amount?: number }
    const planType = body.planType

    if (planType !== 'monthly' && planType !== 'yearly') {
      return NextResponse.json({ error: 'Plan tidak valid.' }, { status: 400 })
    }

    // Validasi harga di server — jangan percaya harga dari client
    const expectedAmount = PLAN_PRICES[planType]

    // Ambil profil user untuk nama
    const { data: profileData } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const profile = profileData as Pick<UserRow, 'full_name' | 'email'> | null
    const customerName = profile?.full_name ?? 'Pengguna'
    const customerEmail = user.email ?? profile?.email ?? ''

    // Buat order ID unik
    const orderId = `ORDER-${user.id.slice(0, 8)}-${planType.toUpperCase()}-${Date.now()}`

    // Simpan subscription record ke DB (status: pending)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subData, error: subErr } = await (supabase.from('subscriptions') as any)
      .insert({
        user_id: user.id,
        midtrans_order_id: orderId,
        plan_type: planType,
        amount: expectedAmount,
        status: 'pending',
      })
      .select('id')
      .single()

    if (subErr) {
      console.error('[Payment Create] DB error:', subErr)
      return NextResponse.json({ error: 'Gagal membuat transaksi.' }, { status: 500 })
    }

    const sub = subData as Pick<SubscriptionRow, 'id'>
    console.log('[Payment Create] Subscription created:', sub.id)

    // Buat Snap token dari Midtrans
    const snapData = await createSnapTransaction({
      orderId,
      amount: expectedAmount,
      customerName,
      customerEmail,
      planType,
    })

    return NextResponse.json({ snapToken: snapData.token }, { status: 200 })
  } catch (err) {
    console.error('[Payment Create] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
