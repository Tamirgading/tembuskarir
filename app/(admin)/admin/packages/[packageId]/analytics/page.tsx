export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import { PackageAnalyticsView } from '@/components/admin/PackageAnalyticsView'
import type { QuestionItem, AttemptItem } from '@/lib/item-analysis'

export default async function PackageAnalyticsPage({
  params,
}: {
  params: Promise<{ packageId: string }>
}) {
  const { packageId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect('/')
  }

  const service = createServiceClient()

  // Ambil detail paket
  const { data: pkgData, error: pkgErr } = await service
    .from('packages')
    .select('id, name, category, total_questions, duration_minutes, slug')
    .eq('id', packageId)
    .single()

  if (pkgErr || !pkgData) {
    notFound()
  }

  // Ambil seluruh butir soal paket
  const { data: questionsData } = await service
    .from('questions')
    .select('id, order_index, content, category, correct_answer, explanation, image_url, options')
    .eq('package_id', packageId)
    .order('order_index', { ascending: true })

  // Ambil riwayat pengerjaan attempt untuk paket ini
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: attemptsData } = await (service.from('attempts') as any)
    .select('id, user_id, score, correct_count, wrong_count, empty_count, duration_seconds, started_at, status, attempt_number, answers')
    .eq('package_id', packageId)
    .order('started_at', { ascending: false })

  const questions: QuestionItem[] = (questionsData ?? []) as QuestionItem[]
  const rawAttempts: AttemptItem[] = (attemptsData ?? []) as AttemptItem[]

  return (
    <div className="max-w-7xl mx-auto py-2">
      <PackageAnalyticsView
        pkg={pkgData}
        rawAttempts={rawAttempts}
        questions={questions}
      />
    </div>
  )
}
