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
import { computeScore, isAttemptExpired } from '@/lib/exam-scoring'
import type { PackageRow, AttemptRow, SubscriptionRow } from '@/lib/utils'

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

          // Fetch soal untuk hitung skor (selalu ambil category + options)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: questionsData } = await (supabase.from('questions') as any)
            .select('id, correct_answer, category, options')
            .eq('package_id', attempt.package_id)

          const questions = (questionsData ?? []) as {
            id: string
            correct_answer: string
            category?: string
            options?: { key: string; text: string; point?: number }[]
          }[]

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

  console.log('[Cron/Cleanup] Done:', JSON.stringify(results))
  return NextResponse.json({ ok: true, results })
}
