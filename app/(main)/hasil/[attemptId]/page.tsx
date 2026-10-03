import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RotateCcw, Grid2x2, LayoutDashboard, CheckCircle2, XCircle, MinusCircle, Clock } from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'
import type { AttemptRow } from '@/lib/utils'
import { formatDuration } from '@/lib/utils'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'
import { buildLeaderboard, mergeLeaderboard } from '@/lib/leaderboard'
import type { LeaderboardAttempt, LeaderboardDummy, LeaderboardRow } from '@/lib/leaderboard'
import { HasilReview } from '@/components/hasil/HasilReview'
import { LeaderboardIllustration } from '@/components/ui/LeaderboardIllustration'
import { fetchStageSections, evaluateStagePassing } from '@/lib/stage-config'
import { getPremiumSubscriptionStatus } from '@/lib/access'
import { getAntamTopicLabelMap } from '@/lib/antam-config'
import { Lock, Sparkles } from 'lucide-react'

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
  scoring?: string
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

  // Admin boleh membuka rapor peserta lain (bypass RLS via service client)
  const adminViewer = isAdmin(user.email)
  const readClient = adminViewer ? createServiceClient() : supabase

  const { data: attemptData } = await readClient
    .from('attempts').select('*').eq('id', attemptId).single()

  const attempt = attemptData as AttemptRow | null
  if (!attempt) redirect('/')
  if (attempt.user_id !== user.id && !adminViewer) redirect('/')
  if (attempt.status === 'ongoing' && !adminViewer) redirect(`/ujian/${attempt.package_id}`)

  const { data: pkgData } = await readClient
    .from('packages').select('name, total_questions, category, is_free, slug').eq('id', attempt.package_id).single()
  const pkg = pkgData as { name: string; total_questions: number; category: string; is_free: boolean; slug: string } | null

  // Info peserta jika dibuka oleh admin
  let participantInfo: { full_name: string | null; email: string | null } | null = null
  if (adminViewer && attempt.user_id !== user.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: uData } = await (readClient.from('users') as any)
      .select('full_name, email')
      .eq('id', attempt.user_id)
      .maybeSingle()
    participantInfo = uData
  }

  // Label sub-materi untuk paket ANTAM (ganti kode T1..Tn jadi nama topik)
  const antamLabels = pkg?.category === 'ANTAM'
    ? getAntamTopicLabelMap(pkg?.slug ?? '')
    : undefined

  // Blur hasil untuk non-premium yang mengerjakan paket GRATIS (demo)
  // Admin tidak pernah kena blur
  const premiumStatus = await getPremiumSubscriptionStatus(attempt.user_id)
  const showBlur = !adminViewer && pkg?.is_free === true && !premiumStatus.active

  // Konfigurasi tahap gabungan (package_sections) + evaluasi passing grade
  let stageSections: Awaited<ReturnType<typeof fetchStageSections>> = []
  let stageGroups: ReturnType<typeof evaluateStagePassing>['groups'] = []
  let stageOverall: ReturnType<typeof evaluateStagePassing>['overall'] = 'none'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawAttemptDetails = (attempt as any).score_details as ScoreDetails | null | undefined
  try {
    stageSections = await fetchStageSections(readClient, attempt.package_id)
    if (stageSections.length > 0) {
      const ev = evaluateStagePassing(stageSections, rawAttemptDetails as Record<string, unknown> | null)
      stageGroups = ev.groups
      stageOverall = ev.overall
    }
  } catch { /* package_sections belum tersedia */ }

  // ─── STATASTIK GLOBAL (RANK & RATA-RATA PEER) ───
  let globalRank = 0
  let globalTotal = 0
  
  // Peer subtest stats
  const peerSubtestStats: Record<string, { totalPct: number; count: number }> = {}

  const service = createServiceClient()
  const { data: allAttemptsData } = await service
    .from('attempts')
    .select('user_id, score, started_at, duration_seconds, score_details')
    .eq('package_id', attempt.package_id)
    .eq('status', 'finished')
    .not('score', 'is', null)
  
  const allAttempts = (allAttemptsData ?? []) as (LeaderboardAttempt & { score_details?: ScoreDetails | null })[]
  const entries = buildLeaderboard(allAttempts, 'first')
  
  let allDummies: LeaderboardDummy[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dummyData } = await (service.from('leaderboard_entries') as any)
      .select('id, display_name, score, duration_seconds')
      .eq('package_id', attempt.package_id)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    allDummies = (dummyData ?? []) as LeaderboardDummy[]
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
  const allRows = mergeLeaderboard(realRows, allDummies)
  globalTotal = allRows.length
  const idx = allRows.findIndex((r) => r.user_id === attempt.user_id)
  if (idx >= 0) globalRank = idx + 1

  // Hitung rata-rata peer per subtest (mengabaikan nilai 0)
  allAttempts.forEach(a => {
    if (a.score_details?.categories) {
      Object.entries(a.score_details.categories).forEach(([code, catStat]) => {
        const totalItems = catStat.correct + catStat.wrong + catStat.empty
        if (totalItems > 0) {
          const pct = Math.round((catStat.correct / totalItems) * 100)
          if (pct > 0) {
            if (!peerSubtestStats[code]) peerSubtestStats[code] = { totalPct: 0, count: 0 }
            peerSubtestStats[code].totalPct += pct
            peerSubtestStats[code].count++
          }
        }
      })
    }
  })

  let leaderboardRows: LeaderboardRow[] = []
  let myRow: LeaderboardRow | null = null

  // Top 10 + nama peserta (real user)
  const topRows = allRows.slice(0, 10)
  const realTopIds = topRows.filter((r) => r.user_id).map((r) => r.user_id!) as string[]
  const myRaw = allRows.find((r) => r.user_id === attempt.user_id) ?? null
  const myIds = Array.from(new Set([...realTopIds, ...(myRaw?.user_id ? [myRaw.user_id] : [])]))
  leaderboardRows = topRows
  if (myIds.length > 0) {
    const { data: usersData } = await service
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

  // Soal + pembahasan (tidak dikirim ke non-premium pada paket gratis - anti inspect)
  let questionsData: QuestionWithAnswer[] | null = null
  if (!showBlur) {
    const { data: qData, error: qErr } = await readClient
      .from('questions')
      .select('id, content, options, correct_answer, explanation, explanation_image_url, category, image_url, order_index')
      .eq('package_id', attempt.package_id)
      .order('order_index', { ascending: true })
    if (qErr) {
      const { data: qFallback } = await readClient
        .from('questions')
        .select('id, content, options, correct_answer, explanation, category, image_url, order_index')
        .eq('package_id', attempt.package_id)
        .order('order_index', { ascending: true })
      questionsData = ((qFallback ?? []) as Omit<QuestionWithAnswer, 'explanation_image_url'>[]).map((q) => ({ ...q, explanation_image_url: null }))
    } else {
      questionsData = (qData ?? []) as QuestionWithAnswer[]
    }
  }

  // Sort: urutan sub-tes dulu (sesuai definisi ASTRA/PLN/tahap), lalu order_index
  const subtestOrder =
    stageSections.length > 0 ? stageSections.map((s) => s.kode) :
    pkg?.category === 'ASTRA' ? Object.keys(ASTRA_SUBTESTS) :
    pkg?.category === 'PLN'   ? Object.keys(PLN_SUBTESTS)   : []

  const questions = (questionsData ?? []).sort((a, b) => {
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

  // Denominator & persen ring sesuai tipe.
  // Jika maxScore tersedia (ASTRA/ANTAM/PLN-negative), pakai skala skor mentah.
  // Jika tidak, pakai akurasi benar/total (kompatibel hasil lama).
  let denom = '/ 100'
  let pct = Math.min(100, Math.max(0, score))
  const maxScore = typeof sd?.maxScore === 'number' && sd.maxScore > 0 ? sd.maxScore : 0
  if (maxScore) {
    denom = `/ ${maxScore}`
    pct = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)))
  } else if (sd?.type === 'ASTRA' || sd?.type === 'ANTAM') {
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
  const isNegativeMarking = sd?.scoring === 'plus4-minus1'

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

      {/* ══ Banner Mode Admin ══ */}
      {adminViewer && attempt.user_id !== user.id && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shrink-0">
              Admin Mode
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-amber-950 truncate">
                Rapor Peserta: {participantInfo?.full_name || 'Tanpa Nama'}
              </p>
              <p className="text-xs text-amber-700 font-mono truncate">
                {participantInfo?.email || attempt.user_id} · Percobaan ke-{(attempt as AttemptRow & { attempt_number?: number }).attempt_number ?? 1}
              </p>
            </div>
          </div>
          <Link
            href="/admin/sessions"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-amber-900 text-white hover:bg-black transition-colors shrink-0 flex items-center gap-1.5"
          >
            ← Kembali ke Sesi Admin
          </Link>
        </div>
      )}

      {/* ══ HERO ══ */}
      <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="px-6 sm:px-8 py-7 text-white" style={{ background: pkg?.category === 'ANTAM' ? 'linear-gradient(135deg,#1a472a,#0d2818)' : 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <div className="flex flex-row items-start gap-3 sm:gap-6">
            {/* Ring skor */}
            <div className="relative w-[80px] h-[80px] sm:w-[128px] sm:h-[128px] shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 128 128" className="-rotate-90">
                <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="11" />
                <circle cx="64" cy="64" r={R} fill="none" stroke="#34D399" strokeWidth="11" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-[22px] sm:text-[34px] leading-none tabular-nums">{score}</span>
                <span className="text-[9px] sm:text-[11px] text-white/60 mt-0.5">{denom}</span>
              </div>
            </div>
            {/* Teks */}
            <div className="text-left flex-1 min-w-0">
              <p className="text-white/55 text-xs uppercase tracking-wider font-semibold mb-1">{pkg?.name ?? 'Hasil Simulasi'}</p>
              <h1 className="text-xl sm:text-2xl font-extrabold mb-1.5">{t.title}</h1>
              <p className="text-white/70 text-sm max-w-md">{t.note}</p>
              <div className="inline-flex items-center gap-1.5 mt-3 bg-white/10 rounded-full px-3 py-1 text-xs">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                {attempt.duration_seconds ? formatDuration(attempt.duration_seconds) : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Strip benar/salah/kosong */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 bg-white">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-[#00315f]" />, k: correct, l: 'Benar' },
            { icon: <XCircle className="w-4 h-4 text-red-500" />, k: wrong, l: 'Salah' },
            { icon: <MinusCircle className="w-4 h-4 text-slate-500" />, k: empty, l: 'Kosong' },
          ].map((s) => (
            <div key={s.l} className="flex items-center justify-center gap-2.5 py-3.5">
              {s.icon}
              <span className="font-bold text-lg text-slate-900 tabular-nums">{s.k}</span>
              <span className="text-slate-500 text-sm">{s.l}</span>
            </div>
          ))}
        </div>
        {isNegativeMarking && (
          <p className="bg-white border-t border-slate-200 px-5 py-2.5 text-xs text-slate-500">
            Sistem penilaian Akademik: <strong className="text-slate-700">Benar +4 · Salah −1 · Kosong 0</strong>
          </p>
        )}
      </div>

      {/* ══ Rincian per sub-tes & Leaderboard (Semua Paket) ══ */}
      {(subtests.length > 0 || leaderboardRows.length > 0) && (
        <div className={`grid grid-cols-1 ${subtests.length > 0 && !showBlur ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-5 items-stretch`}>
          {/* ══ Rincian per sub-tes (premium only) - Kolom 1-3 ══ */}
          {!showBlur && subtests.length > 0 && (
            <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col lg:col-span-3`}>
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Rincian per sub-tes</SectionLabel>
                {weakest && (
                  <span className="text-[11px] text-slate-500">
                    Terlemah: <b className="text-slate-900">{antamLabels?.[weakest.code] ?? SUBTEST_FULL[weakest.code] ?? weakest.code}</b>
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {subtests.map((s) => {
                  let label = antamLabels?.[s.code] ?? (SUBTEST_FULL[s.code] && SUBTEST_FULL[s.code] !== s.code ? `${s.code} - ${SUBTEST_FULL[s.code]}` : s.code)
                  if (s.code.toUpperCase().startsWith('TKD1')) label = 'TKD 1 - Deret Bilangan'
                  if (s.code.toUpperCase().startsWith('TKD2')) label = 'TKD 2 - Silogisme & Sinonim'
                  const peerStats = peerSubtestStats[s.code]
                  const peerAvg = peerStats && peerStats.count > 0 ? Math.round(peerStats.totalPct / peerStats.count) : null

                  return (
                    <div key={s.code} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-1.5 border-b border-slate-100 last:border-0">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-[13px] text-slate-800 font-semibold truncate block" title={label}>
                          {label}
                        </span>
                        {peerAvg !== null && (
                          <span className="text-[10px] text-slate-500">
                            Rata-rata peserta lain: <strong className="text-slate-700">{peerAvg}%</strong>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="w-24 sm:w-44 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-200/60">
                          <span className="block h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.pct < 60 ? '#F59E0B' : '#10B981' }} />
                        </span>
                        <span className="w-14 text-right text-xs text-slate-500 shrink-0 tabular-nums">{s.correct}/{s.total}</span>
                        <span className="w-10 text-right font-bold text-xs text-slate-900 shrink-0 tabular-nums">{s.pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ══ Leaderboard Global - Kolom 4 (1 kolom paling kanan) ══ */}
          <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col ${subtests.length > 0 && !showBlur ? 'lg:col-span-1' : 'w-full'}`}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                <LeaderboardIllustration className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-900 leading-tight">Peringkat Nasional</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {globalRank > 0 ? (
                    <>Rank <b className="text-brand font-bold">#{globalRank}</b> <span className="text-slate-400">/ {globalTotal}</span></>
                  ) : (
                    <>Belum ada peserta</>
                  )}
                </p>
              </div>
            </div>

            {/* Daftar peringkat - scrollable di dalam card tanpa pindah halaman */}
            <div className="flex-1 space-y-1 max-h-[230px] overflow-y-auto pr-1">
              {leaderboardRows.map((entry, i) => {
                const rank = i + 1
                const isMe = entry.user_id === attempt.user_id
                const medalCls =
                  rank === 1 ? 'bg-amber-100 text-amber-700'
                  : rank === 2 ? 'bg-slate-200 text-slate-700'
                  : rank === 3 ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-50 text-slate-500'
                return (
                  <div
                    key={entry.key}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border text-xs ${
                      isMe ? 'bg-brand/10 border-brand/30' : 'border-transparent hover:bg-slate-50'
                    }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${medalCls}`}>
                        {rank}
                      </span>
                      <span className="flex-1 min-w-0 truncate font-medium text-slate-900">
                        {entry.display_name || 'Anonim'}
                        {isMe && <span className="ml-1 text-[10px] text-green-600 font-semibold">(kamu)</span>}
                      </span>
                      <span className={`font-bold text-xs shrink-0 tabular-nums ${entry.score >= 75 ? 'text-green-600' : 'text-slate-900'}`}>
                        {entry.score}
                      </span>
                    </div>
                  )
                })}
                {leaderboardRows.length === 0 && (
                  <p className="text-center text-[11px] text-slate-500 py-4">Belum ada peserta.</p>
                )}
              </div>

              {/* Rank kamu jika berada di luar daftar atas */}
              {myRow && globalRank > leaderboardRows.length && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-brand/10 border border-brand/20 text-xs">
                    <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {globalRank}
                    </span>
                    <span className="flex-1 min-w-0 truncate font-medium text-brand-700">
                      {myRow.display_name || 'Anonim'} <span className="text-[10px] text-brand-600 font-semibold">(kamu)</span>
                    </span>
                    <span className={`font-bold text-xs shrink-0 tabular-nums ${myRow.score >= 75 ? 'text-brand-600' : 'text-brand-700'}`}>
                      {myRow.score}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-1.5 text-center">
                Skor percobaan pertama
              </p>
            </div>
            
            {/* ══ Sebaran Nilai (Bell Curve) Placeholder ══ */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Sebaran Nilai Nasional</SectionLabel>
              </div>
              <div className="h-32 bg-slate-50 border border-slate-100 rounded-xl flex items-end justify-center px-4 pb-2 pt-6 relative overflow-hidden">
                {/* Fake Bell Curve Bars */}
                <div className="flex items-end gap-1 w-full h-full opacity-40 justify-between">
                  {[2, 5, 12, 25, 45, 75, 90, 100, 85, 60, 30, 15, 6, 2].map((h, idx) => (
                    <div key={idx} className="flex-1 bg-brand/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-slate-500 mb-1">Distribusi Nilai Keseluruhan</span>
                  <span className="text-[10px] text-slate-400 max-w-[200px] leading-tight">Grafik sebaran nilai populasi sedang dalam pengembangan (Coming Soon)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Aksi ══ */}
      <div className="grid grid-cols-3 gap-3">
        {adminViewer && attempt.user_id !== user.id ? (
          <Link
            href="/admin/sessions"
            className="flex items-center justify-center gap-2 py-3 text-white text-sm font-bold rounded-xl transition-colors bg-slate-900 hover:bg-slate-800"
          >
            ← Sesi Admin
          </Link>
        ) : (
          <Link href={`/persiapan/${attempt.package_id}`} className="flex items-center justify-center gap-2 py-3 text-white text-sm font-bold rounded-xl transition-colors" style={{ background: 'linear-gradient(to right,#00315f,#16487e)' }}>
            <RotateCcw className="w-4 h-4" /> Coba Lagi
          </Link>
        )}
        <Link href={pkg?.category === 'ANTAM' ? '/portal/antam' : pkg?.category === 'ASTRA' ? '/portal/astra' : '/paket'} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200/90 text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
          <Grid2x2 className="w-4 h-4" /> Paket Lain
        </Link>
        <Link href="/" className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200/90 text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
          <LayoutDashboard className="w-4 h-4" /> Beranda
        </Link>
      </div>

      {/* ══ Upsell premium (paket gratis, non-premium) ══ */}
      {showBlur && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm">
          <div className="px-6 py-8 text-white text-center" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white/80" />
            </div>
            <h2 className="font-extrabold text-lg">Buka Analisis &amp; Pembahasan Lengkap</h2>
            <p className="text-white/65 text-sm mt-1.5 max-w-sm mx-auto">
              Rincian per sub-tes, passing grade, dan pembahasan semua soal tersedia untuk member Premium.
            </p>
            <Link href="/harga" className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-[#00315f] text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors">
              <Sparkles className="w-4 h-4" /> Upgrade ke Premium
            </Link>
          </div>
        </div>
      )}

      {/* ══ Review pembahasan (premium only) ══ */}
      {!showBlur && (
        <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm">
          <div className="bg-slate-900 px-5 py-3.5">
            <h2 className="font-bold text-white text-sm">Review Pembahasan</h2>
            <p className="text-white/55 text-xs mt-0.5">Pelajari tiap soal untuk menutup kelemahanmu.</p>
          </div>
          <div className="bg-slate-50 p-3 sm:p-4">
            <HasilReview questions={questions} userAnswers={userAnswers} categoryLabels={antamLabels} />
          </div>
        </div>
      )}
    </div>
  )
}
