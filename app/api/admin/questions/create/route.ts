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
  imageUrl?: string | null
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
    const { packageId, content, options, correctAnswer, explanation, category, difficulty, imageUrl } = body

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

    // Auto-hitung order_index = MAX(order_index per kategori ini) + 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let maxQuery = (service.from('questions') as any)
      .select('order_index')
      .eq('package_id', packageId)
      .order('order_index', { ascending: false })
      .limit(1)

    if (category) {
      maxQuery = maxQuery.eq('category', category)
    } else {
      maxQuery = maxQuery.is('category', null)
    }

    const { data: maxData } = await maxQuery.maybeSingle()
    const computedOrderIndex = ((maxData as { order_index: number } | null)?.order_index ?? 0) + 1

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
        order_index: computedOrderIndex,
        image_url: imageUrl ?? null,
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
