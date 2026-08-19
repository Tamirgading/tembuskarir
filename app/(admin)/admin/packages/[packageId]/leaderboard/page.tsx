import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import { LeaderboardManager } from '@/components/admin/LeaderboardManager'

export default async function AdminLeaderboardPage({
  params,
}: {
  params: Promise<{ packageId: string }>
}) {
  const { packageId } = await params
  const supabase = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgData } = await (supabase.from('packages') as any)
    .select('id, name, category, total_questions')
    .eq('id', packageId)
    .single()

  const pkg = pkgData as Pick<PackageRow, 'id' | 'name' | 'category' | 'total_questions'> | null

  if (!pkg) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Paket tidak ditemukan.</p>
        <Link href="/admin/packages" className="text-blue-600 hover:underline text-sm">← Kembali ke Paket Soal</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/packages" className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Paket Soal
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Leaderboard</h1>
        <p className="text-gray-500 mt-1">
          {pkg.name} · {pkg.category}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <LeaderboardManager packageId={packageId} packageName={pkg.name} />
      </div>
    </div>
  )
}
