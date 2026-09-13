import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const userId = req.nextUrl.searchParams.get('id')
  if (!userId) {
    return NextResponse.json({ error: 'id wajib diisi.' }, { status: 400 })
  }

  const service = createServiceClient()

  const [subsRes, attsRes] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service.from('subscriptions') as any)
      .select('id, plan_type, amount, status, paid_at, created_at, package_id, bidang')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50),
    // Ambil semua attempt user (urut waktu) untuk menghitung nomor percobaan per paket
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service.from('attempts') as any)
      .select('id, package_id, score, status, started_at, finished_at')
      .eq('user_id', userId)
      .order('started_at', { ascending: true })
      .limit(200),
  ])

  type AttemptRaw = {
    id: string
    package_id: string
    score: number | null
    status: string
    started_at: string
    finished_at: string | null
  }

  const counter = new Map<string, number>()
  const numbered = ((attsRes.data ?? []) as AttemptRaw[]).map((a) => {
    const n = (counter.get(a.package_id) ?? 0) + 1
    counter.set(a.package_id, n)
    return { ...a, attempt_number: n }
  })

  // Tampilkan terbaru dulu
  const attempts = numbered.reverse()

  return NextResponse.json({
    subscriptions: subsRes.data ?? [],
    attempts,
  })
}
