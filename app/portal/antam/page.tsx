import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Mountain, ArrowRight, Clock, FileText, ChevronRight,
  Pickaxe, FlaskConical, Cog, ShieldCheck, Search,
  BarChart3, TrendingUp, Truck, Users, Scale,
  DollarSign, Megaphone, Monitor,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPremiumSubscriptionStatus } from '@/lib/access'
import { getFeatureFlags } from '@/lib/site-settings'
import { ANTAM_STREAM_LIST } from '@/lib/antam-config'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const STREAM_ICONS: Record<string, LucideIcon> = {
  EXP: Search,
  MIN: Pickaxe,
  PRC: FlaskConical,
  ENG: Cog,
  HSE: ShieldCheck,
  QC: BarChart3,
  MKT: Megaphone,
  BDV: TrendingUp,
  SCM: Truck,
  HCM: Users,
  LGL: Scale,
  FIN: DollarSign,
  CRL: Megaphone,
  IT:  Monitor,
}

const STREAM_COLORS: Record<string, string> = {
  EXP: 'bg-amber-50 text-amber-700 border-amber-200',
  MIN: 'bg-stone-100 text-stone-700 border-stone-200',
  PRC: 'bg-purple-50 text-purple-700 border-purple-200',
  ENG: 'bg-blue-50 text-blue-700 border-blue-200',
  HSE: 'bg-green-50 text-green-700 border-green-200',
  QC:  'bg-cyan-50 text-cyan-700 border-cyan-200',
  MKT: 'bg-pink-50 text-pink-700 border-pink-200',
  BDV: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SCM: 'bg-orange-50 text-orange-700 border-orange-200',
  HCM: 'bg-teal-50 text-teal-700 border-teal-200',
  LGL: 'bg-slate-100 text-slate-700 border-slate-200',
  FIN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CRL: 'bg-rose-50 text-rose-700 border-rose-200',
  IT:  'bg-violet-50 text-violet-700 border-violet-200',
}

export default async function AntamPortalPage() {
  const flags = await getFeatureFlags()
  if (!flags.feature_portal_antam) redirect('/')

  let packages: PackageRow[] = []
  let isLoggedIn = false
  let hasPremium = false
  let recentAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pkgData } = await (supabase.from('packages') as any)
      .select('*')
      .eq('category', 'ANTAM')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
    packages = (pkgData ?? []) as PackageRow[]

    if (user) {
      const premiumStatus = await getPremiumSubscriptionStatus(user.id)
      hasPremium = premiumStatus.active

      const ids = packages.map((p) => p.id)
      if (ids.length > 0) {
        const { data: attData } = await supabase
          .from('attempts')
          .select('id, score, started_at, package_id')
          .eq('user_id', user.id)
          .eq('status', 'finished')
          .in('package_id', ids)
          .order('started_at', { ascending: false })
          .limit(5)
        recentAttempts = (attData ?? []) as Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[]
      }
    }
  } catch { /* Supabase not configured */ }

  const packageNameMap = Object.fromEntries(packages.map((p) => [p.id, p.name]))

  // Paket per stream: cari semua slug dengan prefix antam-{stream.slug} (paket 1, 2, 3, dst.)
  const streamPackages = (code: string, streamSlug: string) => {
    const prefix = `antam-${streamSlug}`
    return packages
      .filter((p) => p.slug === prefix || p.slug.startsWith(`${prefix}-paket-`))
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
  }

  // Label paket: "Paket 2", "Paket 3", dst. Paket 1 tanpa label.
  const packageLabel = (slug: string, streamSlug: string): string | null => {
    const suffix = slug.slice(`antam-${streamSlug}-paket-`.length)
    if (slug === `antam-${streamSlug}`) return null
    return `Paket ${suffix}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-8 text-white" style={{ background: 'linear-gradient(135deg,#1a472a,#0d2818)' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Mountain className="w-6 h-6 text-white/80" />
            </div>
            <div className="flex-1">
              <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">
                PT ANTAM Tbk
              </p>
              <h1 className="text-2xl font-heading font-extrabold leading-tight">
                ANTAM IMPACT 2026
              </h1>
              <p className="text-white/65 text-sm mt-2 max-w-lg leading-relaxed">
                Simulasi tes teknis untuk rekrutmen ANTAM IMPACT (Innovative Minds Powering ANTAM for Career Transformation).
                Pilih job stream sesuai latar belakang pendidikanmu.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {[
              { label: 'Job Stream', value: '14' },
              { label: 'Soal/Stream', value: '40' },
              { label: 'Waktu', value: '50 mnt' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <p className="text-white font-num font-bold text-sm">{s.value}</p>
                <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info strip */}
        <div className="bg-paper px-6 py-4">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3">Tentang Tes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink-soft">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span><strong className="text-ink">Sesi 1</strong>: Tes teknis sesuai job stream (40 soal, 50 menit)</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span><strong className="text-ink">Format</strong>: Pilihan ganda, skor = jumlah benar</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      {isLoggedIn && !hasPremium && (
        <div className="flex items-center justify-between gap-4 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5">
          <p className="text-sm text-green-800">
            <span className="font-bold">Premium:</span> akses semua paket ANTAM, ASTRA, PLN, dan BUMN sekaligus.
          </p>
          <Link
            href="/harga"
            className="shrink-0 text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors"
          >
            Lihat Harga
          </Link>
        </div>
      )}

      {/* ── Grid 14 Stream ── */}
      <div>
        <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-3">Pilih Job Stream</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ANTAM_STREAM_LIST.map((stream) => {
            const Icon = STREAM_ICONS[stream.code] ?? Mountain
            const colorCls = STREAM_COLORS[stream.code] ?? 'bg-gray-50 text-gray-700 border-gray-200'
            const bgCls = colorCls.split(' ')[0]
            const textCls = colorCls.split(' ')[1]
            const streamPkgs = streamPackages(stream.code, stream.slug)
            const primary = streamPkgs[0]
            const hasPackage = streamPkgs.length > 0

            return (
              <div
                key={stream.code}
                className={`group flex items-center gap-3.5 bg-white rounded-2xl border border-hairline px-4 py-4 transition-all ${
                  hasPackage ? 'hover:shadow-soft hover:border-green-300' : 'opacity-60'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bgCls}`}>
                  <Icon className={`w-5 h-5 ${textCls}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-ink leading-snug">{stream.name}</p>
                    <span className="text-[9px] font-bold text-ink-muted bg-paper-soft px-1.5 py-0.5 rounded-full">{stream.code}</span>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{stream.jurusan}</p>
                  {hasPackage && primary && (
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-1">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /><span className="font-num">{primary.total_questions}</span> soal</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /><span className="font-num">{primary.duration_minutes}</span> mnt</span>
                    </div>
                  )}
                  {hasPackage && streamPkgs.length > 1 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {streamPkgs.map((sp) => (
                        <Link
                          key={sp.id}
                          href={`/persiapan/${sp.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 text-[11px] font-bold rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                        >
                          {packageLabel(sp.slug, stream.slug) ?? 'Paket 1'} <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {hasPackage ? (
                  <Link href={`/persiapan/${primary.id}`}
                    className="shrink-0 flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                    Mulai <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="shrink-0 text-[10px] font-semibold text-ink-muted bg-paper-soft px-3 py-2 rounded-xl">
                    Segera Hadir
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Riwayat ── */}
      {recentAttempts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-3">Riwayat Ujian</h2>
          <div className="bg-white rounded-2xl border border-hairline overflow-hidden shadow-soft">
            {recentAttempts.map((att, i) => (
              <Link
                key={att.id}
                href={`/hasil/${att.id}`}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-paper-soft transition-colors ${
                  i < recentAttempts.length - 1 ? 'border-b border-hairline' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{packageNameMap[att.package_id] ?? 'Paket'}</p>
                  <p className="text-xs text-ink-muted">{formatDate(att.started_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-num font-bold text-green-600 text-base">{att.score ?? '—'}</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Info ANTAM ── */}
      <div className="bg-white rounded-2xl border border-hairline shadow-soft px-5 py-4">
        <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3">Tentang ANTAM IMPACT</p>
        <div className="space-y-2 text-sm text-ink-soft leading-relaxed">
          <p>
            <strong className="text-ink">ANTAM IMPACT</strong> (Innovative Minds Powering ANTAM for Career Transformation)
            adalah program rekrutmen tahunan PT ANTAM Tbk untuk fresh graduate dari berbagai disiplin ilmu.
          </p>
          <p>
            Seleksi meliputi tes kemampuan teknis sesuai job stream, tes psikologi, dan bahasa Inggris.
            Simulasi ini membantu mempersiapkan materi teknis sesuai kisi-kisi resmi.
          </p>
        </div>
      </div>

    </div>
  )
}
