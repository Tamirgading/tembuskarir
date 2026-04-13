import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

interface ImportQuestion {
  content: string
  options: { key: string; text: string }[]
  correctAnswer: string
  category: string | null
  explanation: string | null
  orderIndex: number
}

interface BulkImportBody {
  packageId: string
  questions: ImportQuestion[]
}

export async function POST(req: NextRequest) {
  try {
    // Auth + admin check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as BulkImportBody
    const { packageId, questions } = body

    if (!packageId) {
      return NextResponse.json({ error: 'packageId wajib diisi.' }, { status: 400 })
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Tidak ada soal untuk diimport.' }, { status: 400 })
    }

    if (questions.length > 200) {
      return NextResponse.json({ error: 'Maksimal 200 soal per import.' }, { status: 400 })
    }

    const service = createServiceClient()
    const errors: string[] = []
    let imported = 0

    // Insert per batch 20 untuk menghindari timeout
    const BATCH_SIZE = 20
    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE)

      const rows = batch.map((q) => ({
        package_id: packageId,
        content: q.content.trim(),
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation ?? null,
        category: q.category ?? null,
        difficulty: 'medium',
        order_index: q.orderIndex,
        image_url: null,
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertErr } = await (service.from('questions') as any)
        .insert(rows)

      if (insertErr) {
        console.error('[Bulk Import] Batch insert error:', insertErr)
        errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1} gagal: ${insertErr.message}`)
      } else {
        imported += batch.length
      }
    }

    return NextResponse.json({ imported, errors }, { status: 200 })
  } catch (err) {
    console.error('[Bulk Import] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
