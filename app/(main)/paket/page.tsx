import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, Clock, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { UserRow, PackageRow } from '@/lib/utils'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Paket Soal Simulasi Tes Kerja',
  description: 'Pilih paket soal simulasi tes rekrutmen kerja. Ada paket gratis dan premium dengan ribuan soal berkualitas.',
}

export default async function PaketPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const flags = await getEffectiveFeatureFlags(user.email)
  if (!flags.feature_semua_paket) redirect('/')

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

  const profile = profileData as Pick<UserRow, 'plan'> | null
  const packages = (packagesData ?? []) as PackageRow[]
  const userPlan = profile?.plan ?? 'free'

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

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 transition-colors hover:border-blue-300"
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
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {pkg.total_questions} soal</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration_minutes} menit</span>
                </div>

                {/* CTA */}
                <div className="mt-auto space-y-2">
                  {canAccess ? (
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
                  <Link
                    href={`/paket/${pkg.id}/leaderboard`}
                    className="flex items-center justify-center gap-1.5 w-full text-center py-2 text-gray-500 text-xs hover:text-blue-600 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5" /> Lihat Leaderboard
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
