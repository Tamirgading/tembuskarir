import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    packageId: string
    content: string
    opt_a: string; opt_b: string; opt_c: string; opt_d: string; opt_e: string
    point_a: number; point_b: number; point_c: number; point_d: number; point_e: number
    value_tag: string
    explanation?: string
  }

  const { packageId, content, opt_a, opt_b, opt_c, opt_d, opt_e,
    point_a, point_b, point_c, point_d, point_e, value_tag, explanation } = body

  if (!packageId || !content?.trim() || !opt_a || !opt_b || !opt_c || !opt_d || !opt_e || !value_tag) {
    return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
  }

  const points = [point_a, point_b, point_c, point_d, point_e]
  if (points.some((p) => typeof p !== 'number' || p < 1 || p > 5)) {
    return NextResponse.json({ error: 'Setiap poin harus bernilai 1–5.' }, { status: 400 })
  }

  const service = createServiceClient()

  // Auto order_index: ambil jumlah soal AKHLAK yang sudah ada + 1
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (service.from('questions_pln_akhlak') as any)
    .select('*', { count: 'exact', head: true })
    .eq('package_id', packageId)

  const orderIndex = (count ?? 0) + 1

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (service.from('questions_pln_akhlak') as any)
    .insert({
      package_id: packageId,
      content: content.trim(),
      opt_a: opt_a.trim(), opt_b: opt_b.trim(), opt_c: opt_c.trim(),
      opt_d: opt_d.trim(), opt_e: opt_e.trim(),
      point_a, point_b, point_c, point_d, point_e,
      value_tag,
      explanation: explanation?.trim() || null,
      order_index: orderIndex,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[pln-akhlak] insert error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan soal AKHLAK.' }, { status: 500 })
  }

  return NextResponse.json({ id: (data as { id: string }).id }, { status: 200 })
}
