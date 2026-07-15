import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { SavedQuestionList, type SavedQuestionRow } from '@/components/soal-tersimpan/SavedQuestionList'

export const metadata: Metadata = {
  title: 'Soal Tersimpan',
  description: 'Kumpulan soal yang kamu simpan untuk dipelajari kembali.',
}

export default async function SoalTersimpanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const service = createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rawData } = await (service.from('saved_questions') as any)
    .select(`
      id,
      saved_at,
      question_id,
      questions:question_id (
        id, content, options, correct_answer, explanation,
        explanation_image_url, category, image_url
      )
    `)
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const savedRows: SavedQuestionRow[] = ((rawData ?? []) as SavedQuestionRow[]).filter((r) => r.questions)

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid place-items-center rounded-xl bg-amber-50 text-amber-600 shrink-0 w-11 h-11">
          <Bookmark className="w-5 h-5" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-ink">Soal Tersimpan</h1>
          <p className="text-[13px] text-ink-muted">
            {savedRows.length > 0 ? `${savedRows.length} soal tersimpan` : 'Belum ada soal tersimpan'}
          </p>
        </div>
      </div>

      {savedRows.length === 0 ? (
        <div className="bg-white border border-hairline rounded-2xl p-10 text-center space-y-3 shadow-soft">
          <div className="grid place-items-center mx-auto rounded-full bg-amber-50 w-16 h-16">
            <Bookmark className="w-7 h-7 text-amber-500" strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-[15px] text-ink">Belum ada soal tersimpan</p>
          <p className="text-[13px] text-ink-muted max-w-sm mx-auto">
            Saat meninjau hasil ujian, klik tombol <strong>Simpan</strong> pada soal yang ingin kamu pelajari kembali.
          </p>
        </div>
      ) : (
        <SavedQuestionList initialRows={savedRows} />
      )}
    </div>
  )
}
