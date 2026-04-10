import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow } from '@/lib/utils'

interface LeaderboardEntry {
  user_id: string
  full_name: string | null
  avatar_url: string | null
  best_score: number
  attempt_count: number
}

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ packageId: string }>
}) {
  const { packageId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch paket
  const { data: pkgData } = await supabase
    .from('packages')
    .select('id, name, category, total_questions')
    .eq('id', packageId)
    .single()

  if (!pkgData) redirect('/paket')
  const pkg = pkgData as Pick<PackageRow, 'id' | 'name' | 'category' | 'total_questions'>

  // Query leaderboard: skor terbaik per user untuk paket ini
  // Supabase tidak support GROUP BY langsung via client, jadi pakai RPC atau raw query via view
  // Workaround: ambil semua finished attempts, group di JS
  const { data: attemptsData } = await supabase
    .from('attempts')
    .select('user_id, score')
    .eq('package_id', packageId)
    .eq('status', 'finished')
    .not('score', 'is', null)

  type AttemptEntry = { user_id: string; score: number }
  const attempts = (attemptsData ?? []) as AttemptEntry[]

  // Group by user_id — hitung best_score & attempt_count
  const userMap = new Map<string, { best_score: number; attempt_count: number }>()
  for (const a of attempts) {
    const existing = userMap.get(a.user_id)
    if (!existing) {
      userMap.set(a.user_id, { best_score: a.score, attempt_count: 1 })
    } else {
      userMap.set(a.user_id, {
        best_score: Math.max(existing.best_score, a.score),
        attempt_count: existing.attempt_count + 1,
      })
    }
  }

  // Ambil top 20 user_id terurut
  const topEntries = Array.from(userMap.entries())
    .sort((a, b) => b[1].best_score - a[1].best_score)
    .slice(0, 20)

  // Fetch profil user untuk nama & avatar
  let leaderboard: LeaderboardEntry[] = []
  if (topEntries.length > 0) {
    const topUserIds = topEntries.map(([uid]) => uid)
    const { data: usersData } = await supabase
      .from('users')
      .select('id, full_name, avatar_url')
      .in('id', topUserIds)

    type UserEntry = { id: string; full_name: string | null; avatar_url: string | null }
    const usersMap = new Map<string, UserEntry>(
      ((usersData ?? []) as UserEntry[]).map((u) => [u.id, u])
    )

    leaderboard = topEntries.map(([uid, stats]) => {
      const u = usersMap.get(uid)
      return {
        user_id: uid,
        full_name: u?.full_name ?? null,
        avatar_url: u?.avatar_url ?? null,
        best_score: stats.best_score,
        attempt_count: stats.attempt_count,
      }
    })
  }

  const myRank = leaderboard.findIndex((e) => e.user_id === user.id) + 1

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/paket" className="text-gray-400 hover:text-gray-600 text-sm">← Paket</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600">{pkg.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">🏆 Leaderboard</h1>
        <p className="text-gray-500 mt-1">{pkg.name}</p>
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
            <p className="text-4xl">🏁</p>
            <p>Belum ada peserta. Jadilah yang pertama!</p>
            <Link href={`/ujian/${packageId}`} className="inline-block mt-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Mulai Try Out
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 font-medium w-12">#</th>
                <th className="px-5 py-3 font-medium">Peserta</th>
                <th className="px-5 py-3 font-medium text-right">Skor Terbaik</th>
                <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">Percobaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1
                const isMe = entry.user_id === user.id
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

                return (
                  <tr
                    key={entry.user_id}
                    className={`transition-colors ${isMe ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-5 py-3">
                      {medal ? (
                        <span className="text-lg">{medal}</span>
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
                            (entry.full_name ?? 'U').charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className={`font-medium ${isMe ? 'text-blue-700' : 'text-gray-900'}`}>
                          {entry.full_name ?? 'Anonim'}
                          {isMe && <span className="ml-1.5 text-xs text-blue-500 font-normal">(kamu)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-bold text-base ${entry.best_score >= 75 ? 'text-green-600' : 'text-gray-700'}`}>
                        {entry.best_score}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 hidden sm:table-cell">
                      {entry.attempt_count}x
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href={`/ujian/${packageId}`}
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
