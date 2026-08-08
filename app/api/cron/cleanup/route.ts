/**
 * GET /api/cron/cleanup
 *
 * Unified cron job — dijalankan setiap jam via Vercel Cron.
 * Tugas:
 *   1. Auto-finish ongoing attempts yang sudah melewati batas waktu
 *   2. Expire subscriptions pending yang sudah terlalu lama (> 2 hari)
 *
 * Diamankan dengan CRON_SECRET di Authorization header.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { computeScore, isAttemptExpired, transformPlnAkhlakForScoring, transformPlnLaForScoring } from '@/lib/exam-scoring'
import type { QuestionPointRow } from '@/lib/exam-scoring'
import type { PackageRow, AttemptRow, SubscriptionRow } from '@/lib/utils'
import { notify, hasRecentNotif } from '@/lib/notifications'

const BATCH_SIZE = 50 // proses maksimal 50 attempt per run
const PENDING_EXPIRE_HOURS = 48 // pending > 48 jam → expired

export async function GET(request: NextRequest) {
  // ── Auth: verifikasi CRON_SECRET ──────────────────────────────────────────
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const results = {
    attempts: { processed: 0, errors: 0, total: 0 },
    subscriptions: { expired: 0, errors: 0 },
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TASK 1: Auto-finish expired ongoing attempts
  // ════════════════════════════════════════════════════════════════════════════
  try {
    // Ambil semua ongoing attempts (ada answers tersimpan)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: ongoingData } = await (supabase.from('attempts') as any)
      .select('id, package_id, started_at, answers')
      .eq('status', 'ongoing')
      .limit(BATCH_SIZE)

    const ongoingAttempts = (ongoingData ?? []) as Pick<
      AttemptRow,
      'id' | 'package_id' | 'started_at' | 'answers'
    >[]

    if (ongoingAttempts.length > 0) {
      // Ambil data package yang unik (perlu duration_minutes dan category)
      const packageIds = Array.from(new Set(ongoingAttempts.map((a) => a.package_id)))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: packagesData } = await (supabase.from('packages') as any)
        .select('id, duration_minutes, category')
        .in('id', packageIds)

      const packageMap = new Map(
        ((packagesData ?? []) as Pick<PackageRow, 'id' | 'duration_minutes' | 'category'>[]).map(
          (p) => [p.id, p]
        )
      )

      // Filter: hanya yang sudah expired
      const expired = ongoingAttempts.filter((a) => {
        const pkg = packageMap.get(a.package_id)
        if (!pkg) return true // package tidak ada → expire saja
        return isAttemptExpired(a.started_at, pkg.duration_minutes)
      })

      results.attempts.total = expired.length

      for (const attempt of expired) {
        try {
          const pkg = packageMap.get(attempt.package_id)
          const pkgCategory = pkg?.category ?? 'OTHER'

          // Fetch soal MCQ dari tabel questions
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: mcqData } = await (supabase.from('questions') as any)
            .select('id, correct_answer, category, options')
            .eq('package_id', attempt.package_id)

          type McqQuestion = { id: string; correct_answer: string; category?: string | null; options?: { key: string; text: string; point?: number }[] | null }
          let questions: McqQuestion[] = (mcqData ?? []) as McqQuestion[]

          // Untuk PLN: gabungkan soal AKHLAK & LA dari tabel terpisah
          if (pkgCategory === 'PLN') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: akhlakData } = await (supabase.from('questions_pln_akhlak') as any)
              .select('id, opt_a, opt_b, opt_c, opt_d, opt_e, point_a, point_b, point_c, point_d, point_e')
              .eq('package_id', attempt.package_id)

            if (akhlakData && (akhlakData as QuestionPointRow[]).length > 0) {
              questions = [...questions, ...transformPlnAkhlakForScoring(akhlakData as QuestionPointRow[])]
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: laData } = await (supabase.from('questions_pln_la') as any)
              .select('id, opt_a, opt_b, opt_c, opt_d, opt_e, point_a, point_b, point_c, point_d, point_e, is_reverse_scored')
              .eq('package_id', attempt.package_id)

            if (laData && (laData as (QuestionPointRow & { is_reverse_scored?: boolean })[]).length > 0) {
              questions = [...questions, ...transformPlnLaForScoring(laData as (QuestionPointRow & { is_reverse_scored?: boolean })[])]
            }
          }

          const answers = (attempt.answers as Record<string, string>) ?? {}
          const { score, correctCount, wrongCount, emptyCount, scoreDetails } =
            computeScore(questions, answers, pkgCategory)

          const durationSeconds = Math.floor(
            (Date.now() - new Date(attempt.started_at).getTime()) / 1000
          )

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateErr } = await (supabase.from('attempts') as any)
            .update({
              status: 'finished',
              score,
              correct_count: correctCount,
              wrong_count: wrongCount,
              empty_count: emptyCount,
              duration_seconds: durationSeconds,
              finished_at: new Date().toISOString(),
              score_details: scoreDetails,
            })
            .eq('id', attempt.id)

          if (updateErr) {
            // Fallback tanpa score_details jika kolom belum ada
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from('attempts') as any)
              .update({
                status: 'finished',
                score,
                correct_count: correctCount,
                wrong_count: wrongCount,
                empty_count: emptyCount,
                duration_seconds: durationSeconds,
                finished_at: new Date().toISOString(),
              })
              .eq('id', attempt.id)
          }

          results.attempts.processed++
          console.log(`[Cron/Cleanup] ✅ Attempt ${attempt.id} auto-finished, score: ${score}`)
        } catch (err) {
          results.attempts.errors++
          console.error(`[Cron/Cleanup] ❌ Error finishing attempt ${attempt.id}:`, err)
        }
      }
    }
  } catch (err) {
    console.error('[Cron/Cleanup] Error in attempts task:', err)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TASK 2: Expire pending subscriptions yang terlalu lama
  // ════════════════════════════════════════════════════════════════════════════
  try {
    const cutoffTime = new Date(
      Date.now() - PENDING_EXPIRE_HOURS * 60 * 60 * 1000
    ).toISOString()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: stalePendingData } = await (supabase.from('subscriptions') as any)
      .select('id, midtrans_order_id, created_at')
      .eq('status', 'pending')
      .lt('created_at', cutoffTime)

    const stalePending = (stalePendingData ?? []) as Pick<
      SubscriptionRow,
      'id' | 'midtrans_order_id' | 'created_at'
    >[]

    for (const sub of stalePending) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('subscriptions') as any)
          .update({ status: 'expired' })
          .eq('id', sub.id)

        if (!error) {
          results.subscriptions.expired++
          console.log(
            `[Cron/Cleanup] 💸 Subscription ${sub.midtrans_order_id} expired (created: ${sub.created_at})`
          )
        }
      } catch (err) {
        results.subscriptions.errors++
        console.error(`[Cron/Cleanup] ❌ Error expiring subscription ${sub.id}:`, err)
      }
    }
  } catch (err) {
    console.error('[Cron/Cleanup] Error in subscriptions task:', err)
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TASK 3: Notifikasi premium akan expired (H-7 dan H-3)
  // ════════════════════════════════════════════════════════════════════════════
  const notifResults = { h7: 0, h3: 0, errors: 0 }
  try {
    const now = new Date()

    // Jendela H-7: expires in 6–8 hari dari sekarang
    const h7lo = new Date(now.getTime() + 6 * 86_400_000).toISOString()
    const h7hi = new Date(now.getTime() + 8 * 86_400_000).toISOString()
    // Jendela H-3: expires in 2–4 hari dari sekarang
    const h3lo = new Date(now.getTime() + 2 * 86_400_000).toISOString()
    const h3hi = new Date(now.getTime() + 4 * 86_400_000).toISOString()

    for (const [lo, hi, days] of [[h7lo, h7hi, 7], [h3lo, h3hi, 3]] as [string, string, number][]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: users } = await (supabase.from('users') as any)
        .select('id, plan_expires_at')
        .eq('plan', 'premium')
        .gte('plan_expires_at', lo)
        .lte('plan_expires_at', hi)

      for (const u of (users ?? []) as { id: string; plan_expires_at: string }[]) {
        try {
          const alreadySent = await hasRecentNotif(u.id, 'premium_expiring', 48)
          if (!alreadySent) {
            await notify(
              u.id,
              'premium_expiring',
              `Premium berakhir dalam ${days} hari`,
              'Segera perpanjang agar tetap bisa akses semua paket latihan.',
              '/harga'
            )
            if (days === 7) { notifResults.h7++ } else { notifResults.h3++ }
          }
        } catch {
          notifResults.errors++
        }
      }
    }
  } catch (err) {
    console.error('[Cron/Cleanup] Error in premium-expiring notification task:', err)
  }

  console.log('[Cron/Cleanup] Done:', JSON.stringify({ ...results, notifResults }))
  return NextResponse.json({ ok: true, results, notifResults })
}
