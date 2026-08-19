import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Flag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { buildLeaderboard, mergeLeaderboard } from '@/lib/leaderboard'
import type { LeaderboardDummy, LeaderboardRow } from '@/lib/leaderboard'
import { formatDuration } from '@/lib/utils'
import type { PackageRow } from '@/lib/utils'
import { LeaderboardIllustration } from '@/components/ui/LeaderboardIllustration'

const PAGE_SIZE = 10

export default async function LeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ packageId: string }>
  searchParams?: { page?: string }
}) {
  const { packageId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Fetch paket
  const { data: pkgData } = await supabase
    .from('packages')
    .select('id, name, category, total_questions')
    .eq('id', packageId)
    .single()

  if (!pkgData) redirect('/paket')
  const pkg = pkgData as Pick<PackageRow, 'id' | 'name' | 'category' | 'total_questions'>

  // ANTAM: leaderboard memakai skor percobaan PERTAMA per user.
  // Kategori lain: skor terbaik (MAX).
  const isAntam = pkg.category === 'ANTAM'

  // Ambil semua finished attempts, group di JS
  const { data: attemptsData } = await supabase
    .from('attempts')
    .select('user_id, score, started_at, duration_seconds')
    .eq('package_id', packageId)
    .eq('status', 'finished')
    .not('score', 'is', null)

  type AttemptEntry = {
    user_id: string
    score: number
    started_at: string
    duration_seconds: number | null
  }
  const attempts = (attemptsData ?? []) as AttemptEntry[]

  // Entri dummy dari admin (aman jika tabel belum dibuat)
  let dummies: LeaderboardDummy[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dummyData } = await (supabase.from('leaderboard_entries') as any)
      .select('id, display_name, score, duration_seconds')
      .eq('package_id', packageId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    dummies = (dummyData ?? []) as LeaderboardDummy[]
  } catch { /* tabel belum tersedia */ }

  const entries = buildLeaderboard(attempts, isAntam ? 'first' : 'best')

  // Susun semua baris (real + dummy), urutkan by skor
  const realRowsAll: LeaderboardRow[] = entries.map((e) => ({
    key: `user-${e.user_id}`,
    user_id: e.user_id,
    display_name: '',
    avatar_url: null,
    score: e.score,
    attempt_count: e.attempt_count,
    duration_seconds: e.duration_seconds,
    is_dummy: false,
  }))
  const allRows = mergeLeaderboard(realRowsAll, dummies)

  // Pagination: 10 peserta per halaman
  const rawPage = parseInt(searchParams?.page ?? '1', 10)
  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE))
  const page = Math.min(Math.max(Number.isFinite(rawPage) ? rawPage : 1, 1), totalPages)
  const topRows = allRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Fetch nama & avatar untuk peserta di halaman ini (real user)
  let leaderboard: LeaderboardRow[] = topRows
  const realTopIds = topRows.filter((r) => r.user_id).map((r) => r.user_id!) as string[]
  if (realTopIds.length > 0) {
    const { data: usersData } = await supabase
      .from('users')
      .select('id, full_name, avatar_url')
      .in('id', realTopIds)

    type UserEntry = { id: string; full_name: string | null; avatar_url: string | null }
    const usersMap = new Map<string, UserEntry>(
      ((usersData ?? []) as UserEntry[]).map((u) => [u.id, u])
    )

    leaderboard = topRows.map((r) => {
      if (!r.user_id) return r
      const u = usersMap.get(r.user_id)
      return {
        ...r,
        display_name: u?.full_name ?? 'Anonim',
        avatar_url: u?.avatar_url ?? null,
      }
    })
  }

  // Posisi user dihitung dari seluruh peserta (real + dummy)
  const myRank = allRows.findIndex((r) => r.user_id === user.id) + 1

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/paket" className="text-gray-400 hover:text-gray-600 text-sm">← Paket</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600">{pkg.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LeaderboardIllustration className="w-7 h-7" /> Leaderboard
        </h1>
        <p className="text-gray-500 mt-1">
          {pkg.name}
          {isAntam && ' — hanya skor percobaan pertama yang dihitung.'}
        </p>
      </div>

      {/* Rank saya */}
      {myRank > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center justify-between text-sm">
          <span className="text-blue-700 font-medium">Posisi kamu saat ini</span>
          <span className="text-blue-600 font-bold text-lg">#{myRank}</span>
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <div className="flex justify-center mb-2"><Flag className="w-10 h-10 text-gray-300" /></div>
            <p>Belum ada peserta. Jadilah yang pertama!</p>
            <Link href={isAntam ? `/persiapan/${packageId}` : `/ujian/${packageId}`} className="inline-block mt-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Mulai Try Out
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 font-medium w-12">#</th>
                <th className="px-5 py-3 font-medium">Peserta</th>
                <th className="px-5 py-3 font-medium text-right">{isAntam ? 'Skor Percobaan 1' : 'Skor Terbaik'}</th>
                <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">Waktu</th>
                <th className="px-5 py-3 font-medium text-right hidden md:table-cell">Percobaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1
                const isMe = entry.user_id === user.id
                const medalCls = rank === 1
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : rank === 2
                  ? 'bg-slate-100 text-slate-600 border border-slate-300'
                  : rank === 3
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : null

                return (
                  <tr
                    key={entry.key}
                    className={`transition-colors ${isMe ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-5 py-3">
                      {medalCls ? (
                        <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${medalCls}`}>{rank}</span>
                      ) : (
                        <span className={`font-semibold ${isMe ? 'text-blue-600' : 'text-gray-400'}`}>
                          {rank}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 overflow-hidden">
                          {entry.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={entry.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (entry.display_name ?? 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className={`font-medium ${isMe ? 'text-blue-700' : 'text-gray-900'}`}>
                          {entry.display_name}
                          {isMe && <span className="ml-1.5 text-xs text-blue-500 font-normal">(kamu)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-bold text-base ${entry.score >= 75 ? 'text-green-600' : 'text-gray-700'}`}>
                        {entry.score}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500 hidden sm:table-cell font-num">
                      {entry.duration_seconds != null ? formatDuration(entry.duration_seconds) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 hidden md:table-cell">
                      {entry.is_dummy ? '—' : `${entry.attempt_count}x`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {leaderboard.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          {page > 1 ? (
            <Link
              href={`?page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Sebelumnya
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-200 text-gray-300 rounded-lg cursor-not-allowed">← Sebelumnya</span>
          )}
          <span className="text-gray-500">Halaman {page} dari {totalPages}</span>
          {page < totalPages ? (
            <Link
              href={`?page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Berikutnya →
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-200 text-gray-300 rounded-lg cursor-not-allowed">Berikutnya →</span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href={isAntam ? `/persiapan/${packageId}` : `/ujian/${packageId}`}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mulai / Ulangi Try Out
        </Link>
        <Link
          href="/paket"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Paket Lain
        </Link>
      </div>
    </div>
  )
}
