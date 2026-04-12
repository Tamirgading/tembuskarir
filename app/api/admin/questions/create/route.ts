import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

interface CreateQuestionBody {
  packageId: string
  content: string
  options: { key: string; text: string }[]
  correctAnswer: string
  explanation?: string | null
  category?: string | null
  difficulty?: string
  orderIndex?: number
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as CreateQuestionBody
    const { packageId, content, options, correctAnswer, explanation, category, difficulty, orderIndex } = body

    // Validasi
    if (!packageId || !content?.trim()) {
      return NextResponse.json({ error: 'packageId dan content wajib diisi.' }, { status: 400 })
    }
    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'Minimal 2 pilihan jawaban.' }, { status: 400 })
    }
    const validKeys = ['A', 'B', 'C', 'D', 'E']
    if (!validKeys.includes(correctAnswer)) {
      return NextResponse.json({ error: 'Jawaban benar tidak valid.' }, { status: 400 })
    }

    const service = createServiceClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertErr } = await (service.from('questions') as any)
      .insert({
        package_id: packageId,
        content: content.trim(),
        options,
        correct_answer: correctAnswer,
        explanation: explanation ?? null,
        category: category ?? null,
        difficulty: difficulty ?? 'medium',
        order_index: orderIndex ?? 0,
      })

    if (insertErr) {
      console.error('[Questions Create] DB error:', insertErr)
      return NextResponse.json({ error: 'Gagal menyimpan soal.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Questions Create] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
