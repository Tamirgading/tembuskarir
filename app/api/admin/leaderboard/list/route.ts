import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { buildLeaderboard, type LeaderboardAttempt } from '@/lib/leaderboard'

export const dynamic = 'force-dynamic'

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase())
  return adminEmails.includes(user.email.toLowerCase())
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const packageId = req.nextUrl.searchParams.get('packageId')
    if (!packageId) {
      return NextResponse.json({ error: 'packageId wajib diisi.' }, { status: 400 })
    }

    const service = createServiceClient()

    // 1. Fetch package category (ANTAM uses 'first' attempt, others use 'best' attempt)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pkgData } = await (service.from('packages') as any)
      .select('category')
      .eq('id', packageId)
      .maybeSingle()

    const isAntam = pkgData?.category === 'ANTAM'

    // 2. Fetch dummy entries from leaderboard_entries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dummyData, error: dummyErr } = await (service.from('leaderboard_entries') as any)
      .select('id, display_name, score, duration_seconds, is_active, created_at')
      .eq('package_id', packageId)
      .order('created_at', { ascending: true })

    if (dummyErr) {
      console.error('[Admin/Leaderboard] Dummy fetch error:', dummyErr)
    }

    // 3. Fetch real finished attempts from attempts table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attemptsData, error: attErr } = await (service.from('attempts') as any)
      .select('id, user_id, score, started_at, duration_seconds, finished_at')
      .eq('package_id', packageId)
      .eq('status', 'finished')
      .not('score', 'is', null)

    if (attErr) {
      console.error('[Admin/Leaderboard] Attempts fetch error:', attErr)
    }

    const rawAttempts = (attemptsData ?? []) as LeaderboardAttempt[]
    const userIds = Array.from(new Set(rawAttempts.map((a) => a.user_id)))

    // 4. Fetch user details for real users
    let userMap: Record<string, { full_name: string | null; email: string }> = {}
    if (userIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: usersData } = await (service.from('users') as any)
        .select('id, full_name, email')
        .in('id', userIds)

      if (usersData) {
        userMap = Object.fromEntries(
          (usersData as { id: string; full_name: string | null; email: string }[]).map((u) => [u.id, u])
        )
      }
    }

    // 5. Aggregate real user attempts
    const aggregated = buildLeaderboard(rawAttempts, isAntam ? 'first' : 'best')
    const realEntries = aggregated.map((e) => {
      const u = userMap[e.user_id]
      return {
        id: `real-${e.user_id}`,
        display_name: u?.full_name || u?.email || 'Peserta Tanpa Nama',
        user_email: u?.email || null,
        score: e.score,
        duration_seconds: e.duration_seconds ?? 0,
        attempt_count: e.attempt_count,
        is_dummy: false,
        created_at: rawAttempts.find((a) => a.user_id === e.user_id)?.started_at ?? new Date().toISOString(),
      }
    })

    // 6. Format dummy entries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dummyEntries = ((dummyData ?? []) as any[]).map((d) => ({
      id: d.id,
      display_name: d.display_name,
      user_email: null,
      score: d.score,
      duration_seconds: d.duration_seconds ?? 0,
      attempt_count: 1,
      is_dummy: true,
      created_at: d.created_at,
    }))

    // 7. Merge and sort: score DESC, duration ASC
    const combined = [...realEntries, ...dummyEntries].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.duration_seconds - b.duration_seconds
    })

    return NextResponse.json({ data: combined })
  } catch (err) {
    console.error('[Admin/Leaderboard] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
