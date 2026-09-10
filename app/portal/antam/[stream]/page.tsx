import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Clock, FileText, Sparkles, Lock,
  TrendingUp,
} from 'lucide-react'
import Image from 'next/image'
import { AntamKisiKisiModal } from '@/components/antam/AntamKisiKisiModal'
import { createClient } from '@/lib/supabase/server'
import { getStreamBySlug, getStreamImage } from '@/lib/antam-config'
import { checkPackageAccess } from '@/lib/access'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

const SCORE_COLORS = [
  'bg-sky-50 border-sky-100 text-sky-700',
  'bg-emerald-50 border-emerald-100 text-emerald-700',
  'bg-amber-50 border-amber-100 text-amber-700',
]

export default async function AntamStreamPage({
  params,
}: {
  params: Promise<{ stream: string }>
}) {
  const { stream: streamSlug } = await params
  const stream = getStreamBySlug(streamSlug)
  if (!stream) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgData } = await (supabase.from('packages') as any)
    .select('*')
    .eq('category', 'ANTAM')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
  const packages = (pkgData ?? []) as PackageRow[]

  const prefix = stream.slug
  const streamPkgs = packages
    .filter((p) => p.slug === prefix || p.slug.startsWith(`${prefix}-paket-`))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  const packageLabel = (slug: string): string | null => {
    if (slug === stream.slug) return null
    const suffix = slug.slice(`${stream.slug}-paket-`.length)
    return `Paket ${suffix}`
  }

  // Akses, skor per paket, dan riwayat attempt untuk stream ini (butuh login)
  const accessMap: Record<string, string> = {}
  const bestScores: Record<string, number> = {}
  let streamAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  if (user) {
    await Promise.all(streamPkgs.map(async (p) => {
      const status = await checkPackageAccess(user.id, p.id, p.is_free, p.slug)
      accessMap[p.id] = status
    }))

    if (streamPkgs.length > 0) {
      const pkgIds = streamPkgs.map((p) => p.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: attemptsData } = await (supabase.from('attempts') as any)
        .select('id, package_id, score, started_at')
        .eq('user_id', user.id)
        .eq('status', 'finished')
        .in('package_id', pkgIds)
        .order('started_at', { ascending: false })

      if (attemptsData) {
        streamAttempts = attemptsData.slice(0, 10) as Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[]
        for (const att of attemptsData as { package_id: string; score: number | null }[]) {
          if (att.score !== null && att.score !== undefined) {
            bestScores[att.package_id] = Math.max(bestScores[att.package_id] ?? 0, att.score)
          }
        }
      }
    }
  }

  // Trend data untuk line chart (kronologis dari terlama ke terbaru)
  const trendAttempts = [...streamAttempts].reverse()
  const trend = trendAttempts.map((a, i) => {
    const pkg = streamPkgs.find((p) => p.id === a.package_id)
    const pLabel = pkg ? (packageLabel(pkg.slug) ?? 'Paket 1') : 'Paket'
    return {
      d: formatDate(a.started_at),
      v: a.score ?? 0,
      label: `${pLabel} (#${i + 1})`,
    }
  })

  // Perhitungan koordinat SVG line chart
  const CW = 380, CH = 130, pL = 16, pR = 24, pT = 20, pB = 24
  const n = trend.length
  const scores = trend.map((t) => t.v)
  const lastScore = streamAttempts[0]?.score ?? 0
  const prevScore = streamAttempts[1]?.score ?? null
  const delta = prevScore !== null ? lastScore - prevScore : null
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const maxVal = Math.max(...scores, 40)
  const minVal = 0
  const rangeVal = Math.max(maxVal - minVal, 1)

  const xOf = (i: number) => pL + (n > 1 ? (i / (n - 1)) * (CW - pL - pR) : (CW - pL - pR) / 2)
  const yOf = (v: number) => pT + (1 - (v - minVal) / rangeVal) * (CH - pT - pB)

  const chartPts = trend.map((t, i) => ({ x: xOf(i), y: yOf(t.v), d: t.d, v: t.v, l: t.label }))
  const chartLine = chartPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const chartArea = chartPts.length > 0
    ? `M ${chartPts[0].x.toFixed(1)},${CH - pB} ` +
      chartPts.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
      ` L ${chartPts[n - 1].x.toFixed(1)},${CH - pB} Z`
    : ''

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Back + Header ── */}
      <div>
        <Link href="/portal/antam" className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" /> Semua Job Stream
        </Link>
      </div>

      <div className="rounded-3xl overflow-hidden border border-[#16487e]/40 shadow-xl relative">
        <div
          className="px-6 sm:px-8 py-7 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #071f3d 0%, #00315f 45%, #0f4c81 100%)' }}
        >
          {/* Ambient glow effects */}
          <div
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(56, 154, 221, 0.22)' }}
          />
          <div
            className="absolute left-1/4 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(0, 180, 216, 0.12)' }}
          />

          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold mb-2.5 border border-white/15 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                ANTAM IMPACT 2026 • STREAM {stream.code}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold leading-tight text-white">{stream.name}</h1>
              <p className="text-blue-100/80 text-sm mt-2 leading-relaxed max-w-xl">{stream.jurusan}</p>

              <div className="flex gap-3 sm:gap-4 mt-6 flex-wrap items-center">
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {[
                    { label: 'Paket Tersedia', value: String(streamPkgs.length) },
                    { label: 'Soal/Paket', value: streamPkgs[0] ? String(streamPkgs[0].total_questions) : '40' },
                    { label: 'Waktu', value: streamPkgs[0] ? `${streamPkgs[0].duration_minutes} mnt` : '50 mnt' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-center min-w-[76px] backdrop-blur-md shadow-xs">
                      <p className="text-white font-num font-bold text-sm">{s.value}</p>
                      <p className="text-blue-200/70 text-[10px] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {stream.topics && stream.topics.length > 0 && (
                  <AntamKisiKisiModal
                    streamName={stream.name}
                    streamCode={stream.code}
                    jurusan={stream.jurusan}
                    topics={stream.topics}
                  />
                )}
              </div>
            </div>

            {/* Ilustrasi Resmi Stream */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 shrink-0 self-center md:self-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25 bg-white/10 backdrop-blur-md">
              <Image
                src={getStreamImage(stream.code)}
                alt={`Ilustrasi ${stream.name}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      {user && (
        <div className="flex items-center justify-between gap-4 bg-brand/5 border border-brand/20 rounded-2xl px-5 py-3.5">
          <p className="text-sm text-brand-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="font-bold">Premium:</span> akses semua paket ANTAM sekaligus.
          </p>
          <Link href="/harga" className="shrink-0 text-xs font-bold text-white bg-brand hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors">
            Lihat Harga
          </Link>
        </div>
      )}

      {/* ── Daftar Paket (Card Grid) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest">Pilih Paket Ujian</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tersedia {streamPkgs.length} paket simulasi CAT teknis berbobot 40 butir soal</p>
          </div>
        </div>

        {streamPkgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-10 text-center">
            <p className="font-semibold text-ink">Belum ada paket tersedia</p>
            <p className="text-xs text-ink-muted mt-1">Paket untuk stream ini akan segera hadir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {streamPkgs.map((p, idx) => {
              const label = packageLabel(p.slug) ?? `Paket ${idx + 1}`
              const packageNumber = (() => {
                if (p.slug === stream.slug) return 1
                const suffix = p.slug.slice(`${stream.slug}-paket-`.length)
                const num = parseInt(suffix, 10)
                return isNaN(num) ? idx + 1 : num
              })()
              const access = accessMap[p.id]
              const isLocked = !!user && access === 'locked'
              const bestScore = bestScores[p.id]

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image Banner */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                      <Image
                        src={getStreamImage(stream.code)}
                        alt={`${stream.name} - ${label}`}
                        fill
                        className="object-cover scale-105 filter blur-[2px] group-hover:scale-110 group-hover:blur-[1px] transition-all duration-500 opacity-90"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Dark blurred layer for contrast */}
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-950/75 text-white backdrop-blur-sm border border-white/20 shadow-xs">
                          {stream.code}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 z-10">
                        {p.is_free ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 backdrop-blur-sm border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-xs">
                            GRATIS
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 backdrop-blur-sm border border-amber-300 px-2.5 py-0.5 rounded-full shadow-xs">
                            PREMIUM
                          </span>
                        )}
                      </div>

                      {/* Center Text: Paket #1 */}
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="px-4 py-2 rounded-2xl bg-black/45 backdrop-blur-md border border-white/25 shadow-xl group-hover:scale-105 group-hover:bg-black/55 transition-all duration-300 text-center">
                          <span className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-md font-heading block">
                            Paket #{packageNumber}
                          </span>
                        </div>
                      </div>

                      {/* Bottom info pill */}
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="text-[10px] font-semibold text-slate-200 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 shadow-xs">
                          {p.total_questions} Soal
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-[#00315f] transition-colors">
                        {label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        Simulasi CAT Teknis {stream.name} berbobot kisi-kisi resmi PT ANTAM Tbk.
                      </p>

                      {/* Stats pills */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong className="font-semibold text-slate-800">{p.total_questions}</strong> Soal</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong className="font-semibold text-slate-800">{p.duration_minutes}</strong> Menit</span>
                        </div>
                      </div>

                      {/* Score badge if finished */}
                      {bestScore !== undefined && (
                        <div className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                          <span className="font-medium">Skor Terbaik:</span>
                          <span className="font-bold font-num">{bestScore} / {p.total_questions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-4 pt-0 sm:p-5 sm:pt-0">
                    {!user ? (
                      <Link
                        href={`/persiapan/${p.id}`}
                        className="w-full py-2.5 bg-gradient-to-r from-[#00315f] to-[#16487e] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : isLocked ? (
                      <Link
                        href="/harga"
                        className="w-full py-2.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" /> Buka Akses Premium
                      </Link>
                    ) : (
                      <Link
                        href={`/persiapan/${p.id}`}
                        className="w-full py-2.5 bg-gradient-to-r from-[#00315f] to-[#16487e] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        Mulai Simulasi <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Riwayat & Tren Nilai Khusus Stream Ini ── */}
      {user && streamAttempts.length > 0 && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#00315f] flex items-center justify-center shrink-0 border border-blue-100">
                <TrendingUp className="w-5 h-5 text-[#00315f]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Riwayat Simulasi Terakhir ({stream.name})</h3>
                <p className="text-xs text-slate-500">Perkembangan nilai khusus stream {stream.code} (setiap paket dapat diulang tanpa batas)</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full shrink-0 self-start sm:self-auto">
              {streamAttempts.length} Percobaan Selesai
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Kolom Kiri: Line Chart Perkembangan Nilai */}
            <div className="lg:col-span-6 bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Grafik Perkembangan Nilai</span>
                  {delta !== null && (
                    <span className={`text-xs font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-md ${delta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {delta >= 0 ? '+' : ''}{delta} vs sebelumnya
                    </span>
                  )}
                </div>

                {/* Stat mini badges */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 text-center">
                    <p className="text-[10px] text-slate-500 font-medium">Terakhir</p>
                    <p className="text-base font-extrabold text-slate-900 tabular-nums">{lastScore}</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 text-center">
                    <p className="text-[10px] text-slate-500 font-medium">Tertinggi</p>
                    <p className="text-base font-extrabold text-emerald-600 tabular-nums">{highestScore}</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 text-center">
                    <p className="text-[10px] text-slate-500 font-medium">Rata-rata</p>
                    <p className="text-base font-extrabold text-[#00315f] tabular-nums">{avgScore}</p>
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="relative w-full pt-1">
                  <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" height={CH} className="overflow-visible">
                    <defs>
                      <linearGradient id={`stream-grad-${stream.code}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#00315f" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Dotted target guide line at 40 (max) and 20 */}
                    <line x1={pL} y1={yOf(40)} x2={CW - pR} y2={yOf(40)} stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="1" />
                    <text x={CW - pR + 4} y={yOf(40) + 3} fill="#94a3b8" fontSize="9" fontWeight="600">40</text>

                    <line x1={pL} y1={yOf(20)} x2={CW - pR} y2={yOf(20)} stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                    <text x={CW - pR + 4} y={yOf(20) + 3} fill="#94a3b8" fontSize="9" fontWeight="600">20</text>

                    {/* Area fill */}
                    {chartArea && <path d={chartArea} fill={`url(#stream-grad-${stream.code})`} />}

                    {/* Line path */}
                    {n > 1 && (
                      <polyline
                        points={chartLine}
                        fill="none"
                        stroke="#00315f"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Points & Labels */}
                    {chartPts.map((p, i) => (
                      <g key={i}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={i === n - 1 ? 4.5 : 3.5}
                          fill={i === n - 1 ? '#0284c7' : '#ffffff'}
                          stroke="#00315f"
                          strokeWidth="2"
                        />
                        <text
                          x={p.x}
                          y={p.y - 7}
                          fill="#0f172a"
                          fontSize="10"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {p.v}
                        </text>
                        <text
                          x={p.x}
                          y={CH - 4}
                          fill="#94a3b8"
                          fontSize="8.5"
                          textAnchor="middle"
                        >
                          {p.d}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-4 text-center">
                Skala skor 0 - 40 poin · Titik menampilkan skor setiap kali paket dikerjakan
              </p>
            </div>

            {/* Kolom Kanan: Daftar Percobaan Terakhir */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
                {streamAttempts.map((att, idx) => {
                  const pkg = streamPkgs.find(p => p.id === att.package_id)
                  const pLabel = pkg ? (packageLabel(pkg.slug) ?? 'Paket 1') : `Paket ${idx + 1}`
                  const pName = `ANTAM IMPACT - ${stream.name} - ${pLabel}`
                  const scoreColor = SCORE_COLORS[idx % SCORE_COLORS.length]

                  return (
                    <Link
                      key={att.id}
                      href={`/hasil/${att.id}`}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200/70 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl border font-black text-xs flex items-center justify-center shrink-0 ${scoreColor}`}>
                          {att.score ?? '-'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#00315f] transition-colors">
                            {pName}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {formatDate(att.started_at)}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#00315f] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs group-hover:bg-[#00315f] group-hover:text-white transition-all">
                        <span>Bahas</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Klik untuk melihat ulasan &amp; pembahasan soal</span>
                <Link href="/riwayat" className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Semua Riwayat <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
