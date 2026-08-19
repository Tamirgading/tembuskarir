import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase())
  return adminEmails.includes(user.email.toLowerCase())
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { packageId, displayName, score, durationSeconds } = body as {
      packageId?: string
      displayName?: string
      score?: number
      durationSeconds?: number
    }

    if (!packageId || typeof packageId !== 'string') {
      return NextResponse.json({ error: 'Paket wajib dipilih.' }, { status: 400 })
    }
    const name = (displayName ?? '').toString().trim()
    if (!name) {
      return NextResponse.json({ error: 'Nama peserta wajib diisi.' }, { status: 400 })
    }
    const sc = Number(score)
    if (!Number.isFinite(sc) || sc < 0 || sc > 100) {
      return NextResponse.json({ error: 'Nilai harus antara 0–100.' }, { status: 400 })
    }
    const dur = Math.max(0, Number(durationSeconds) || 0)

    const service = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('leaderboard_entries') as any).insert({
      package_id: packageId,
      display_name: name,
      score: Math.round(sc),
      duration_seconds: Math.round(dur),
      is_active: true,
    })

    if (error) {
      console.error('[Admin/Leaderboard] Insert error:', error)
      return NextResponse.json({ error: 'Gagal menambah entri leaderboard.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Entri leaderboard berhasil ditambahkan.' })
  } catch (err) {
    console.error('[Admin/Leaderboard] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
