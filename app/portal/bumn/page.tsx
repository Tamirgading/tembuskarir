import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import BumnPackageCard from '@/components/portal/BumnPackageCard'
import { getPremiumSubscriptionStatus } from '@/lib/access'
import { getFeatureFlags } from '@/lib/site-settings'

const BUMN_SUBTESTS = [
  {
    code: 'TWK',
    full: 'Tes Wawasan Kebangsaan',
    topik: 'Pancasila · UUD 1945 · NKRI · Bhinneka',
    cls: 'bg-violet-50 text-violet-700 border-violet-200',
    type: 'mcq',
  },
  {
    code: 'VLR',
    full: 'Verbal Logical Reasoning',
    topik: 'Penalaran verbal · Analogi · Silogisme',
    cls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    type: 'mcq',
  },
  {
    code: 'WC',
    full: 'Word Classification',
    topik: 'Klasifikasi kata · Sinonim · Antonim',
    cls: 'bg-blue-50 text-blue-700 border-blue-200',
    type: 'mcq',
  },
  {
    code: 'NS',
    full: 'Number Sequence',
    topik: 'Deret angka · Pola bilangan · Operasi hitung',
    cls: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    type: 'mcq',
  },
  {
    code: 'DIAG',
    full: 'Diagram Reasoning',
    topik: 'Penalaran gambar · Pola visual · Analogi figural',
    cls: 'bg-teal-50 text-teal-700 border-teal-200',
    type: 'mcq',
  },
  {
    code: 'AKHLAK',
    full: 'Nilai AKHLAK',
    topik: 'Amanah · Kompeten · Harmonis · Loyal · Adaptif · Kolaboratif',
    cls: 'bg-purple-50 text-purple-700 border-purple-200',
    type: 'point',
  },
]

export default async function BumnPortalPage() {
  const flags = await getFeatureFlags()
  if (!flags.feature_portal_bumn) redirect('/')
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
      .eq('category', 'BUMN')
      .eq('is_published', true)
      .order('is_free', { ascending: false })
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-8 text-white" style={{ background: 'linear-gradient(135deg,#4C1D95,#1e1b4b)' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-white/80" />
            </div>
            <div className="flex-1">
              <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">
                Rekrutmen Bersama
              </p>
              <h1 className="text-2xl font-heading font-extrabold leading-tight">
                Simulasi TKD BUMN
              </h1>
              <p className="text-white/65 text-sm mt-2 max-w-lg leading-relaxed">
                Tes Kemampuan Dasar (TKD) yang digunakan dalam seleksi Rekrutmen Bersama BUMN (RBB).
                Mencakup TWK, TIU, dan TKP, standar Kementerian BUMN.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {[
              { label: 'Sub-tes', value: '6' },
              { label: 'Durasi', value: '~90 mnt' },
              { label: 'Perusahaan', value: '65+' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <p className="text-white font-num font-bold text-sm">{s.value}</p>
                <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-tes breakdown */}
        <div className="bg-paper px-6 py-4">
          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3">6 Sub-tes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BUMN_SUBTESTS.map((sub) => (
              <div key={sub.code} className={`rounded-xl border px-3 py-2.5 ${sub.cls}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs">{sub.code}</span>
                  {sub.type === 'point' && (
                    <span className="text-[9px] font-bold bg-purple-200/60 text-purple-700 px-1.5 py-0.5 rounded-full">
                      POIN
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-semibold opacity-80 leading-tight">{sub.full}</p>
                <p className="text-[9px] opacity-55 mt-0.5 leading-tight">{sub.topik}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upgrade banner ── */}
      {isLoggedIn && !hasPremium && (
        <div className="flex items-center justify-between gap-4 bg-violet-50 border border-violet-200 rounded-2xl px-5 py-3.5">
          <p className="text-sm text-violet-800">
            <span className="font-bold">Premium:</span> akses semua paket BUMN, ASTRA, OJK, PLN GAT sekaligus.
          </p>
          <Link
            href="/harga"
            className="shrink-0 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl transition-colors"
          >
            Lihat Harga →
          </Link>
        </div>
      )}

      {/* ── Paket ── */}
      <div>
        <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-3">Pilih Paket Latihan</h2>
        <div className="space-y-3">
          {packages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-hairline text-ink-muted text-sm">
              Paket sedang dipersiapkan. Cek kembali segera!
            </div>
          ) : (
            packages.map((pkg, i) => (
              <BumnPackageCard
                key={pkg.id}
                pkg={pkg}
                isLoggedIn={isLoggedIn}
                hasPremium={hasPremium}
                index={i}
              />
            ))
          )}
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
                  <span className="font-num font-bold text-violet-600 text-base">{att.score ?? '—'}</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Info institusi BUMN ── */}
      <div className="bg-white rounded-2xl border border-hairline shadow-soft px-5 py-4">
        <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3">BUMN yang Gunakan Format Ini</p>
        <div className="flex flex-wrap gap-2">
          {['Pertamina', 'PLN', 'Telkom', 'BRI', 'BNI', 'Mandiri', 'BTN', 'Bulog', 'Waskita', 'Wijaya Karya',
            'Adhi Karya', 'Hutama Karya', 'PTPN', 'Kimia Farma', 'Bio Farma', 'Pos Indonesia'].map((b) => (
            <span key={b} className="text-xs bg-paper border border-hairline rounded-lg px-2.5 py-1 text-ink-muted font-medium">
              {b}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
