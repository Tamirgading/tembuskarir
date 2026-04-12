import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function DELETE(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { questionId?: string; packageId?: string }
    const { questionId, packageId } = body

    if (!questionId || !packageId) {
      return NextResponse.json({ error: 'questionId dan packageId wajib diisi.' }, { status: 400 })
    }

    const service = createServiceClient()

    // Pastikan soal memang milik paket ini (keamanan ekstra)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (service.from('questions') as any)
      .select('id')
      .eq('id', questionId)
      .eq('package_id', packageId)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Soal tidak ditemukan.' }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: deleteErr } = await (service.from('questions') as any)
      .delete()
      .eq('id', questionId)

    if (deleteErr) {
      console.error('[Questions Delete] DB error:', deleteErr)
      return NextResponse.json({ error: 'Gagal menghapus soal.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Questions Delete] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
