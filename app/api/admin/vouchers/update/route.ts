import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { parseVoucherInput } from '@/lib/voucher'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json() as Record<string, unknown>
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) {
      return NextResponse.json({ error: 'ID voucher wajib diisi.' }, { status: 400 })
    }

    const parsed = parseVoucherInput(body)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    const v = parsed.value

    const service = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('vouchers') as any)
      .update({
        code: v.code,
        name: v.name,
        discount_type: v.discount_type,
        discount_value: v.discount_value,
        duration_days: v.duration_days,
        max_uses: v.max_uses,
        expires_at: v.expires_at,
        is_active: v.is_active,
        applies_to: v.applies_to,
        plan_types: v.plan_types,
        package_ids: v.package_ids,
        note: v.note,
      })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: `Kode "${v.code}" sudah digunakan.` }, { status: 400 })
      }
      console.error('[Admin/Vouchers] Update error:', error)
      return NextResponse.json({ error: 'Gagal memperbarui voucher.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Voucher berhasil diperbarui.' })
  } catch (err) {
    console.error('[Admin/Vouchers] Unexpected error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
