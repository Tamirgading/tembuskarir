import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const limit = rateLimit(`track:${ip}`, { limit: 60, windowSeconds: 60 })
    if (!limit.success) {
      return NextResponse.json({ ok: false }, { status: 429 })
    }

    const body = await req.json() as { path?: string; visitorId?: string }
    const path = (body.path ?? '/').slice(0, 200)
    const visitorId = (body.visitorId ?? 'anon').slice(0, 100)

    // Jangan catat halaman admin / aset statis
    if (
      path.startsWith('/admin') ||
      path.startsWith('/_next') ||
      path.startsWith('/api') ||
      path.includes('.')
    ) {
      return NextResponse.json({ ok: true })
    }

    const service = createServiceClient()

    // Ambil user_id kalau sedang login (opsional, pakai session client)
    let userId: string | null = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch { /* public tanpa session */ }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (service.from('page_views') as any)
      .insert({ path, visitor_id: visitorId, user_id: userId })

    return NextResponse.json({ ok: true })
  } catch {
    // Tracking tidak boleh memblokir pengalaman user
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
