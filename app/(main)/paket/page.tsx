import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRow, PackageRow } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Paket Soal Try Out CPNS SKD',
  description: 'Pilih paket soal try out CPNS SKD — TWK, TIU, TKP. Ada paket gratis dan premium dengan ribuan soal berkualitas.',
}

const CPNS_TARGET = 110

export default async function PaketPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { data: packagesData } = await supabase
    .from('packages')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Hitung jumlah soal per paket
  const { data: questionCounts } = await supabase
    .from('questions')
    .select('package_id')

  const profile = profileData as Pick<UserRow, 'plan'> | null
  const packages = (packagesData ?? []) as PackageRow[]
  const userPlan = profile?.plan ?? 'free'

  // Buat map packageId → jumlah soal
  const countMap: Record<string, number> = {}
  for (const row of (questionCounts ?? [])) {
    const r = row as { package_id: string }
    countMap[r.package_id] = (countMap[r.package_id] ?? 0) + 1
  }

  function isComingSoon(pkg: PackageRow): boolean {
    if (pkg.category !== 'CPNS') return false
    const count = countMap[pkg.id] ?? 0
    return count < CPNS_TARGET
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paket Soal</h1>
        <p className="text-gray-500 mt-1">Pilih paket dan mulai latihan sekarang</p>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Belum ada paket soal tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => {
            const canAccess = pkg.is_free || userPlan === 'premium'
            const comingSoon = isComingSoon(pkg)

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-xl border p-6 flex flex-col gap-4 transition-colors ${
                  comingSoon
                    ? 'border-gray-200 opacity-75'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2">
                      {pkg.category}
                    </span>
                    <h2 className="font-semibold text-gray-900 leading-snug">{pkg.name}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {comingSoon && (
                      <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                        🔒 Coming Soon
                      </span>
                    )}
                    <span
                      className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                        pkg.is_free
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {pkg.is_free ? 'GRATIS' : 'PREMIUM'}
                    </span>
                  </div>
                </div>

                {/* Deskripsi */}
                {pkg.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">{pkg.description}</p>
                )}

                {/* Info */}
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>📝 {pkg.total_questions} soal</span>
                  <span>⏱ {pkg.duration_minutes} menit</span>
                </div>

                {/* CTA */}
                <div className="mt-auto space-y-2">
                  {comingSoon ? (
                    <div className="w-full text-center py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
                      Segera Hadir
                    </div>
                  ) : canAccess ? (
                    <Link
                      href={`/persiapan/${pkg.id}`}
                      className="block w-full text-center py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mulai Try Out
                    </Link>
                  ) : (
                    <Link
                      href="/harga"
                      className="block w-full text-center py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Upgrade Premium
                    </Link>
                  )}
                  {!comingSoon && (
                    <Link
                      href={`/paket/${pkg.id}/leaderboard`}
                      className="block w-full text-center py-2 text-gray-500 text-xs hover:text-blue-600 transition-colors"
                    >
                      🏆 Lihat Leaderboard
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
