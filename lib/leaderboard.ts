/**
 * lib/leaderboard.ts
 * Logika terpusat untuk menyusun leaderboard dari attempt yang sudah selesai
 * dan entri dummy (leaderboard_entries).
 *
 * Dua mode untuk user asli:
 *   - 'best'  : skor tertinggi (MAX) dari semua percobaan user (default).
 *   - 'first' : skor percobaan PERTAMA (earliest started_at) user.
 *               Percobaan berikutnya tidak memengaruhi posisi leaderboard.
 *
 * Entri dummy selalu disertakan apa pun mode-nya.
 */

export type LeaderboardMode = 'best' | 'first'

export interface LeaderboardAttempt {
  user_id: string
  score: number
  started_at: string
  duration_seconds?: number | null
}

export interface LeaderboardEntry {
  user_id: string
  score: number
  attempt_count: number
  duration_seconds: number | null
}

export interface LeaderboardDummy {
  id: string
  display_name: string
  score: number
  duration_seconds: number
}

export interface LeaderboardRow {
  key: string
  user_id: string | null
  display_name: string
  avatar_url: string | null
  score: number
  attempt_count: number
  duration_seconds: number | null
  is_dummy: boolean
}

export function buildLeaderboard(
  attempts: LeaderboardAttempt[],
  mode: LeaderboardMode = 'best'
): LeaderboardEntry[] {
  // Untuk mode 'first', urutkan ascending sehingga kemunculan pertama per user
  // = percobaan pertama (started_at paling awal).
  const ordered =
    mode === 'first'
      ? [...attempts].sort((a, b) => a.started_at.localeCompare(b.started_at))
      : attempts

  const map = new Map<string, LeaderboardEntry>()
  for (const a of ordered) {
    const existing = map.get(a.user_id)
    if (!existing) {
      map.set(a.user_id, {
        user_id: a.user_id,
        score: a.score,
        attempt_count: 1,
        duration_seconds: a.duration_seconds ?? null,
      })
    } else {
      existing.attempt_count++
      if (mode === 'best' && a.score > existing.score) {
        // Durasi ikut menempel ke attempt dengan skor terbaik
        existing.score = a.score
        existing.duration_seconds = a.duration_seconds ?? null
      }
      // mode 'first': skor & durasi percobaan pertama sudah tersimpan, jangan diubah
    }
  }

  return Array.from(map.values())
}

/**
 * Gabungkan baris user asli (sudah punya nama/avatar) dengan entri dummy,
 * lalu urutkan berdasarkan skor (desc).
 */
export function mergeLeaderboard(
  real: LeaderboardRow[],
  dummies: LeaderboardDummy[]
): LeaderboardRow[] {
  const dummyRows: LeaderboardRow[] = dummies.map((d) => ({
    key: `dummy-${d.id}`,
    user_id: null,
    display_name: d.display_name,
    avatar_url: null,
    score: d.score,
    attempt_count: 1,
    duration_seconds: d.duration_seconds,
    is_dummy: true,
  }))

  return [...real, ...dummyRows].sort(
    (a, b) => b.score - a.score || a.display_name.localeCompare(b.display_name)
  )
}
