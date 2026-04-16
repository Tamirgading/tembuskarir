import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyMidtransSignature, getTransactionStatus } from '@/lib/midtrans'
import { sendPaymentSuccessEmail } from '@/lib/resend'
import type { UserRow, SubscriptionRow } from '@/lib/utils'

// Durasi plan dalam hari (0 = permanen / tidak expire)
const PLAN_DURATION: Record<string, number> = {
  monthly:        30,   // legacy
  yearly:         365,  // legacy
  cpns_monthly:   30,
  cpns_quarterly: 90,
  package:        0,    // per-paket: permanen, tidak ada expires_at
}

interface MidtransWebhookPayload {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
  transaction_status: string
  fraud_status?: string
  payment_type?: string
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json() as MidtransWebhookPayload
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = payload

    console.log('[Webhook] Received:', order_id, transaction_status)

    // 1. Verifikasi signature Midtrans
    const isValid = await verifyMidtransSignature(order_id, status_code, gross_amount, signature_key)
    if (!isValid) {
      console.error('[Webhook] Invalid signature for order:', order_id)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // 2. Double-check status langsung ke Midtrans API (tidak percaya payload saja)
    let verifiedStatus = transaction_status
    try {
      const statusData = await getTransactionStatus(order_id)
      verifiedStatus = statusData.transaction_status
    } catch (err) {
      console.warn('[Webhook] Could not verify via Midtrans API, using payload status:', err)
    }

    // Service client — bypass RLS untuk semua operasi webhook
    const supabase = createServiceClient()

    // 3. Cari subscription record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subData } = await (supabase.from('subscriptions') as any)
      .select('id, user_id, plan_type, status, amount')
      .eq('midtrans_order_id', order_id)
      .single()

    const sub = subData as Pick<SubscriptionRow, 'id' | 'user_id' | 'plan_type' | 'status' | 'amount'> | null

    if (!sub) {
      console.error('[Webhook] Subscription not found for order:', order_id)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 4. Cek apakah sudah diproses (idempotent)
    if (sub.status === 'paid') {
      console.log('[Webhook] Already processed:', order_id)
      return NextResponse.json({ message: 'Already processed' }, { status: 200 })
    }

    // 5. Proses berdasarkan status
    const isPaid =
      verifiedStatus === 'capture' ||
      (verifiedStatus === 'settlement') ||
      (verifiedStatus === 'capture' && fraud_status === 'accept')

    // cancel/deny = user membatalkan atau kartu ditolak
    const isFailed = verifiedStatus === 'cancel' || verifiedStatus === 'deny'

    // expire = batas waktu pembayaran habis (berbeda dari failed)
    const isExpired = verifiedStatus === 'expire'

    if (isPaid) {
      const planType = sub.plan_type as string
      const durationDays = PLAN_DURATION[planType] ?? 30
      const now = new Date()
      const isPackagePurchase = planType === 'package'
      const expiresAt = isPackagePurchase
        ? null  // per-paket: tidak expire
        : new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)

      // Update subscription → paid
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('subscriptions') as any)
        .update({
          status: 'paid',
          paid_at: now.toISOString(),
          ...(expiresAt ? { expires_at: expiresAt.toISOString() } : {}),
        })
        .eq('id', sub.id)

      if (isPackagePurchase) {
        // Per-paket: unlock paket di unlocked_packages
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: subDetail } = await (supabase.from('subscriptions') as any)
          .select('package_id')
          .eq('id', sub.id)
          .single()

        if (subDetail?.package_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('unlocked_packages') as any)
            .upsert({
              user_id: sub.user_id,
              package_id: subDetail.package_id,
              midtrans_order_id: order_id,
              amount: sub.amount,
            }, { onConflict: 'user_id,package_id' })

          console.log('[Webhook] 🔓 Package unlocked:', subDetail.package_id, 'for user:', sub.user_id)
        }
      } else {
        // Langganan: aktifkan premium di tabel users
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('users') as any)
          .update({
            plan: 'premium',
            plan_expires_at: expiresAt!.toISOString(),
          })
          .eq('id', sub.user_id)

        // Kirim email konfirmasi
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('full_name, email')
            .eq('id', sub.user_id)
            .single()

          const user = userData as Pick<UserRow, 'full_name' | 'email'> | null
          if (user?.email) {
            await sendPaymentSuccessEmail(
              user.email,
              user.full_name ?? 'Sobat',
              planType,
              expiresAt!.toISOString()
            )
          }
        } catch (emailErr) {
          console.error('[Webhook] Email error:', emailErr)
        }

        console.log('[Webhook] ✅ Premium activated for user:', sub.user_id, 'until:', expiresAt)
      }
    } else if (isFailed) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('subscriptions') as any)
        .update({ status: 'failed' })
        .eq('id', sub.id)

      console.log('[Webhook] ❌ Payment failed for order:', order_id)
    } else if (isExpired) {
      // Batas waktu pembayaran habis (biasanya 24 jam dari order dibuat)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('subscriptions') as any)
        .update({ status: 'expired' })
        .eq('id', sub.id)

      console.log('[Webhook] ⌛ Payment expired for order:', order_id)
    } else {
      // pending — tidak perlu action, tunggu settlement dari Midtrans
      console.log('[Webhook] ⏳ Payment pending for order:', order_id)
    }

    return NextResponse.json({ message: 'OK' }, { status: 200 })
  } catch (err) {
    console.error('[Webhook] Unexpected error:', err)
    // Return 200 agar Midtrans tidak retry terus
    return NextResponse.json({ message: 'Error logged' }, { status: 200 })
  }
}
