import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET /api/saved-questions
// Returns { saved_ids: string[] } — daftar ID soal tersimpan milik user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ saved_ids: [] })

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (service.from('saved_questions') as any)
    .select('question_id')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ saved_ids: [] })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json({ saved_ids: (data ?? []).map((r: any) => r.question_id as string) })
}

// POST /api/saved-questions
// Body: { question_id: string } — toggle simpan/hapus. Returns { saved: boolean }
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Tidak terautentikasi.' }, { status: 401 })

  const body = await request.json() as { question_id?: string }
  if (!body.question_id) return NextResponse.json({ error: 'question_id diperlukan.' }, { status: 400 })

  const service = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (service.from('saved_questions') as any)
    .select('id')
    .eq('user_id', user.id)
    .eq('question_id', body.question_id)
    .maybeSingle()

  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (service.from('saved_questions') as any)
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', body.question_id)
    return NextResponse.json({ saved: false })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (service.from('saved_questions') as any)
      .insert({ user_id: user.id, question_id: body.question_id })
    if (error) return NextResponse.json({ error: 'Gagal menyimpan soal.' }, { status: 400 })
    return NextResponse.json({ saved: true })
  }
}
