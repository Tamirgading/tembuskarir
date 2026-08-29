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
import { getEffectiveFeatureFlags } from '@/lib/site-settings'
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
  EXP: 'bg-brand/10 text-brand-700 border-brand/20',
  MIN: 'bg-brand/10 text-brand-700 border-brand/20',
  PRC: 'bg-brand/10 text-brand-700 border-brand/20',
  ENG: 'bg-brand/10 text-brand-700 border-brand/20',
  HSE: 'bg-brand/10 text-brand-700 border-brand/20',
  QC:  'bg-brand/10 text-brand-700 border-brand/20',
  MKT: 'bg-brand/10 text-brand-700 border-brand/20',
  BDV: 'bg-brand/10 text-brand-700 border-brand/20',
  SCM: 'bg-brand/10 text-brand-700 border-brand/20',
  HCM: 'bg-brand/10 text-brand-700 border-brand/20',
  LGL: 'bg-brand/10 text-brand-700 border-brand/20',
  FIN: 'bg-brand/10 text-brand-700 border-brand/20',
  CRL: 'bg-brand/10 text-brand-700 border-brand/20',
  IT:  'bg-brand/10 text-brand-700 border-brand/20',
}

export default async function AntamPortalPage() {
  let packages: PackageRow[] = []
  let isLoggedIn = false
  let hasPremium = false
  let userEmail: string | null = null
  let recentAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user
    userEmail = user?.email ?? null

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

  const flags = await getEffectiveFeatureFlags(userEmail)
  if (!flags.feature_portal_antam) redirect('/')

  const packageNameMap = Object.fromEntries(packages.map((p) => [p.id, p.name]))

  // Paket per stream: cari semua slug dengan prefix stream.slug (mis. antam-exploration, antam-exploration-paket-2, dst.)
  const streamPackages = (streamSlug: string) => {
    const prefix = streamSlug
    return packages
      .filter((p) => p.slug === prefix || p.slug.startsWith(`${prefix}-paket-`))
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-8 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0B3D30)' }}>
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
              <FileText className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span><strong className="text-ink">Sesi 1</strong>: Tes teknis sesuai job stream (40 soal, 50 menit)</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span><strong className="text-ink">Format</strong>: Pilihan ganda, skor = jumlah benar</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      {isLoggedIn && !hasPremium && (
        <div className="flex items-center justify-between gap-4 bg-brand/5 border border-brand/20 rounded-2xl px-5 py-3.5">
          <p className="text-sm text-brand-800">
            <span className="font-bold">Premium:</span> akses semua paket ANTAM, ASTRA, PLN, dan BUMN sekaligus.
          </p>
          <Link
            href="/harga"
            className="shrink-0 text-xs font-bold text-white bg-brand hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors"
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
            const streamPkgs = streamPackages(stream.slug)
            const hasPackage = streamPkgs.length > 0

            return (
              <Link
                key={stream.code}
                href={`/portal/antam/${stream.slug}`}
                className={`group flex items-center gap-3.5 bg-white rounded-2xl border border-hairline px-4 py-4 transition-all ${
                  hasPackage ? 'hover:shadow-soft hover:border-brand/30' : 'opacity-60 pointer-events-none'
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
                  {hasPackage && streamPkgs[0] && (
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-1">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /><span className="font-num">{streamPkgs.length}</span> paket</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /><span className="font-num">{streamPkgs[0].total_questions}</span> soal</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /><span className="font-num">{streamPkgs[0].duration_minutes}</span> mnt</span>
                    </div>
                  )}
                </div>
                {hasPackage ? (
                  <span className="shrink-0 flex items-center gap-1 px-3 py-2 bg-brand text-white text-xs font-bold rounded-xl group-hover:bg-brand-700 transition-colors">
                    Lihat Paket <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] font-semibold text-ink-muted bg-paper-soft px-3 py-2 rounded-xl">
                    Segera Hadir
                  </span>
                )}
              </Link>
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
                  <span className="font-num font-bold text-brand text-base">{att.score ?? '—'}</span>
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
