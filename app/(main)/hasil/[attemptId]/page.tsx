import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RotateCcw, Grid2x2, LayoutDashboard, CheckCircle2, XCircle, MinusCircle, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { AttemptRow } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'
import { buildLeaderboard, mergeLeaderboard } from '@/lib/leaderboard'
import type { LeaderboardAttempt, LeaderboardDummy, LeaderboardRow } from '@/lib/leaderboard'
import { HasilReview } from '@/components/hasil/HasilReview'
import { LeaderboardIllustration } from '@/components/ui/LeaderboardIllustration'
import { fetchStageSections, evaluateStagePassing } from '@/lib/stage-config'

interface QuestionWithAnswer {
  id: string
  content: string
  options: { key: string; text: string }[]
  correct_answer: string
  explanation: string | null
  explanation_image_url: string | null
  category: string | null
  image_url: string | null
  order_index: number
}

interface CatStat { correct: number; wrong: number; empty: number; rawScore: number }
interface ScoreDetails {
  type?: string
  categories?: Record<string, CatStat>
  maxScore?: number
  totalQuestions?: number
}

const SUBTEST_FULL: Record<string, string> = Object.fromEntries([
  ...Object.entries(ASTRA_SUBTESTS).map(([k, v]) => [k, v.full]),
  ...Object.entries(PLN_SUBTESTS).map(([k, v]) => [k, v.full]),
])

function tier(pct: number): { title: string; note: string } {
  if (pct >= 85) return { title: 'Hasil yang luar biasa', note: 'Kamu sudah sangat siap. Pertahankan ritme latihanmu.' }
  if (pct >= 70) return { title: 'Hasil yang bagus', note: 'Sedikit lagi menuju level aman. Fokuskan ke sub-tes terlemah.' }
  if (pct >= 50) return { title: 'Terus menanjak', note: 'Pondasimu mulai terbentuk. Latih bagian yang masih merah di bawah.' }
  return { title: 'Awal yang baik', note: 'Setiap latihan menambah kesiapanmu. Pelajari pembahasan, lalu coba lagi.' }
}

export default async function HasilPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: attemptData } = await supabase
    .from('attempts').select('*').eq('id', attemptId).single()

  const attempt = attemptData as AttemptRow | null
  if (!attempt || attempt.user_id !== user.id) redirect('/')
  if (attempt.status === 'ongoing') redirect(`/ujian/${attempt.package_id}`)

  const { data: pkgData } = await supabase
    .from('packages').select('name, total_questions, category').eq('id', attempt.package_id).single()
  const pkg = pkgData as { name: string; total_questions: number; category: string } | null

  // Konfigurasi tahap gabungan (package_sections) + evaluasi passing grade
  let stageSections: Awaited<ReturnType<typeof fetchStageSections>> = []
  let stageGroups: ReturnType<typeof evaluateStagePassing>['groups'] = []
  let stageOverall: ReturnType<typeof evaluateStagePassing>['overall'] = 'none'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawAttemptDetails = (attempt as any).score_details as ScoreDetails | null | undefined
  try {
    stageSections = await fetchStageSections(supabase, attempt.package_id)
    if (stageSections.length > 0) {
      const ev = evaluateStagePassing(stageSections, rawAttemptDetails as Record<string, unknown> | null)
      stageGroups = ev.groups
      stageOverall = ev.overall
    }
  } catch { /* package_sections belum tersedia */ }

  // Leaderboard ANTAM: posisi user berdasarkan skor percobaan PERTAMA
  // (termasuk entri dummy yang diisi admin)
  let antamRank = 0
  let antamTotal = 0
  let leaderboardRows: LeaderboardRow[] = []
  let myRow: LeaderboardRow | null = null
  if (pkg?.category === 'ANTAM') {
    const { data: antamAttempts } = await supabase
      .from('attempts')
      .select('user_id, score, started_at, duration_seconds')
      .eq('package_id', attempt.package_id)
      .eq('status', 'finished')
      .not('score', 'is', null)
    const entries = buildLeaderboard((antamAttempts ?? []) as LeaderboardAttempt[], 'first')

    let antamDummies: LeaderboardDummy[] = []
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: dummyData } = await (supabase.from('leaderboard_entries') as any)
        .select('id, display_name, score, duration_seconds')
        .eq('package_id', attempt.package_id)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
      antamDummies = (dummyData ?? []) as LeaderboardDummy[]
    } catch { /* tabel belum tersedia */ }

    const realRows: LeaderboardRow[] = entries.map((e) => ({
      key: `user-${e.user_id}`,
      user_id: e.user_id,
      display_name: '',
      avatar_url: null,
      score: e.score,
      attempt_count: e.attempt_count,
      duration_seconds: e.duration_seconds,
      is_dummy: false,
    }))
    const allRows = mergeLeaderboard(realRows, antamDummies)
    antamTotal = allRows.length
    const idx = allRows.findIndex((r) => r.user_id === user.id)
    if (idx >= 0) antamRank = idx + 1

    // Top 5 + nama peserta (real user)
    const topRows = allRows.slice(0, 5)
    const realTopIds = topRows.filter((r) => r.user_id).map((r) => r.user_id!) as string[]
    const myRaw = allRows.find((r) => r.user_id === user.id) ?? null
    const myIds = Array.from(new Set([...realTopIds, ...(myRaw?.user_id ? [myRaw.user_id] : [])]))
    leaderboardRows = topRows
    if (myIds.length > 0) {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', myIds)
      type UserEntry = { id: string; full_name: string | null; avatar_url: string | null }
      const usersMap = new Map<string, UserEntry>(
        ((usersData ?? []) as UserEntry[]).map((u) => [u.id, u])
      )
      leaderboardRows = topRows.map((r) => {
        if (!r.user_id) return r
        const u = usersMap.get(r.user_id)
        return {
          ...r,
          display_name: u?.full_name ?? 'Anonim',
          avatar_url: u?.avatar_url ?? null,
        }
      })
      if (myRaw) {
        const mu = usersMap.get(myRaw.user_id!)
        myRow = {
          ...myRaw,
          display_name: mu?.full_name ?? 'Anonim',
          avatar_url: mu?.avatar_url ?? null,
        }
      }
    }
  }

  // Soal + pembahasan (fallback jika kolom explanation_image_url belum ada)
  let questionsData: QuestionWithAnswer[] | null = null
  const { data: qData, error: qErr } = await supabase
    .from('questions')
    .select('id, content, options, correct_answer, explanation, explanation_image_url, category, image_url, order_index')
    .eq('package_id', attempt.package_id)
    .order('order_index', { ascending: true })
  if (qErr) {
    const { data: qFallback } = await supabase
      .from('questions')
      .select('id, content, options, correct_answer, explanation, category, image_url, order_index')
      .eq('package_id', attempt.package_id)
      .order('order_index', { ascending: true })
    questionsData = ((qFallback ?? []) as Omit<QuestionWithAnswer, 'explanation_image_url'>[]).map((q) => ({ ...q, explanation_image_url: null }))
  } else {
    questionsData = (qData ?? []) as QuestionWithAnswer[]
  }

  // Sort: urutan sub-tes dulu (sesuai definisi ASTRA/PLN/tahap), lalu order_index
  const subtestOrder =
    stageSections.length > 0 ? stageSections.map((s) => s.kode) :
    pkg?.category === 'ASTRA' ? Object.keys(ASTRA_SUBTESTS) :
    pkg?.category === 'PLN'   ? Object.keys(PLN_SUBTESTS)   : []

  const questions = questionsData.sort((a, b) => {
    if (subtestOrder.length > 0) {
      const iA = subtestOrder.indexOf((a.category ?? '').toUpperCase())
      const iB = subtestOrder.indexOf((b.category ?? '').toUpperCase())
      const posA = iA === -1 ? 999 : iA
      const posB = iB === -1 ? 999 : iB
      if (posA !== posB) return posA - posB
    }
    return a.order_index - b.order_index
  })
  const userAnswers = (attempt.answers ?? {}) as Record<string, string>
  const score = attempt.score ?? 0
  const correct = attempt.correct_count ?? 0
  const wrong = attempt.wrong_count ?? 0
  const empty = attempt.empty_count ?? 0
  const totalAll = correct + wrong + empty

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDetails = (attempt as any).score_details as ScoreDetails | null | undefined
  const sd: ScoreDetails | null = rawDetails && typeof rawDetails === 'object' ? rawDetails : null

  // Denominator & persen ring sesuai tipe
  let denom = '/ 100'
  let pct = Math.min(100, Math.max(0, score))
  if (sd?.type === 'ASTRA' || sd?.type === 'ANTAM') {
    const max = sd.maxScore ?? pkg?.total_questions ?? 0
    denom = max ? `/ ${max}` : 'poin'
    pct = max ? Math.round((score / max) * 100) : 0
  } else if (sd?.type === 'PLN') {
    denom = 'poin'
    pct = totalAll ? Math.round((correct / totalAll) * 100) : 0
  } else if (sd?.type === 'BUMN' || stageSections.length > 0) {
    denom = 'poin'
    pct = totalAll ? Math.round((correct / totalAll) * 100) : 0
  }

  // Rincian per sub-tes
  const subtests = sd?.categories
    ? Object.entries(sd.categories).map(([code, s]) => {
        const t = s.correct + s.wrong + s.empty
        return { code, pct: t ? Math.round((s.correct / t) * 100) : 0, correct: s.correct, total: t }
      }).sort((a, b) => b.pct - a.pct)
    : []
  const weakest = subtests.length ? subtests[subtests.length - 1] : null

  const t = tier(pct)
  const R = 50, C = 2 * Math.PI * R
  const offset = C * (1 - pct / 100)

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ══ HERO ══ */}
      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 sm:px-8 py-7 text-white" style={{ background: pkg?.category === 'ANTAM' ? 'linear-gradient(135deg,#1a472a,#0d2818)' : 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <div className="flex flex-row items-start gap-3 sm:gap-6">
            {/* Ring skor */}
            <div className="relative w-[80px] h-[80px] sm:w-[128px] sm:h-[128px] shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 128 128" className="-rotate-90">
                <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="11" />
                <circle cx="64" cy="64" r={R} fill="none" stroke="#34D399" strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-num font-bold text-[22px] sm:text-[34px] leading-none">{score}</span>
                <span className="text-[9px] sm:text-[11px] text-white/60 mt-0.5">{denom}</span>
              </div>
            </div>
            {/* Teks */}
            <div className="text-left flex-1 min-w-0">
              <p className="text-white/55 text-xs uppercase tracking-wider font-semibold mb-1">{pkg?.name ?? 'Hasil Simulasi'}</p>
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold mb-1.5">{t.title}</h1>
              <p className="text-white/70 text-sm max-w-md">{t.note}</p>
              <div className="inline-flex items-center gap-1.5 mt-3 bg-white/10 rounded-full px-3 py-1 text-xs">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                {attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Strip benar/salah/kosong */}
        <div className="grid grid-cols-3 divide-x divide-hairline bg-white">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-brand" />, k: correct, l: 'Benar' },
            { icon: <XCircle className="w-4 h-4 text-red-500" />, k: wrong, l: 'Salah' },
            { icon: <MinusCircle className="w-4 h-4 text-ink-muted" />, k: empty, l: 'Kosong' },
          ].map((s) => (
            <div key={s.l} className="flex items-center justify-center gap-2.5 py-3.5">
              {s.icon}
              <span className="font-num font-bold text-lg text-ink">{s.k}</span>
              <span className="text-ink-muted text-sm">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Passing grade per seksi (paket tahap) ══ */}
      {stageSections.length > 0 && stageGroups.length > 0 && (
        <div className="bg-white rounded-2xl border border-hairline shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <h2 className="font-heading font-bold text-ink">Passing Grade per Seksi</h2>
            {stageOverall !== 'none' && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                stageOverall === 'lolos' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {stageOverall === 'lolos' ? '✓ LOLOS' : '✗ BELUM LOLOS'}
              </span>
            )}
          </div>
          <div className="divide-y divide-hairline">
            {stageGroups.map((g) => (
              <div key={g.kode} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{g.nama}</p>
                  <p className="text-xs text-ink-muted font-num">{g.correct}/{g.total} benar</p>
                </div>
                <span className="text-xs font-semibold text-ink-muted shrink-0">
                  PG: <span className="font-num">{g.passingGrade ?? '—'}</span>
                </span>
                {g.passed === null ? (
                  <span className="text-[10px] font-medium text-ink-muted bg-paper-soft border border-hairline px-2.5 py-1 rounded-full shrink-0">Tanpa PG</span>
                ) : g.passed ? (
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full shrink-0">LOLOS</span>
                ) : (
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full shrink-0">BELUM</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ Leaderboard + Rincian per sub-tes (bersebelahan) ══ */}
      {(pkg?.category === 'ANTAM' || subtests.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
      {/* ══ Leaderboard ANTAM ══ */}
      {pkg?.category === 'ANTAM' && (
        <div className="bg-white rounded-2xl border border-hairline shadow-soft p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-paper-soft border border-hairline flex items-center justify-center shrink-0">
                <LeaderboardIllustration className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink leading-tight">Leaderboard</p>
                <p className="text-[11px] text-ink-muted">
                  {antamRank > 0
                    ? <>Rank <b className="text-ink">#{antamRank}</b> / <b className="text-ink">{antamTotal}</b></>
                    : <>Belum ada peserta</>}
                </p>
              </div>
            </div>
            <Link
              href={`/paket/${attempt.package_id}/leaderboard`}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-[11px] font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Daftar peringkat (top 5) — padat */}
          <div className="flex-1 space-y-1">
            {leaderboardRows.map((entry, i) => {
              const rank = i + 1
              const isMe = entry.user_id === user.id
              const medalCls =
                rank === 1 ? 'bg-amber-100 text-amber-700'
                : rank === 2 ? 'bg-slate-100 text-slate-600'
                : rank === 3 ? 'bg-orange-100 text-orange-700'
                : 'bg-paper-soft text-ink-muted'
              return (
                <div
                  key={entry.key}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${isMe ? 'bg-green-50 border-green-200' : 'border-transparent hover:bg-paper-soft'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${medalCls}`}>
                    {rank}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-xs font-medium text-ink">
                    {entry.display_name || 'Anonim'}
                    {isMe && <span className="ml-1 text-[10px] text-green-600 font-semibold">(kamu)</span>}
                  </span>
                  {entry.duration_seconds != null && (
                    <span className="text-[10px] text-ink-muted font-num shrink-0 hidden sm:block">
                      {formatDuration(entry.duration_seconds)}
                    </span>
                  )}
                  <span className={`font-num font-bold text-[13px] shrink-0 ${entry.score >= 75 ? 'text-green-600' : 'text-ink'}`}>
                    {entry.score}
                  </span>
                </div>
              )
            })}
            {leaderboardRows.length === 0 && (
              <p className="text-center text-[11px] text-ink-muted py-4">Belum ada peserta. Jadilah yang pertama!</p>
            )}
          </div>

          {/* Rank kamu — paling bawah */}
          {myRow && antamRank > 5 && (
            <div className="mt-2 pt-2 border-t border-hairline">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-green-50 border border-green-200">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {antamRank}
                </span>
                <span className="flex-1 min-w-0 truncate text-xs font-medium text-green-800">
                  {myRow.display_name || 'Anonim'} <span className="text-[10px] text-green-600 font-semibold">(kamu)</span>
                </span>
                {myRow.duration_seconds != null && (
                  <span className="text-[10px] text-green-600 font-num shrink-0 hidden sm:block">
                    {formatDuration(myRow.duration_seconds)}
                  </span>
                )}
                <span className={`font-num font-bold text-[13px] shrink-0 ${myRow.score >= 75 ? 'text-green-600' : 'text-green-700'}`}>
                  {myRow.score}
                </span>
              </div>
            </div>
          )}

          <p className="text-[10px] text-ink-muted mt-2 border-t border-hairline pt-2">
            Skor percobaan pertama yang dihitung.
          </p>
        </div>
      )}

      {/* ══ Rincian per sub-tes ══ */}
      {subtests.length > 0 && (
        <div className="bg-white rounded-2xl border border-hairline shadow-soft p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Rincian per sub-tes</p>
            {weakest && <span className="text-[11px] text-ink-muted">Terlemah: <b className="text-ink">{weakest.code}</b></span>}
          </div>
          <div className="flex-1 space-y-1.5">
            {subtests.map((s) => (
              <div key={s.code} className="flex items-center gap-2">
                <span className="w-10 text-[10px] font-bold text-center text-ink bg-paper-soft rounded-md py-1 shrink-0">{s.code}</span>
                <span className="flex-1 text-xs text-ink-soft truncate min-w-0">{SUBTEST_FULL[s.code] ?? s.code}</span>
                <span className="flex-1 max-w-[160px] h-1.5 bg-hairline rounded-full overflow-hidden shrink-0">
                  <span className="block h-full rounded-full" style={{ width: `${s.pct}%`, background: s.pct < 60 ? '#F4B400' : '#0E9F6E' }} />
                </span>
                <span className="w-12 text-right font-num text-xs text-ink shrink-0">{s.correct}/{s.total}</span>
                <span className="w-9 text-right font-num font-semibold text-xs text-ink shrink-0">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      )}

      {/* ══ Aksi ══ */}
      <div className="grid grid-cols-3 gap-3">
        <Link href={`/persiapan/${attempt.package_id}`} className="flex items-center justify-center gap-2 py-3 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
          <RotateCcw className="w-4 h-4" /> Coba Lagi
        </Link>
        <Link href={pkg?.category === 'ANTAM' ? '/portal/antam' : pkg?.category === 'ASTRA' ? '/portal/astra' : '/paket'} className="flex items-center justify-center gap-2 py-3 bg-white border border-hairline text-ink text-sm font-semibold rounded-xl hover:bg-paper-soft transition-colors">
          <Grid2x2 className="w-4 h-4" /> Paket Lain
        </Link>
        <Link href="/" className="flex items-center justify-center gap-2 py-3 bg-white border border-hairline text-ink text-sm font-semibold rounded-xl hover:bg-paper-soft transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Beranda
        </Link>
      </div>

      {/* ══ Review pembahasan ══ */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="bg-ink px-5 py-3.5">
          <h2 className="font-heading font-bold text-white text-sm">Review Pembahasan</h2>
          <p className="text-white/55 text-xs mt-0.5">Pelajari tiap soal untuk menutup kelemahanmu.</p>
        </div>
        <div className="bg-paper p-3 sm:p-4">
          <HasilReview questions={questions} userAnswers={userAnswers} />
        </div>
      </div>
    </div>
  )
}
