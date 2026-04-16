import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { UserRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const { payment } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profileData } = await supabase
    .from('users')
    .select('full_name, plan, plan_expires_at')
    .eq('id', user.id)
    .single()

  const profile = profileData as Pick<UserRow, 'full_name' | 'plan' | 'plan_expires_at'> | null

  const { data: attemptsData } = await supabase
    .from('attempts')
    .select('id, score, correct_count, wrong_count, empty_count, started_at, package_id')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .order('started_at', { ascending: false })
    .limit(10)

  const attempts = (attemptsData ?? []) as Pick<AttemptRow, 'id' | 'score' | 'correct_count' | 'wrong_count' | 'empty_count' | 'started_at' | 'package_id'>[]

  // Fetch nama paket untuk semua attempt
  const packageIds = Array.from(new Set(attempts.map((a) => a.package_id).filter(Boolean)))
  const { data: packagesData } = packageIds.length > 0
    ? await supabase.from('packages').select('id, name').in('id', packageIds)
    : { data: [] }
  const packageMap: Record<string, string> = {}
  for (const pkg of (packagesData ?? [])) {
    const p = pkg as { id: string; name: string }
    packageMap[p.id] = p.name
  }

  const totalAttempts = attempts.length
  const avgScore = totalAttempts > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / totalAttempts)
    : 0
  const highestScore = totalAttempts > 0
    ? Math.max(...attempts.map((a) => a.score ?? 0))
    : 0
  const thisMonthCount = attempts.filter(
    (a) => new Date(a.started_at).getMonth() === new Date().getMonth()
  ).length

  const name = profile?.full_name ?? user.email?.split('@')[0] ?? 'Pengguna'

  return (
    <div className="space-y-8">
      {/* Payment status banners */}
      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold">Pembayaran berhasil! Selamat datang di Premium!</p>
            <p className="text-sm text-green-600">Akses semua paket soal sudah terbuka untuk kamu.</p>
          </div>
        </div>
      )}
      {payment === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 flex items-center gap-3 text-yellow-700">
          <Clock className="w-6 h-6 text-yellow-500 shrink-0" />
          <div>
            <p className="font-semibold">Pembayaran sedang diproses</p>
            <p className="text-sm text-yellow-600">Akun akan diupgrade otomatis setelah pembayaran dikonfirmasi.</p>
          </div>
        </div>
      )}

      {/* Sambutan */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halo, {name}!</h1>
          <p className="text-gray-500 mt-1">Semangat belajar hari ini!</p>
        </div>
        <div>
          {profile?.plan === 'premium' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 font-semibold text-sm rounded-full">
              ✦ Premium aktif
              {profile.plan_expires_at && (
                <span className="font-normal">
                  s/d {formatDate(profile.plan_expires_at)}
                </span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 font-medium text-sm rounded-full">
              Akun Gratis
            </span>
          )}
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Ujian', value: totalAttempts, unit: 'kali' },
          { label: 'Rata-rata Skor', value: avgScore, unit: '' },
          { label: 'Skor Tertinggi', value: highestScore, unit: '' },
          { label: 'Ujian Bulan Ini', value: thisMonthCount, unit: 'kali' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stat.value}
              {stat.unit && <span className="text-base font-normal text-gray-500 ml-1">{stat.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Riwayat ujian */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Riwayat Ujian</h2>
          <Link href="/paket" className="text-sm text-blue-600 hover:underline">
            Mulai ujian baru →
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">Belum ada ujian yang dikerjakan</p>
            <Link href="/paket" className="text-blue-600 hover:underline text-sm">
              Mulai try out pertamamu →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Paket Ujian</th>
                  <th className="px-6 py-3 font-medium">Tanggal</th>
                  <th className="px-6 py-3 font-medium text-center">Skor</th>
                  <th className="px-6 py-3 font-medium text-center">B / S / K</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-800 text-sm">
                        {packageMap[attempt.package_id] ?? 'Paket Tidak Diketahui'}
                      </p>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-sm">
                      {formatDate(attempt.started_at)}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`font-bold text-lg ${(attempt.score ?? 0) >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                        {attempt.score ?? '-'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center text-sm text-gray-500">
                      <span className="text-green-600 font-medium">{attempt.correct_count ?? 0}</span>
                      {' / '}
                      <span className="text-red-500 font-medium">{attempt.wrong_count ?? 0}</span>
                      {' / '}
                      <span>{attempt.empty_count ?? 0}</span>
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/hasil/${attempt.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Lihat Hasil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
