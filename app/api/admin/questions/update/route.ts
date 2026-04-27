import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

interface UpdateQuestionBody {
  questionId: string
  packageId: string
  content: string
  options: { key: string; text: string; point?: number }[]
  correctAnswer: string
  explanation?: string | null
  explanationImageUrl?: string | null
  category?: string | null
  difficulty?: string
  imageUrl?: string | null
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as UpdateQuestionBody
    const { questionId, packageId, content, options, correctAnswer, explanation, explanationImageUrl, category, difficulty, imageUrl } = body

    if (!questionId || !packageId || !content?.trim()) {
      return NextResponse.json({ error: 'questionId, packageId, dan content wajib diisi.' }, { status: 400 })
    }
    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'Minimal 2 pilihan jawaban.' }, { status: 400 })
    }
    const validKeys = ['A', 'B', 'C', 'D', 'E']
    if (!validKeys.includes(correctAnswer)) {
      return NextResponse.json({ error: 'Jawaban benar tidak valid.' }, { status: 400 })
    }

    const service = createServiceClient()

    // Verify question belongs to this package
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
    const { error: updateErr } = await (service.from('questions') as any)
      .update({
        content: content.trim(),
        options,
        correct_answer: correctAnswer,
        explanation: explanation ?? null,
        explanation_image_url: explanationImageUrl ?? null,
        category: category ?? null,
        difficulty: difficulty ?? 'medium',
        image_url: imageUrl ?? null,
      })
      .eq('id', questionId)

    if (updateErr) {
      console.error('[Questions Update] DB error:', updateErr)
      return NextResponse.json({ error: 'Gagal memperbarui soal.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Questions Update] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
