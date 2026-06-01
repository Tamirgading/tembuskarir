import type React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Clipboard, Clock, Trophy, BarChart2, Lock, Wifi, Bookmark, Lightbulb } from 'lucide-react'
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
  const accessStatus = await checkPackageAccess(user.id, packageId, pkg.is_free)
  if (accessStatus === 'locked') {
    if (pkg.category === 'ASTRA') redirect('/portal/astra')
    else redirect('/harga')
  }

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
        const pkgCategory = pkg!.category

        // Ambil soal untuk hitung skor akhir
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

  const isAstra = pkg.category === 'ASTRA'
  const backHref = isAstra ? '/portal/astra' : '/paket'
  const backLabel = isAstra ? 'Portal ASTRA' : 'Paket Soal'

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Breadcrumb */}
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
                  <span className="px-2.5 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">Psikotes ASTRA</span>
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

          {/* Stats row */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {([
              { icon: <Clipboard className="w-5 h-5 text-brand-300" />, label: 'Soal', value: `${pkg.total_questions}` },
              { icon: <Clock className="w-5 h-5 text-brand-300" />, label: 'Durasi', value: `${pkg.duration_minutes} mnt` },
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

          {/* Sub-tes breakdown (ASTRA) */}
          {isAstra && (
            <div>
              <h2 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Pembagian Sub-tes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(ASTRA_SUBTESTS).map(([key, sub]) => (
                  <div key={key} className="rounded-xl border border-hairline bg-paper p-3 text-center">
                    <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 mb-1.5">
                      {key}
                    </span>
                    <p className="text-lg font-num font-extrabold text-ink">{sub.soal}</p>
                    <p className="text-[10px] text-ink-muted">soal · {sub.minutes} mnt</p>
                    <p className="text-[10px] text-ink-soft mt-1 leading-tight">{sub.full}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sistem penilaian */}
          <div>
            <h2 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Sistem Penilaian</h2>
            {isAstra ? (
              <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-2.5">Semua Sub-tes</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">Benar</span>
                  <span className="font-num font-bold text-brand">+1</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">Salah</span>
                  <span className="font-num font-bold text-ink-muted">0</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">Kosong</span>
                  <span className="font-num font-bold text-ink-muted">0</span>
                </div>
                <div className="mt-2 pt-2 border-t border-brand/15">
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-brand shrink-0" />
                    <p className="text-[11px] text-brand-700 font-semibold">Tidak ada penalti — jawab semua soal!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-paper border border-hairline rounded-2xl p-4 flex gap-6 text-sm">
                <div><span className="text-brand font-bold">✓ Benar</span><p className="text-xs text-ink-muted mt-0.5">poin ditambah</p></div>
                <div><span className="text-red-500 font-bold">✗ Salah</span><p className="text-xs text-ink-muted mt-0.5">poin dikurangi</p></div>
                <div><span className="text-ink-muted font-bold">— Kosong</span><p className="text-xs text-ink-muted mt-0.5">tidak berpengaruh</p></div>
              </div>
            )}
          </div>

          {/* Tata tertib */}
          <div>
            <h2 className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Sebelum Memulai</h2>
            <div className="space-y-2">
              {([
                { icon: <Clock className="w-4 h-4 text-brand" />, text: `Waktu ujian ${pkg.duration_minutes} menit dan terus berjalan setelah dimulai` },
                { icon: <Lock className="w-4 h-4 text-ink-muted" />, text: 'Jawaban tidak bisa diubah setelah di-submit' },
                { icon: <Wifi className="w-4 h-4 text-brand" />, text: 'Pastikan koneksi internet stabil selama ujian' },
                { icon: <Bookmark className="w-4 h-4 text-amber-500" />, text: 'Gunakan fitur tandai (bookmark) untuk soal yang ingin ditinjau kembali' },
                { icon: <Lightbulb className="w-4 h-4 text-amber-500" />, text: 'Baca soal dengan teliti sebelum menjawab' },
              ] as { icon: React.ReactNode; text: string }[]).map((item) => (
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
