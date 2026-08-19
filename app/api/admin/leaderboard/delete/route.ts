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
    const { id } = body as { id?: string }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID entri wajib diisi.' }, { status: 400 })
    }

    const service = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('leaderboard_entries') as any)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Admin/Leaderboard] Delete error:', error)
      return NextResponse.json({ error: 'Gagal menghapus entri leaderboard.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Entri leaderboard berhasil dihapus.' })
  } catch (err) {
    console.error('[Admin/Leaderboard] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
