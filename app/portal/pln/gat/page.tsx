import Link from 'next/link'
import { Zap, Package, ChevronRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import PlnPackageCard from '@/components/portal/PlnPackageCard'
import { getUnlockedPackageIds } from '@/lib/access'
import { PLN_SUBTESTS } from '@/lib/exam-scoring'

export default async function PlnGatPage() {
  let packages: PackageRow[] = []
  let isLoggedIn = false
  let unlockedPackageIds: string[] = []
  let recentAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user

    // Hanya ambil paket GAT (slug prefix 'gat-')
    const { data: pkgData } = await supabase
      .from('packages')
      .select('*')
      .eq('category', 'PLN')
      .eq('is_published', true)
      .ilike('slug', 'gat-%')
      .order('is_free', { ascending: false })
      .order('created_at', { ascending: true })
    packages = (pkgData ?? []) as PackageRow[]

    if (user) {
      unlockedPackageIds = await getUnlockedPackageIds(user.id)

      const ids = packages.map((p) => p.id)
      if (ids.length > 0) {
        const { data: attemptsData } = await supabase
          .from('attempts')
          .select('id, score, started_at, package_id')
          .eq('user_id', user.id)
          .eq('status', 'finished')
          .in('package_id', ids)
          .order('started_at', { ascending: false })
          .limit(5)
        recentAttempts = (attemptsData ?? []) as Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[]
      }
    }
  } catch { /* Supabase not configured */ }

  const packageNameMap = Object.fromEntries(packages.map((p) => [p.id, p.name]))

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-7 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/portal/pln" className="hover:text-white transition-colors">Rekrutmen PLN</Link>
            <span>›</span>
            <span className="text-white/80">Tahap 1 — GAT</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">PLN Tahap 1</p>
              <h1 className="text-2xl font-heading font-extrabold">General Aptitude Test</h1>
            </div>
            <span className="ml-auto text-[11px] font-bold px-3 py-1 bg-brand/20 text-brand-300 rounded-full">GAT</span>
          </div>
          <p className="text-white/60 text-sm">
            Simulasi GAT PLN dengan format per-sub-tes berurutan dan timer terpisah — persis seperti tes aslinya. 8 sub-tes, 210 soal, 180 menit.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            {[{ v: '210', l: 'total soal' }, { v: '8', l: 'sub-tes' }, { v: '180', l: 'menit' }, { v: '+1', l: 'per benar' }].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <p className="font-num font-bold text-white">{s.v}</p>
                <p className="text-white/55 text-[10px]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-tes grid */}
        <div className="bg-white px-6 py-5">
          <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Sub-tes GAT</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(PLN_SUBTESTS).map(([key, sub]) => (
              <div key={key} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-hairline bg-paper-soft">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand/10 text-brand-700 border border-brand/20 shrink-0">{key}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">{sub.full}</p>
                  <p className="text-[10px] text-ink-muted font-num">{sub.soal} soal · {sub.minutes} mnt</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Paket + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-6 items-start">

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Paket Simulasi</p>
            <span className="text-xs text-ink-muted font-num">{packages.length} paket</span>
          </div>

          {packages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-hairline shadow-soft p-12 text-center">
              <Package className="w-10 h-10 text-ink-muted mx-auto mb-3" />
              <p className="font-heading font-semibold text-ink">Belum ada paket GAT tersedia</p>
              <p className="text-sm mt-1 text-ink-muted">Pantau terus untuk update paket baru</p>
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg, i) => (
                <PlnPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isLoggedIn={isLoggedIn}
                  isUnlocked={unlockedPackageIds.includes(pkg.id)}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Riwayat */}
          {isLoggedIn && recentAttempts.length > 0 && (
            <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
              <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Riwayat Simulasimu</p>
              <div className="divide-y divide-hairline">
                {recentAttempts.map((a) => (
                  <Link key={a.id} href={`/hasil/${a.id}`}
                    className="flex items-center gap-3 py-3 hover:opacity-80 transition-opacity">
                    <span className="w-10 h-10 rounded-xl bg-brand/10 grid place-items-center font-num font-bold text-brand text-sm shrink-0">
                      {a.score ?? '–'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-ink truncate">{packageNameMap[a.package_id] ?? 'Paket'}</p>
                      <p className="text-[11px] text-ink-muted">{formatDate(a.started_at)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Sistem Penilaian</p>
            <div className="bg-paper-soft rounded-xl p-3 space-y-2 border border-hairline mb-3">
              <p className="text-[11px] font-bold text-ink uppercase tracking-wide">6 Sub-tes Kognitif</p>
              <p className="text-[10px] text-ink-muted">NUM · VER · SIL · DER · FIG · PU</p>
              {[{ l: 'Benar', v: '+1', c: 'text-brand font-bold' }, { l: 'Salah / Kosong', v: '0', c: 'text-ink-muted' }].map((r) => (
                <div key={r.l} className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">{r.l}</span>
                  <span className={`font-num ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="bg-paper-soft rounded-xl p-3 space-y-2 border border-hairline">
              <p className="text-[11px] font-bold text-ink uppercase tracking-wide">LA &amp; AKHLAK</p>
              <p className="text-[10px] text-ink-muted">Sistem poin per opsi (1–5)</p>
              {[{ l: 'Opsi paling tepat', v: '+5', c: 'text-brand font-bold' }, { l: 'Opsi kurang tepat', v: '+1', c: 'text-ink-muted' }].map((r) => (
                <div key={r.l} className="flex justify-between items-center text-xs">
                  <span className="text-ink-soft">{r.l}</span>
                  <span className={`font-num ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5">
            <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Tips Sukses</p>
            <div className="space-y-3">
              {[
                { icon: '🧮', text: 'Numerik & Deret: skip soal sulit, kembali nanti' },
                { icon: '📚', text: 'Verbal: kuasai istilah umum dan ketenagalistrikan' },
                { icon: '⚡', text: 'Pengetahuan PLN: sejarah, struktur, proyek strategis' },
                { icon: '🌟', text: 'AKHLAK: jujur dan natural, cerminkan 6 core values BUMN' },
              ].map((t) => (
                <div key={t.text} className="flex items-start gap-2.5 text-xs text-ink-soft">
                  <span className="shrink-0 text-sm">{t.icon}</span>
                  <p className="leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper-soft rounded-xl p-4 border border-hairline">
            <div className="flex items-start gap-2 text-xs text-ink-muted">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <p className="leading-relaxed">Sub-tes dikerjakan berurutan dengan timer terpisah per sub-tes.</p>
            </div>
          </div>

          {!isLoggedIn && (
            <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
              <p className="font-heading font-bold text-sm mb-1">Mulai Latihan Gratis</p>
              <p className="text-white/60 text-xs mb-4 leading-relaxed">Daftar sekarang dan akses paket simulasi tanpa biaya.</p>
              <Link href="/register" className="block w-full text-center py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
                Daftar Gratis →
              </Link>
              <Link href="/login" className="block w-full text-center py-2 text-white/60 text-xs hover:text-white transition-colors mt-2">
                Sudah punya akun? Masuk
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
