import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type { CookieOptions } from '@supabase/ssr'
import type { AttemptRow, QuestionRow } from '@/lib/utils'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

// Gunakan Service Role untuk bypass RLS saat server-side scoring
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

export async function POST(request: NextRequest) {
  try {
    // Rate limit: maks 10 submit per menit per IP
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

    // 1. Verifikasi user login
    const anonClient = createAnonClient()
    const { data: { user } } = await anonClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    }

    // 2. Ambil attempt & validasi kepemilikan
    const serviceClient = createServiceClient()
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
      return NextResponse.json({ error: 'Ujian ini sudah selesai.' }, { status: 400 })
    }

    // 3. Fetch semua soal beserta correct_answer (AMAN — di server)
    const { data: questionsData, error: qErr } = await serviceClient
      .from('questions')
      .select('id, correct_answer')
      .eq('package_id', attempt.package_id)

    if (qErr || !questionsData) {
      return NextResponse.json({ error: 'Gagal mengambil data soal.' }, { status: 500 })
    }

    const questions = questionsData as Pick<QuestionRow, 'id' | 'correct_answer'>[]
    const totalQuestions = questions.length

    // 4. Hitung skor
    let correctCount = 0
    let wrongCount = 0
    let emptyCount = 0

    for (const q of questions) {
      const userAnswer = answers[q.id]
      if (!userAnswer) {
        emptyCount++
      } else if (userAnswer === q.correct_answer) {
        correctCount++
      } else {
        wrongCount++
      }
    }

    const score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0

    // 5. Hitung durasi
    const startedAt = new Date(attempt.started_at).getTime()
    const durationSeconds = Math.floor((Date.now() - startedAt) / 1000)

    // 6. Update attempt di database — type casting karena version mismatch @supabase/ssr vs supabase-js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateErr } = await (serviceClient.from('attempts') as any)
      .update({
        answers,
        score,
        correct_count: correctCount,
        wrong_count: wrongCount,
        empty_count: emptyCount,
        duration_seconds: durationSeconds,
        status: 'finished',
        finished_at: new Date().toISOString(),
      })
      .eq('id', attemptId)

    if (updateErr) {
      return NextResponse.json({ error: 'Gagal menyimpan hasil ujian.' }, { status: 500 })
    }

    return NextResponse.json({ data: { attemptId, score } }, { status: 200 })

  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
