import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type { CookieOptions } from '@supabase/ssr'
import type { AttemptRow } from '@/lib/utils'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

function createServiceClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
          } catch { /* ignore in API route */ }
        },
      },
    }
  )
}

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

// ── SKD CPNS Scoring Constants ───────────────────────────────────────────────
// TWK & TIU: benar +5, salah 0, kosong 0 (TIDAK ADA penalti)
// TKP: nilai per opsi 1–5 (tidak ada benar/salah), kosong = 0
const SKD_SCORING: Record<string, { correct: number; wrong: number }> = {
  TWK: { correct: 5, wrong: 0 },
  TIU: { correct: 5, wrong: 0 },
}

// Passing grade SKD 2024 (resmi BKN)
const SKD_PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166, total: 311 }

interface CategoryStats {
  correct: number   // TWK/TIU: jawaban benar | TKP: jumlah soal dijawab
  wrong: number     // TWK/TIU: jawaban salah | TKP: selalu 0
  empty: number     // semua kategori: tidak dijawab
  rawScore: number  // total poin kategori ini
}

interface QuestionOption {
  key: string
  text: string
  point?: number // TKP: nilai 1–5
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

    // 3. Ambil package category
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pkgData } = await (serviceClient.from('packages') as any)
      .select('category')
      .eq('id', attempt.package_id)
      .single()

    const isCpns = (pkgData as { category: string } | null)?.category === 'CPNS'

    // 4. Ambil soal — CPNS butuh options untuk TKP point lookup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: questionsData, error: qErr } = await (serviceClient.from('questions') as any)
      .select(isCpns ? 'id, correct_answer, category, options' : 'id, correct_answer')
      .eq('package_id', attempt.package_id)

    if (qErr || !questionsData) {
      return NextResponse.json({ error: 'Gagal mengambil data soal.' }, { status: 500 })
    }

    const questions = questionsData as {
      id: string
      correct_answer: string
      category?: string
      options?: QuestionOption[]
    }[]

    const totalQuestions = questions.length

    // 5. Hitung skor
    let correctCount = 0
    let wrongCount = 0
    let emptyCount = 0
    let score: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scoreDetails: any = {}

    if (isCpns) {
      // ── SKD CPNS Scoring ──────────────────────────────────────────────────
      const catStats: Record<string, CategoryStats> = {}

      for (const q of questions) {
        const cat = (q.category ?? 'TWK').toUpperCase()

        if (!catStats[cat]) {
          catStats[cat] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }
        }

        const userAnswer = answers[q.id]

        if (!userAnswer) {
          // Tidak dijawab → 0 poin untuk semua kategori
          emptyCount++
          catStats[cat].empty++
        } else if (cat === 'TKP') {
          // TKP: ambil point dari opsi yang dipilih (1–5)
          const opts = (q.options ?? []) as QuestionOption[]
          const selectedOpt = opts.find((o) => o.key === userAnswer)
          const point = selectedOpt?.point ?? 0
          catStats[cat].correct++ // "dijawab" dihitung di correct
          catStats[cat].rawScore += point
          correctCount++ // dihitung sebagai "soal dijawab"
        } else {
          // TWK / TIU: benar +5, salah +0 (tidak ada penalti)
          const scoring = SKD_SCORING[cat] ?? { correct: 5, wrong: 0 }
          if (userAnswer === q.correct_answer) {
            correctCount++
            catStats[cat].correct++
            catStats[cat].rawScore += scoring.correct // +5
          } else {
            wrongCount++
            catStats[cat].wrong++
            catStats[cat].rawScore += scoring.wrong   // +0
          }
        }
      }

      // Total skor raw SKD (0–550)
      const totalRaw = Object.values(catStats).reduce((sum, c) => sum + c.rawScore, 0)

      // Cek passing grade per kategori
      const twkScore = catStats.TWK?.rawScore ?? 0
      const tiuScore = catStats.TIU?.rawScore ?? 0
      const tkpScore = catStats.TKP?.rawScore ?? 0
      const isLulus =
        twkScore >= SKD_PASSING_GRADE.TWK &&
        tiuScore >= SKD_PASSING_GRADE.TIU &&
        tkpScore >= SKD_PASSING_GRADE.TKP &&
        totalRaw >= SKD_PASSING_GRADE.total

      score = Math.max(0, Math.round(totalRaw))

      scoreDetails = {
        type: 'SKD',
        categories: catStats,
        totalRaw: Math.round(totalRaw * 100) / 100,
        passingGrade: SKD_PASSING_GRADE,
        lulus: isLulus,
      }
    } else {
      // ── Simple Scoring (non-CPNS) ─────────────────────────────────────────
      for (const q of questions) {
        const userAnswer = answers[q.id]
        if (!userAnswer) emptyCount++
        else if (userAnswer === q.correct_answer) correctCount++
        else wrongCount++
      }
      score = totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0
      scoreDetails = { type: 'simple' }
    }

    // 6. Hitung durasi
    const startedAt = new Date(attempt.started_at).getTime()
    const durationSeconds = Math.floor((Date.now() - startedAt) / 1000)

    // 7. Update attempt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePayload: any = {
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
        .update({ ...updatePayload, score_details: scoreDetails })
        .eq('id', attemptId)

      if (updateErr) {
        // Kolom score_details mungkin belum ada — fallback tanpa score_details
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: fallbackErr } = await (serviceClient.from('attempts') as any)
          .update(updatePayload)
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
