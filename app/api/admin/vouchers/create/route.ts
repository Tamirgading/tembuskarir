import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Reuse isAdmin helper
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
    const { code, duration_days, max_uses, expires_at, note } = body as {
      code: string
      duration_days: number
      max_uses: number
      expires_at: string | null
      note: string | null
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Kode voucher wajib diisi.' }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()

    const service = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('vouchers') as any)
      .insert({
        code: normalizedCode,
        discount_type: 'free_days',
        duration_days: duration_days ?? 30,
        max_uses: max_uses ?? 1,
        expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        note: note ?? null,
      })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: `Kode "${normalizedCode}" sudah digunakan.` }, { status: 400 })
      }
      console.error('[Admin/Vouchers] Insert error:', error)
      return NextResponse.json({ error: 'Gagal menyimpan voucher.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Voucher berhasil dibuat.' })
  } catch (err) {
    console.error('[Admin/Vouchers] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
