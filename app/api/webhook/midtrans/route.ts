import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyMidtransSignature, getTransactionStatus } from '@/lib/midtrans'
import { sendPaymentSuccessEmail, sendPackagePaymentEmail, sendAdminNotificationEmail } from '@/lib/resend'
import type { UserRow, SubscriptionRow } from '@/lib/utils'
import { BIDANG_BY_SLUG } from '@/lib/bidang-config'

// Durasi plan dalam hari (0 = permanen / tidak expire)
const PLAN_DURATION: Record<string, number> = {
  monthly:              30,   // legacy
  yearly:               365,  // legacy
  premium_monthly:      30,
  premium_quarterly:    90,
  package:              0,    // per-paket: permanen
  astra_monthly:        30,
  bumn_t1_monthly:      30,
  bumn_t2_monthly:      30,
  antam_monthly:        30,
  pln_gat_monthly:      30,
  pln_tahap2_monthly:   30,
  pln_complete_monthly: 30,
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

    // 3. Cari subscription record — sertakan bidang untuk PLN plans
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: subData } = await (supabase.from('subscriptions') as any)
      .select('id, user_id, plan_type, status, amount, bidang')
      .eq('midtrans_order_id', order_id)
      .single()

    const sub = subData as (Pick<SubscriptionRow, 'id' | 'user_id' | 'plan_type' | 'status' | 'amount'> & { bidang?: string | null }) | null

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

      // Ambil data user untuk semua jenis pembayaran
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', sub.user_id)
        .single()
      const user = userData as Pick<UserRow, 'full_name' | 'email'> | null

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

          // Ambil nama paket untuk email
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: pkgData } = await (supabase.from('packages') as any)
            .select('name')
            .eq('id', subDetail.package_id)
            .single()
          const packageName = (pkgData as { name: string } | null)?.name ?? 'Paket Soal'

          // Email ke user: konfirmasi pembelian paket
          try {
            if (user?.email) {
              await sendPackagePaymentEmail(
                user.email,
                user.full_name ?? 'Sobat',
                packageName,
                sub.amount,
                subDetail.package_id,
              )
            }
          } catch (emailErr) {
            console.error('[Webhook] Package email error:', emailErr)
          }

          // Email ke admin
          try {
            await sendAdminNotificationEmail({
              userName: user?.full_name ?? 'Unknown',
              userEmail: user?.email ?? '-',
              purchaseType: 'package',
              itemName: packageName,
              amount: sub.amount,
              orderId: order_id,
            })
          } catch (emailErr) {
            console.error('[Webhook] Admin notify error:', emailErr)
          }
        }
      } else {
        // Langganan (All Access / per-tahap / per-perusahaan / PLN)
        const isPLNPlan      = planType.startsWith('pln_')
        const isAllAccess    = planType === 'premium_monthly' || planType === 'premium_quarterly'

        if (isPLNPlan) {
          // ── PLN plans: JANGAN update users.plan ─────────────────────────────
          // Akses PLN dikontrol lewat subscriptions.bidang + subscriptions.expires_at
          // yang sudah di-update di atas (status=paid, expires_at).
          const bidangName = sub.bidang ? (BIDANG_BY_SLUG[sub.bidang]?.name ?? sub.bidang) : null
          console.log('[Webhook] ✅ PLN plan activated:', planType,
            bidangName ? `| bidang: ${bidangName}` : '',
            '| user:', sub.user_id, '| expires:', expiresAt)
        } else if (isAllAccess) {
          // ── Premium All Access: update users.plan ───────────────────────────
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('users') as any)
            .update({
              plan: 'premium',
              plan_expires_at: expiresAt!.toISOString(),
            })
            .eq('id', sub.user_id)

          console.log('[Webhook] ✅ Premium activated for user:', sub.user_id, 'until:', expiresAt)
        } else {
          // ── Plan per-tahap/perusahaan (astra/bumn/antam): akses via subscriptions
          console.log('[Webhook] ✅ Company plan activated:', planType, '| user:', sub.user_id, '| expires:', expiresAt)
        }

        // ── Label untuk email ────────────────────────────────────────────────
        const bidangName = sub.bidang ? (BIDANG_BY_SLUG[sub.bidang]?.name ?? sub.bidang) : null
        const planLabelMap: Record<string, string> = {
          monthly:              'Premium Bulanan',
          yearly:               'Premium Tahunan',
          premium_monthly:      'Premium All Access — Bulanan',
          premium_quarterly:    'Premium All Access — 3 Bulan',
          astra_monthly:        'ASTRA Bulanan',
          bumn_t1_monthly:      'BUMN Tahap 1 Bulanan',
          bumn_t2_monthly:      'BUMN Tahap 2 Bulanan',
          antam_monthly:        'ANTAM Bulanan',
          pln_gat_monthly:      'PLN Tahap 1 — GAT',
          pln_tahap2_monthly:   'PLN Tahap 2' + (bidangName ? ` — ${bidangName}` : ''),
          pln_complete_monthly: 'PLN Complete' + (bidangName ? ` — ${bidangName}` : ''),
        }
        const planLabel = planLabelMap[planType] ?? planType

        // Email ke user
        try {
          if (user?.email) {
            await sendPaymentSuccessEmail(
              user.email,
              user.full_name ?? 'Sobat',
              planLabel,
              expiresAt!.toISOString(),
              sub.amount,
            )
          }
        } catch (emailErr) {
          console.error('[Webhook] Subscription email error:', emailErr)
        }

        // Email ke admin
        try {
          await sendAdminNotificationEmail({
            userName: user?.full_name ?? 'Unknown',
            userEmail: user?.email ?? '-',
            purchaseType: 'subscription',
            itemName: planLabel,
            amount: sub.amount,
            orderId: order_id,
          })
        } catch (emailErr) {
          console.error('[Webhook] Admin notify error:', emailErr)
        }
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
