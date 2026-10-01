export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import {
  AggregateAnalyticsDashboard,
  type RawPackage,
  type RawAttempt,
} from '@/components/admin/AggregateAnalyticsDashboard'

export default async function AdminAnalyticsHubPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdmin(user.email)) {
    redirect('/')
  }

  const service = createServiceClient()

  // 1. Ambil semua paket soal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgs } = await (service.from('packages') as any)
    .select('id, name, category, total_questions, duration_minutes, is_published, is_free, slug')
    .order('created_at', { ascending: false })

  const allPackages = (pkgs ?? []) as RawPackage[]

  // 2. Ambil seluruh data attempt (selesai & sedang berlangsung)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: attemptsData } = await (service.from('attempts') as any)
    .select('id, package_id, user_id, score, status, duration_seconds, started_at, attempt_number')
    .order('started_at', { ascending: true })

  const allAttempts = (attemptsData ?? []) as RawAttempt[]

  return (
    <AggregateAnalyticsDashboard
      packages={allPackages}
      attempts={allAttempts}
      initialCategory={category ?? 'ALL'}
    />
  )
}
