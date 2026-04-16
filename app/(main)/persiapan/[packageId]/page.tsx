import type React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Clipboard, Clock, Trophy, BarChart2, Lock, Wifi, Bookmark, Lightbulb } from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { computeScore, isAttemptExpired } from '@/lib/exam-scoring'
import { checkPackageAccess } from '@/lib/access'
import { PersiapanActions } from '@/components/persiapan/PersiapanActions'

interface OngoingInfo {
  id: string
  answeredCount: number
  startedAt: string
}

const SKD_SCORING_RULES_TWK_TIU = [
  { label: 'Benar', value: '+5', color: 'text-green-600' },
  { label: 'Salah', value: '0', color: 'text-gray-400' },
  { label: 'Kosong', value: '0', color: 'text-gray-400' },
]

const SKD_PASSING_GRADE = { TWK: 65, TIU: 80, TKP: 166, total: 311 }
const SKD_MAX = { TWK: 150, TIU: 175, TKP: 225, total: 550 }

const SKD_SUBTESTS = [
  { name: 'TWK', full: 'Tes Wawasan Kebangsaan', soal: 30, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'TIU', full: 'Tes Intelegensia Umum',  soal: 35, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'TKP', full: 'Tes Karakteristik Pribadi', soal: 45, color: 'bg-green-100 text-green-700 border-green-200' },
]

export default async function PersiapanPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Fetch package
  const { data: pkgData } = await supabase
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .eq('is_published', true)
    .single()

  const pkg = pkgData as PackageRow | null
  if (!pkg) redirect('/paket')

  // Cek akses: gratis, langganan aktif, atau beli satuan
  const accessStatus = await checkPackageAccess(user.id, packageId, pkg.is_free, pkg.category)
  if (accessStatus === 'locked') redirect('/harga')

  // Cek ongoing attempt
  const { data: ongoingData } = await supabase
    .from('attempts')
    .select('id, answers, started_at')
    .eq('user_id', user.id)
    .eq('package_id', packageId)
    .eq('status', 'ongoing')
    .maybeSingle()

  let ongoingInfo: OngoingInfo | null = null
  if (ongoingData) {
    const o = ongoingData as Pick<AttemptRow, 'id' | 'answers' | 'started_at'>

    // ── Guard: auto-finish jika waktu sudah habis ──────────────────────────
    if (isAttemptExpired(o.started_at, pkg!.duration_minutes)) {
      try {
        const serviceClient = createServiceClient()
        const isCpnsForScoring = pkg!.category === 'CPNS'

        // Ambil soal untuk hitung skor akhir
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: questionsData } = await (serviceClient.from('questions') as any)
          .select(isCpnsForScoring ? 'id, correct_answer, category, options' : 'id, correct_answer')
          .eq('package_id', packageId)

        const answers = (o.answers ?? {}) as Record<string, string>
        const { score, correctCount, wrongCount, emptyCount, scoreDetails } = computeScore(
          (questionsData ?? []) as { id: string; correct_answer: string; category?: string; options?: { key: string; text: string; point?: number }[] }[],
          answers,
          isCpnsForScoring
        )
        const durationSeconds = Math.floor(
          (Date.now() - new Date(o.started_at).getTime()) / 1000
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (serviceClient.from('attempts') as any)
          .update({
            status: 'finished',
            score,
            correct_count: correctCount,
            wrong_count: wrongCount,
            empty_count: emptyCount,
            duration_seconds: durationSeconds,
            finished_at: new Date().toISOString(),
            score_details: scoreDetails,
          })
          .eq('id', o.id)

        console.log(`[Persiapan] Auto-finished expired attempt ${o.id}, score: ${score}`)
      } catch (err) {
        // Jangan block render jika auto-finish gagal
        console.error('[Persiapan] Auto-finish error:', err)
      }
      // Sembunyikan sesi yang sudah expired — tampilkan sebagai mulai baru
      ongoingInfo = null
    } else {
      // Sesi masih aktif
      const answers = (o.answers ?? {}) as Record<string, string>
      ongoingInfo = {
        id: o.id,
        answeredCount: Object.keys(answers).length,
        startedAt: o.started_at,
      }
    }
  }

  const isCpns = pkg.category === 'CPNS'
  const backHref = isCpns ? '/portal/cpns' : '/paket'
  const backLabel = isCpns ? 'Portal CPNS' : 'Paket Soal'

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href={backHref} className="hover:text-blue-600 transition-colors">{backLabel}</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium truncate">{pkg.name}</span>
        <span>›</span>
        <span className="text-gray-400">Persiapan</span>
      </nav>

      {/* ── Hero card ── */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-7 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isCpns && (
                  <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">SKD CPNS</span>
                )}
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  pkg.is_free ? 'bg-green-400 text-white' : 'bg-amber-400 text-gray-900'
                }`}>
                  {pkg.is_free ? 'GRATIS' : '✦ PREMIUM'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white leading-snug">{pkg.name}</h1>
              {pkg.description && (
                <p className="text-blue-200 text-sm mt-2 max-w-lg leading-relaxed">{pkg.description}</p>
              )}
            </div>
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white/80" />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {([
              { icon: <Clipboard className="w-5 h-5 text-blue-200" />, label: 'Soal', value: `${pkg.total_questions}` },
              { icon: <Clock className="w-5 h-5 text-blue-200" />, label: 'Durasi', value: `${pkg.duration_minutes} menit` },
              { icon: <Trophy className="w-5 h-5 text-blue-200" />, label: 'Skor Max', value: isCpns ? '550' : '100' },
              { icon: <BarChart2 className="w-5 h-5 text-blue-200" />, label: 'Passing', value: isCpns ? `${SKD_PASSING_GRADE.total}` : '75' },
            ] as { icon: React.ReactNode; label: string; value: string }[]).map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className="flex justify-center mb-0.5">{s.icon}</div>
                <p className="text-white font-bold text-sm leading-none mt-0.5">{s.value}</p>
                <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-6">

          {/* Sub-tes breakdown (CPNS only) */}
          {isCpns && (
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Pembagian Sub-tes SKD</h2>
              <div className="grid grid-cols-3 gap-3">
                {SKD_SUBTESTS.map((sub) => {
                  const pg = SKD_PASSING_GRADE[sub.name as keyof typeof SKD_PASSING_GRADE] as number
                  const max = SKD_MAX[sub.name as keyof typeof SKD_MAX] as number
                  return (
                    <div key={sub.name} className={`rounded-2xl border-2 p-4 text-center ${sub.color.split(' ')[0]} border-opacity-50`} style={{borderColor: 'inherit'}}>
                      <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${sub.color} mb-2`}>{sub.name}</span>
                      <p className="text-2xl font-extrabold text-gray-900">{sub.soal}</p>
                      <p className="text-xs text-gray-500">soal</p>
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-[10px] text-gray-400">Passing grade</p>
                        <p className="text-xs font-bold text-gray-700">≥ {pg} <span className="font-normal text-gray-400">/ {max}</span></p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">Total passing grade SKD</span>
                <span className="font-extrabold text-blue-900">≥ {SKD_PASSING_GRADE.total} / {SKD_MAX.total}</span>
              </div>
            </div>
          )}

          {/* Sistem penilaian */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Sistem Penilaian</h2>
            {isCpns ? (
              <div className="grid grid-cols-2 gap-3">
                {/* TWK & TIU */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2.5">TWK & TIU</p>
                  {SKD_SCORING_RULES_TWK_TIU.map((rule) => (
                    <div key={rule.label} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{rule.label}</span>
                      <span className={`font-bold ${rule.color}`}>{rule.value}</span>
                    </div>
                  ))}
                </div>
                {/* TKP */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2.5">TKP</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Nilai per opsi</span>
                    <span className="font-bold text-green-600">1 – 5</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Kosong</span>
                    <span className="font-bold text-gray-400">0</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-green-600 shrink-0" />
                      <p className="text-[11px] text-green-600 font-semibold">Tidak ada penalti — isi semua soal TKP!</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex gap-6 text-sm">
                <div><span className="text-green-600 font-bold">✓ Benar</span><p className="text-xs text-gray-500 mt-0.5">poin ditambah</p></div>
                <div><span className="text-red-500 font-bold">✗ Salah</span><p className="text-xs text-gray-500 mt-0.5">poin dikurangi</p></div>
                <div><span className="text-gray-400 font-bold">— Kosong</span><p className="text-xs text-gray-500 mt-0.5">tidak berpengaruh</p></div>
              </div>
            )}
          </div>

          {/* Tata tertib */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Sebelum Memulai</h2>
            <div className="space-y-2">
              {([
                { icon: <Clock className="w-4 h-4 text-blue-500" />, text: `Waktu ujian ${pkg.duration_minutes} menit dan terus berjalan setelah dimulai` },
                { icon: <Lock className="w-4 h-4 text-gray-500" />, text: 'Jawaban tidak bisa diubah setelah di-submit' },
                { icon: <Wifi className="w-4 h-4 text-cyan-500" />, text: 'Pastikan koneksi internet stabil selama ujian' },
                { icon: <Bookmark className="w-4 h-4 text-amber-500" />, text: 'Gunakan fitur tandai (bookmark) untuk soal yang ingin ditinjau kembali' },
                isCpns
                  ? { icon: <Lightbulb className="w-4 h-4 text-yellow-500" />, text: 'Strategi: kerjakan TKP dulu, lalu TWK dan TIU — tidak ada penalti di TKP' }
                  : { icon: <Lightbulb className="w-4 h-4 text-yellow-500" />, text: 'Baca soal dengan teliti sebelum menjawab' },
              ] as { icon: React.ReactNode; text: string }[]).map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3 text-sm">
                  <span className="shrink-0 mt-0.5">{item.icon}</span>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA section ── */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-gray-900">Siap Memulai?</h3>
          <p className="text-sm text-gray-400 mt-0.5">Timer akan berjalan begitu ujian dimulai</p>
        </div>

        <PersiapanActions
          packageId={packageId}
          ongoingAttemptId={ongoingInfo?.id ?? null}
          ongoingAnsweredCount={ongoingInfo?.answeredCount ?? 0}
          ongoingStartedAt={ongoingInfo?.startedAt ?? null}
        />

        <Link
          href={backHref}
          className="block w-full text-center py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          ← Kembali ke {backLabel}
        </Link>
      </div>
    </div>
  )
}
