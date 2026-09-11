import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

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
    const { id, isDummy, packageId, userId } = body as {
      id?: string
      isDummy?: boolean
      packageId?: string
      userId?: string
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID entri wajib diisi.' }, { status: 400 })
    }

    const service = createServiceClient()

    // Jika peserta asli (dari tabel attempts)
    if (isDummy === false || id.startsWith('real-')) {
      const targetUserId = userId || id.replace('real-', '')
      if (!packageId) {
        return NextResponse.json({ error: 'packageId wajib disertakan untuk menghapus peserta asli.' }, { status: 400 })
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: attemptErr } = await (service.from('attempts') as any)
        .delete()
        .eq('package_id', packageId)
        .eq('user_id', targetUserId)

      if (attemptErr) {
        console.error('[Admin/Leaderboard] Delete real attempts error:', attemptErr)
        return NextResponse.json({ error: 'Gagal menghapus data ujian peserta asli.' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Data pengerjaan peserta asli berhasil dihapus dari leaderboard.' })
    }

    // Jika peserta dummy (dari tabel leaderboard_entries)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('leaderboard_entries') as any)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Admin/Leaderboard] Delete error:', error)
      return NextResponse.json({ error: 'Gagal menghapus entri leaderboard.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Entri leaderboard dummy berhasil dihapus.' })
  } catch (err) {
    console.error('[Admin/Leaderboard] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
