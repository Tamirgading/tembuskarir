import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronRight, Clock, FileText, Mountain,
  Pickaxe, FlaskConical, Cog, ShieldCheck, Search,
  BarChart3, TrendingUp, Truck, Users, Scale,
  DollarSign, Megaphone, Monitor, ArrowRight,
  Building2, TrendingDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPremiumSubscriptionStatus } from '@/lib/access'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'
import { ANTAM_STREAM_LIST } from '@/lib/antam-config'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StreamVisual {
  gradient: string
  icon: LucideIcon
  sub: string
}

const STREAM_VISUALS: Record<string, StreamVisual> = {
  EXP: { gradient: 'from-[#064e3b] via-[#047857] to-[#10b981]', icon: Search,      sub: 'Eksplorasi Geologi & Tambang' },
  MIN: { gradient: 'from-[#78350f] via-[#b45309] to-[#f59e0b]', icon: Pickaxe,     sub: 'Operasi Tambang Terbuka & Dalam' },
  PRC: { gradient: 'from-[#1e1b4b] via-[#312e81] to-[#4338ca]', icon: FlaskConical, sub: 'Peleburan FeNi & Pemurnian Emas' },
  ENG: { gradient: 'from-[#0f172a] via-[#1e293b] to-[#334155]', icon: Cog,         sub: 'Konstruksi & Maintenance' },
  HSE: { gradient: 'from-[#14532d] via-[#166534] to-[#22c55e]', icon: ShieldCheck,  sub: 'K3 & Reklamasi Tambang' },
  QC:  { gradient: 'from-[#0c4a6e] via-[#0284c7] to-[#38bdf8]', icon: BarChart3,   sub: 'Lab Analisis Kadar Bijih Logam' },
  BDV: { gradient: 'from-[#701a75] via-[#a21caf] to-[#e879f9]', icon: TrendingUp,  sub: 'Ekspansi & Hilirisasi Tambang' },
  SCM: { gradient: 'from-[#134e4a] via-[#0f766e] to-[#2dd4bf]', icon: Truck,       sub: 'Barge Transport & Pengadaan' },
  HCM: { gradient: 'from-[#831843] via-[#be185d] to-[#f472b6]', icon: Users,       sub: 'Talent Dev. & Budaya AKHLAK' },
  FIN: { gradient: 'from-[#3f2c00] via-[#854d0e] to-[#eab308]', icon: DollarSign,  sub: 'LM Audit & Perpajakan Tambang' },
  LGL: { gradient: 'from-[#1e1b4b] via-[#3730a3] to-[#6366f1]', icon: Scale,       sub: 'Regulasi IUP & Hukum Kontrak' },
  IT:  { gradient: 'from-[#042f2e] via-[#0f766e] to-[#14b8a6]', icon: Monitor,     sub: 'Smart Mining 4.0 & ERP Solutions' },
  MKT: { gradient: 'from-[#7c2d12] via-[#c2410c] to-[#fb923c]', icon: Megaphone,   sub: 'Komunikasi & Strategi Merek' },
  CRL: { gradient: 'from-[#3b0764] via-[#6d28d9] to-[#a78bfa]', icon: Building2,   sub: 'Hubungan Perusahaan & CSR' },
}

const SCORE_COLORS = [
  'bg-sky-50 border-sky-100 text-sky-700',
  'bg-emerald-50 border-emerald-100 text-emerald-700',
  'bg-amber-50 border-amber-100 text-amber-700',
]

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

  const streamPackages = (streamSlug: string) =>
    packages
      .filter((p) => p.slug === streamSlug || p.slug.startsWith(`${streamSlug}-paket-`))
      .sort((a, b) => a.created_at.localeCompare(b.created_at))

  return (
    <div className="space-y-7">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl shadow-xl text-white"
        style={{ background: 'linear-gradient(to right, #06241c, #0b382d, #124d3e)' }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 20% 20%, rgba(217,119,6,0.18), transparent 50%)' }} />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(45,212,191,0.10)' }} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 md:p-8 lg:p-10">
          {/* Left: Content */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[#fde047] font-bold text-xs uppercase tracking-wider border border-white/15"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Mountain className="w-3.5 h-3.5" />
                PT ANTAM Tbk • Danantara
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[#fef08a] font-semibold text-xs"
                style={{ background: 'rgba(253,224,71,0.20)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fde047] animate-pulse" />
                Rekrutmen Nasional 2026
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-[28px] lg:text-[32px] font-extrabold tracking-tight text-white leading-tight">
                ANTAM IMPACT 2026
              </h1>
              <p className="text-sm font-medium tracking-wide mt-1" style={{ color: '#99f6e4' }}>
                Integrated Miners Program for Accelerating Capability &amp; Talent
              </p>
              <p className="text-sm leading-relaxed max-w-xl mt-2" style={{ color: 'rgba(209,250,229,0.90)' }}>
                Simulasi tes kemampuan teknis &amp; manajerial resmi PT Aneka Tambang Tbk.
                Pilih job stream sesuai kualifikasi studi untuk memaksimalkan kelulusan CAT &amp; TKB.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { v: '14',    l: 'Job Stream' },
                { v: '40',    l: 'Soal / Stream' },
                { v: '50 mnt', l: 'Durasi Waktu' },
                { v: 'A+',    l: 'Standar Danantara', c: 'text-[#fde047]' },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-2.5 flex flex-col border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <span className={`text-xl font-black text-white leading-none ${s.c ?? ''}`}>{s.v}</span>
                  <span className="text-[11px] mt-1" style={{ color: '#99f6e4' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Poster image */}
          <div className="lg:col-span-4 relative flex justify-center lg:justify-end items-center">
            <div className="relative w-44 sm:w-52 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="aspect-[3/4] w-full relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/card-antam.png"
                  alt="ANTAM IMPACT 2026"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, #06241c 0%, transparent 50%)' }} />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white">
                  <span className="px-2 py-0.5 rounded font-bold tracking-wider"
                    style={{ background: 'rgba(6,36,28,0.80)' }}>#ANTAMRecruitment2026</span>
                  <span className="font-medium" style={{ color: '#fde047' }}>antam.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exam Protocol Bar ── */}
      <section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Petunjuk Format Ujian</h2>
            <p className="text-xs text-slate-500">Sesi Tes: Kemampuan teknis spesifik kejuruan (40 Soal / 50 Menit per paket)</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Format: Pilihan Ganda</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-sky-600" />
            <span>Skor: Jumlah Benar (+1) / Salah (0)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-sky-600" />
            <span>Perankingan Nasional Realtime</span>
          </div>
        </div>
      </section>

      {/* ── Job Stream Header + Grid ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">Jalur Kejuruan Resmi</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pilih Job Stream ANTAM</h2>
            <p className="text-sm text-slate-500 mt-0.5">Setiap modul dilengkapi 3 paket latihan berbobot kisi-kisi teknis PT ANTAM Tbk.</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            <button className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold shadow-sm">
              Semua Bidang ({ANTAM_STREAM_LIST.length})
            </button>
            <button className="px-3 py-1.5 rounded-lg text-slate-500 text-xs font-medium hover:text-slate-800 transition-colors">
              Engineering
            </button>
            <button className="px-3 py-1.5 rounded-lg text-slate-500 text-xs font-medium hover:text-slate-800 transition-colors">
              Business &amp; Support
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ANTAM_STREAM_LIST.map((stream) => {
            const visual = STREAM_VISUALS[stream.code] ?? STREAM_VISUALS['EXP']
            const Icon = visual.icon
            const streamPkgs = streamPackages(stream.slug)
            const hasPackage = streamPkgs.length > 0

            return (
              <div key={stream.code}
                className="group bg-white rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/80">
                <div>
                  {/* Colored header */}
                  <div className={`relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br ${visual.gradient} p-2.5 flex items-center justify-between text-white shadow-inner mb-3`}>
                    <div className="relative z-10 flex-1 pr-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block"
                        style={{ background: 'rgba(255,255,255,0.20)' }}>
                        {stream.code}
                      </span>
                      <h3 className="text-sm font-bold mt-1 text-white leading-tight">{stream.name}</h3>
                      <p className="text-[10px] leading-tight mt-0.5 opacity-80">{visual.sub}</p>
                    </div>
                    <div className="relative z-10 w-11 h-11 shrink-0 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                      style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-xl"
                      style={{ background: 'rgba(255,255,255,0.10)' }} />
                  </div>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Kualifikasi Studi</p>
                  <p className="text-[11px] font-semibold text-slate-800 mb-2 leading-tight line-clamp-2">{stream.jurusan}</p>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {hasPackage ? streamPkgs.length : 3} Paket
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      40 Soal
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      50 Mnt
                    </span>
                  </div>
                </div>

                {hasPackage ? (
                  <Link href={`/portal/antam/${stream.slug}`}
                    className="w-full inline-flex items-center justify-between py-1.5 px-2.5 rounded-lg text-white text-[11px] font-semibold hover:opacity-90 transition-all shadow-sm"
                    style={{ background: '#00315f' }}>
                    <span>Buka Job Stream</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div className="w-full inline-flex items-center justify-center py-1.5 px-2.5 rounded-lg bg-slate-100 text-slate-400 text-[11px] font-semibold">
                    Segera Hadir
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Riwayat ── */}
      {recentAttempts.length > 0 && (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#cce5ff', color: '#004b73' }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Riwayat Simulasi Terakhir</h3>
                <p className="text-xs text-slate-500">Pantau grafik perkembangan nilai tes kejuruanmu</p>
              </div>
            </div>
            <Link href="/riwayat"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
              Lihat Semua Riwayat <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentAttempts.map((att, i) => {
              const scoreColor = SCORE_COLORS[i % SCORE_COLORS.length]
              return (
                <Link key={att.id} href={`/hasil/${att.id}`}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl border font-black text-sm flex items-center justify-center shrink-0 ${scoreColor}`}>
                      {att.score ?? '–'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{packageNameMap[att.package_id] ?? 'Paket'}</span>
                      </div>
                      <div className="text-xs text-slate-500">{formatDate(att.started_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="px-4 py-1.5 rounded-xl bg-white text-slate-700 text-xs font-semibold hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-200">
                      Detail Pembahasan
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Tentang Program ── */}
      <section className="rounded-3xl p-6 border border-slate-200/90"
        style={{ background: 'linear-gradient(to right, #f2f3ff, #eaedff)' }}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white"
            style={{ background: '#00315f' }}>
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Tentang Program ANTAM IMPACT 2026</h4>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
              <strong>ANTAM IMPACT (Integrated Miners Program for Accelerating Capability &amp; Talent)</strong> merupakan program rekrutmen berstandar akselerasi kepemimpinan tambang nasional PT Aneka Tambang Tbk di bawah koordinasi Holding Industri Pertambangan Indonesia (MIND ID) dan Badan Pengelola Investasi Daya Anagata Nusantara (Danantara).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kandidat yang lolos seleksi CAT teknis akan diarahkan langsung ke site operasional strategis ANTAM (Pomalaa, Tayan, Pongkor, Halmahera Timur, Logam Mulia Pulogadung) dengan pendampingan mentor manajerial senior.
            </p>
          </div>
        </div>
      </section>

      {/* ── Premium Upgrade Strip ── */}
      {!hasPremium && (
        <section className="rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
          style={{ background: 'linear-gradient(to right, #00315f, #16487e, #004e62)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(97,187,255,0.20)' }}>
              <Mountain className="w-7 h-7" style={{ color: '#61bbff' }} />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[#001d31] text-[11px] font-bold uppercase tracking-wider mb-1.5"
                style={{ background: '#fde047' }}>
                Bundle Rekrutmen Tambang
              </span>
              <h3 className="text-lg font-bold text-white">
                Buka Akses Seluruh {ANTAM_STREAM_LIST.length} Job Stream ANTAM IMPACT
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(234,237,255,0.80)' }}>
                Termasuk modul Tes Potensi Akademik, Psikotes BUMN, serta Bank Soal Teknis Emas &amp; Nikel.
              </p>
            </div>
          </div>
          <Link href="/harga"
            className="shrink-0 px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:bg-white hover:text-slate-900"
            style={{ background: '#61bbff', color: '#001d31' }}>
            Upgrade Premium Sekarang →
          </Link>
        </section>
      )}
    </div>
  )
}
