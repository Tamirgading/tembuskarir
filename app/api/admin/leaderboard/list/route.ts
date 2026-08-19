import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (service.from('leaderboard_entries') as any)
      .select('*')
      .eq('package_id', packageId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[Admin/Leaderboard] List error:', error)
      return NextResponse.json({ error: 'Gagal mengambil entri leaderboard.' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('[Admin/Leaderboard] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
