import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type { CookieOptions } from '@supabase/ssr'
import type { AttemptRow } from '@/lib/utils'
import { createServiceClient } from '@/lib/supabase/server'
import { computeScore, transformPlnAkhlakForScoring, transformPlnLaForScoring } from '@/lib/exam-scoring'
import type { QuestionPointRow } from '@/lib/exam-scoring'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

// Anon client tetap inline karena perlu cookies() sinkron (SSR compat)
function createAnonClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (cookieStore as unknown as { getAll: () => { name: string; value: string }[] }).getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              (cookieStore as unknown as { set: (n: string, v: string, o: CookieOptions) => void }).set(name, value, options)
            )
          } catch { /* ignore */ }
        },
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request)
    const limit = rateLimit(`submit:${ip}`, { limit: 10, windowSeconds: 60 })
    if (!limit.success) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan.' }, { status: 429 })
    }

    const body = await request.json() as { attemptId?: string; answers?: Record<string, string> }
    const { attemptId, answers } = body

    if (!attemptId || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 })
    }

    // 1. Verifikasi user
    const anonClient = createAnonClient()
    const { data: { user } } = await anonClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    // 2. Ambil attempt
    const { data: attemptData, error: attemptErr } = await serviceClient
      .from('attempts')
      .select('id, user_id, package_id, status, started_at')
      .eq('id', attemptId)
      .single()

    if (attemptErr || !attemptData) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan.' }, { status: 404 })
    }

    const attempt = attemptData as Pick<AttemptRow, 'id' | 'user_id' | 'package_id' | 'status' | 'started_at'>

    if (attempt.user_id !== user.id) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 })
    }

    if (attempt.status === 'finished') {
      return NextResponse.json({ error: 'Already processed' }, { status: 200 })
    }

    // 3. Ambil kategori paket
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pkgData } = await (serviceClient.from('packages') as any)
      .select('category')
      .eq('id', attempt.package_id)
      .single()

    const pkgCategory = (pkgData as { category: string } | null)?.category ?? 'OTHER'

    // 4. Ambil soal dari tabel yang sesuai berdasarkan kategori paket
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: mcqData, error: qErr } = await (serviceClient.from('questions') as any)
      .select('id, correct_answer, category, options')
      .eq('package_id', attempt.package_id)

    if (qErr || !mcqData) {
      return NextResponse.json({ error: 'Gagal mengambil data soal.' }, { status: 500 })
    }

    type McqQuestion = { id: string; correct_answer: string; category?: string | null; options?: { key: string; text: string; point?: number }[] | null }
    let allQuestions: McqQuestion[] = mcqData as McqQuestion[]

    // Untuk paket PLN: gabungkan soal AKHLAK & LA dari tabel terpisah
    if (pkgCategory === 'PLN') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: akhlakData } = await (serviceClient.from('questions_pln_akhlak') as any)
        .select('id, opt_a, opt_b, opt_c, opt_d, opt_e, point_a, point_b, point_c, point_d, point_e')
        .eq('package_id', attempt.package_id)

      if (akhlakData && (akhlakData as QuestionPointRow[]).length > 0) {
        allQuestions = [...allQuestions, ...transformPlnAkhlakForScoring(akhlakData as QuestionPointRow[])]
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: laData } = await (serviceClient.from('questions_pln_la') as any)
        .select('id, opt_a, opt_b, opt_c, opt_d, opt_e, point_a, point_b, point_c, point_d, point_e, is_reverse_scored')
        .eq('package_id', attempt.package_id)

      if (laData && (laData as (QuestionPointRow & { is_reverse_scored?: boolean })[]).length > 0) {
        allQuestions = [...allQuestions, ...transformPlnLaForScoring(laData as (QuestionPointRow & { is_reverse_scored?: boolean })[])]
      }
    }

    // 5. Hitung skor via shared utility
    const { score, correctCount, wrongCount, emptyCount, scoreDetails } = computeScore(
      allQuestions,
      answers,
      pkgCategory
    )

    // 6. Hitung durasi
    const durationSeconds = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000)

    // 7. Update attempt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const basePayload: Record<string, unknown> = {
      answers,
      score,
      correct_count: correctCount,
      wrong_count: wrongCount,
      empty_count: emptyCount,
      duration_seconds: durationSeconds,
      status: 'finished',
      finished_at: new Date().toISOString(),
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateErr } = await (serviceClient.from('attempts') as any)
        .update({ ...basePayload, score_details: scoreDetails })
        .eq('id', attemptId)

      if (updateErr) {
        // Fallback tanpa score_details jika kolom belum ada di DB
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: fallbackErr } = await (serviceClient.from('attempts') as any)
          .update(basePayload)
          .eq('id', attemptId)

        if (fallbackErr) {
          return NextResponse.json({ error: 'Gagal menyimpan hasil ujian.' }, { status: 500 })
        }
      }
    } catch {
      return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
    }

    return NextResponse.json({ data: { attemptId, score, scoreDetails } }, { status: 200 })

  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
