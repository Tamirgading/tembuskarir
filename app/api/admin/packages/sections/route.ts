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
    id?: string
    nama?: string
    timer_mode?: 'section' | 'per_question'
    timer_seconds?: number
    question_count?: number | null
    passing_grade?: number | null
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id seksi wajib diisi.' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (body.nama !== undefined) update.nama = body.nama
  if (body.timer_mode !== undefined) update.timer_mode = body.timer_mode
  if (body.timer_seconds !== undefined) update.timer_seconds = body.timer_seconds
  if (body.question_count !== undefined) update.question_count = body.question_count || null
  if (body.passing_grade !== undefined) update.passing_grade = body.passing_grade || null

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (service.from('package_sections') as any)
    .update(update)
    .eq('id', body.id)

  if (error) {
    console.error('[Sections Update] error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan seksi.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
