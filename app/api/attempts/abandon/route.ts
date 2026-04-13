import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import type { CookieOptions } from '@supabase/ssr'
import type { AttemptRow } from '@/lib/utils'

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

// POST /api/attempts/abandon
// Body: { attemptId: string }
// Menutup sesi ujian yang sedang berjalan (status → finished, score = 0)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { attemptId?: string }
    const { attemptId } = body

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId diperlukan.' }, { status: 400 })
    }

    // Verifikasi user
    const anonClient = createAnonClient()
    const { data: { user } } = await anonClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    // Ambil attempt
    const { data: attemptData, error: fetchErr } = await serviceClient
      .from('attempts')
      .select('id, user_id, status, started_at')
      .eq('id', attemptId)
      .single()

    if (fetchErr || !attemptData) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan.' }, { status: 404 })
    }

    const attempt = attemptData as Pick<AttemptRow, 'id' | 'user_id' | 'status' | 'started_at'>

    if (attempt.user_id !== user.id) {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 })
    }

    if (attempt.status !== 'ongoing') {
      // Sudah selesai, tidak perlu diapa-apakan
      return NextResponse.json({ data: { success: true } }, { status: 200 })
    }

    // Hitung durasi
    const startedAt = new Date(attempt.started_at).getTime()
    const durationSeconds = Math.floor((Date.now() - startedAt) / 1000)

    // Tutup sesi — tandai sebagai finished dengan skor 0 (sesi diabaikan)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateErr } = await (serviceClient.from('attempts') as any)
      .update({
        status: 'finished',
        score: 0,
        correct_count: 0,
        wrong_count: 0,
        empty_count: 0,
        duration_seconds: durationSeconds,
        finished_at: new Date().toISOString(),
      })
      .eq('id', attemptId)

    if (updateErr) {
      return NextResponse.json({ error: 'Gagal menutup sesi.' }, { status: 500 })
    }

    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
