import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RiwayatClient, type RiwayatAttempt } from '@/components/riwayat/RiwayatClient'

export const metadata: Metadata = {
  title: 'Riwayat Tes',
  description: 'Riwayat simulasi tes yang sudah kamu selesaikan beserta skornya.',
}

interface AttemptRow {
  id: string
  package_id: string
  score: number | null
  correct_count: number | null
  started_at: string
  duration_seconds: number | null
}

export default async function RiwayatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: attData } = await supabase
    .from('attempts')
    .select('id, package_id, score, correct_count, started_at, duration_seconds')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .order('started_at', { ascending: false })
    .limit(100)

  const attempts = (attData ?? []) as AttemptRow[]

  // Nama paket + kategori + jumlah soal
  const pkgIds = Array.from(new Set(attempts.map((a) => a.package_id)))
  const pkgMap: Record<string, { name: string; category: string; total_questions: number }> = {}
  if (pkgIds.length > 0) {
    const { data: pkgData } = await supabase
      .from('packages')
      .select('id, name, category, total_questions')
      .in('id', pkgIds)
    for (const p of (pkgData ?? []) as { id: string; name: string; category: string; total_questions: number }[]) {
      pkgMap[p.id] = { name: p.name, category: p.category, total_questions: p.total_questions }
    }
  }

  const rows: RiwayatAttempt[] = attempts.map((a) => ({
    id: a.id,
    name: pkgMap[a.package_id]?.name ?? 'Paket Soal',
    category: pkgMap[a.package_id]?.category ?? 'LAINNYA',
    score: a.score ?? 0,
    correctCount: a.correct_count,
    totalQuestions: pkgMap[a.package_id]?.total_questions ?? null,
    startedAt: a.started_at,
    durationSeconds: a.duration_seconds,
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-ink">Riwayat Tes</h1>
        <p className="text-[13px] text-ink-muted mt-1">
          Semua simulasi yang sudah kamu selesaikan, beserta skor dan detailnya.
        </p>
      </div>
      <RiwayatClient attempts={rows} />
    </div>
  )
}
