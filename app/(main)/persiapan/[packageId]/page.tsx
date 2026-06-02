import type React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Clipboard, Clock, Trophy, BarChart2, Lock, Wifi, Lightbulb } from 'lucide-react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { computeScore, isAttemptExpired, ASTRA_SUBTESTS } from '@/lib/exam-scoring'
import { checkPackageAccess } from '@/lib/access'
import { PersiapanActions } from '@/components/persiapan/PersiapanActions'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface OngoingInfo {
  id: string
  answeredCount: number
  startedAt: string
}

// ── Konstanta sub-tes badge warna (untuk kartu sub-tes) ──────────────────────
const SUBTEST_COLORS: Record<string, string> = {
  QR:  'bg-orange-100 text-orange-700 border-orange-200',
  DR:  'bg-amber-100 text-amber-700 border-amber-200',
  RC:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  IR:  'bg-red-100 text-red-600 border-red-200',
  VIZ: 'bg-rose-100 text-rose-600 border-rose-200',
  PS:  'bg-pink-100 text-pink-600 border-pink-200',
  WM:  'bg-purple-100 text-purple-600 border-purple-200',
}

export default async function PersiapanPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: pkgData } = await supabase
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .eq('is_published', true)
    .single()

  const pkg = pkgData as PackageRow | null
  if (!pkg) redirect('/paket')

  const accessStatus = await checkPackageAccess(user.id, packageId, pkg.is_free, pkg.slug)
  if (accessStatus === 'locked') {
    if (pkg.category === 'ASTRA') redirect('/portal/astra')
    else redirect('/harga')
  }

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

    if (isAttemptExpired(o.started_at, pkg!.duration_minutes)) {
      try {
        const serviceClient = createServiceClient()
        const pkgCategory = pkg!.category
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: questionsData } = await (serviceClient.from('questions') as any)
          .select('id, correct_answer, category, options')
          .eq('package_id', packageId)
        const answers = (o.answers ?? {}) as Record<string, string>
        const { score, correctCount, wrongCount, emptyCount, scoreDetails } = computeScore(
          (questionsData ?? []) as { id: string; correct_answer: string; category?: string; options?: { key: string; text: string; point?: number }[] }[],
          answers,
          pkgCategory
        )
        const durationSeconds = Math.floor((Date.now() - new Date(o.started_at).getTime()) / 1000)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (serviceClient.from('attempts') as any)
          .update({ status: 'finished', score, correct_count: correctCount, wrong_count: wrongCount, empty_count: emptyCount, duration_seconds: durationSeconds, finished_at: new Date().toISOString(), score_details: scoreDetails })
          .eq('id', o.id)
        console.log(`[Persiapan] Auto-finished expired attempt ${o.id}, score: ${score}`)
      } catch (err) {
        console.error('[Persiapan] Auto-finish error:', err)
      }
      ongoingInfo = null
    } else {
      const answers = (o.answers ?? {}) as Record<string, string>
      ongoingInfo = { id: o.id, answeredCount: Object.keys(answers).length, startedAt: o.started_at }
    }
  }

  const isAstra = pkg.category === 'ASTRA'
  const backHref = isAstra ? '/portal/astra' : '/paket'
  const backLabel = isAstra ? 'Portal ASTRA' : 'Paket Soal'

  // Hitung total durasi dari sub-tes aktual (lebih akurat dari pkg.duration_minutes)
  const displayDuration = isAstra
    ? Object.values(ASTRA_SUBTESTS).reduce((sum, s) => sum + s.minutes, 0)
    : pkg.duration_minutes

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <Breadcrumb items={[
        { label: backLabel, href: backHref },
        { label: pkg.name, href: undefined },
        { label: 'Persiapan' },
      ]} />

      {/* ── Hero card ── */}
      <div className="bg-white rounded-3xl border border-hairline overflow-hidden shadow-soft">
        {/* Header navy */}
        <div className="px-7 py-8 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isAstra && (
                  <span className="px-2.5 py-0.5 bg-white/15 text-white text-xs font-bold rounded-full border border-white/20">Psikotes ASTRA</span>
                )}
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  pkg.is_free ? 'bg-brand text-white' : 'bg-amber-400 text-ink'
                }`}>
                  {pkg.is_free ? 'GRATIS' : '✦ PREMIUM'}
                </span>
              </div>
              <h1 className="text-2xl font-heading font-extrabold leading-snug">{pkg.name}</h1>
              {pkg.description && (
                <p className="text-white/60 text-sm mt-2 max-w-lg leading-relaxed">{pkg.description}</p>
              )}
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white/80" />
            </div>
          </div>

          {/* Stats row — durasi pakai total aktual sub-tes */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {([
              { icon: <Clipboard className="w-5 h-5 text-brand-300" />, label: 'Soal', value: `${pkg.total_questions}` },
              { icon: <Clock className="w-5 h-5 text-brand-300" />, label: 'Durasi', value: `${displayDuration} mnt` },
              { icon: <Trophy className="w-5 h-5 text-brand-300" />, label: 'Skor Max', value: `${pkg.total_questions}` },
              { icon: <BarChart2 className="w-5 h-5 text-brand-300" />, label: 'Sub-tes', value: isAstra ? '7' : '-' },
            ] as { icon: React.ReactNode; label: string; value: string }[]).map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className="flex justify-center mb-0.5">{s.icon}</div>
                <p className="text-white font-num font-bold text-sm leading-none mt-0.5">{s.value}</p>
                <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-6">

          {/* Sub-tes breakdown (ASTRA) — compact, 4 kolom */}
          {isAstra && (
            <div>
              <h2 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Pembagian Sub-tes</h2>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {Object.entries(ASTRA_SUBTESTS).map(([key, sub]) => (
                  <div key={key} className="rounded-xl border border-hairline bg-paper-soft p-2 text-center">
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md border mb-1 ${SUBTEST_COLORS[key] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {key}
                    </span>
                    <p className="text-base font-num font-extrabold text-ink leading-none">{sub.soal}</p>
                    <p className="text-[9px] text-ink-muted mt-0.5 font-num">{sub.minutes} mnt</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tata tertib — bookmark dihapus untuk ASTRA (soal satu arah, tidak bisa kembali) */}
          <div>
            <h2 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Sebelum Memulai</h2>
            <div className="space-y-2">
              {([
                { icon: <Clock className="w-4 h-4 text-brand" />, text: `Waktu ujian ${displayDuration} menit dan terus berjalan setelah dimulai`, show: true },
                { icon: <Lock className="w-4 h-4 text-ink-muted" />, text: 'Jawaban tidak bisa diubah dan tidak bisa kembali ke soal sebelumnya', show: true },
                { icon: <Wifi className="w-4 h-4 text-brand" />, text: 'Pastikan koneksi internet stabil selama ujian', show: true },
                { icon: <Lightbulb className="w-4 h-4 text-amber-500" />, text: 'Baca soal dengan teliti sebelum menjawab', show: true },
              ] as { icon: React.ReactNode; text: string; show: boolean }[])
                .filter((item) => item.show)
                .map((item) => (
                  <div key={item.text} className="flex items-start gap-3 bg-paper rounded-xl px-4 py-3 text-sm border border-hairline">
                    <span className="shrink-0 mt-0.5">{item.icon}</span>
                    <p className="text-ink-soft leading-relaxed">{item.text}</p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── CTA section ── */}
      <div className="bg-white rounded-3xl border border-hairline p-6 shadow-soft space-y-4">
        <div className="text-center">
          <h3 className="font-heading font-bold text-ink">Siap Memulai?</h3>
          <p className="text-sm text-ink-muted mt-0.5">Timer akan berjalan begitu ujian dimulai</p>
        </div>

        <PersiapanActions
          packageId={packageId}
          pkgCategory={pkg.category}
          ongoingAttemptId={ongoingInfo?.id ?? null}
          ongoingAnsweredCount={ongoingInfo?.answeredCount ?? 0}
          ongoingStartedAt={ongoingInfo?.startedAt ?? null}
        />

        <Link
          href={backHref}
          className="block w-full text-center py-2.5 text-ink-muted text-sm hover:text-ink transition-colors"
        >
          ← Kembali ke {backLabel}
        </Link>
      </div>
    </div>
  )
}
