import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json() as { id?: string }
    if (!body.id || typeof body.id !== 'string') {
      return NextResponse.json({ error: 'ID voucher wajib diisi.' }, { status: 400 })
    }

    const service = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('vouchers') as any)
      .delete()
      .eq('id', body.id)

    if (error) {
      console.error('[Admin/Vouchers] Delete error:', error)
      return NextResponse.json({ error: 'Gagal menghapus voucher.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Voucher berhasil dihapus.' })
  } catch (err) {
    console.error('[Admin/Vouchers] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
