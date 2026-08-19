/**
 * lib/leaderboard.ts
 * Logika terpusat untuk menyusun leaderboard dari attempt yang sudah selesai.
 *
 * Dua mode:
 *   - 'best'  : skor tertinggi (MAX) dari semua percobaan user (default).
 *   - 'first' : skor percobaan PERTAMA (earliest started_at) user.
 *               Percobaan berikutnya tidak memengaruhi posisi leaderboard.
 */

export type LeaderboardMode = 'best' | 'first'

export interface LeaderboardAttempt {
  user_id: string
  score: number
  started_at: string
}

export interface LeaderboardEntry {
  user_id: string
  score: number
  attempt_count: number
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

  const map = new Map<string, { score: number; attempt_count: number }>()
  for (const a of ordered) {
    const existing = map.get(a.user_id)
    if (!existing) {
      map.set(a.user_id, { score: a.score, attempt_count: 1 })
    } else {
      existing.attempt_count++
      if (mode === 'best') {
        existing.score = Math.max(existing.score, a.score)
      }
      // mode 'first': score percobaan pertama sudah tersimpan, jangan diubah
    }
  }

  return Array.from(map.entries())
    .map(([user_id, s]) => ({
      user_id,
      score: s.score,
      attempt_count: s.attempt_count,
    }))
    .sort((a, b) => b.score - a.score || a.user_id.localeCompare(b.user_id))
}
