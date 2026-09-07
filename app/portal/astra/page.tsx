import Link from 'next/link'
import { Briefcase, ChevronRight, CheckCircle2, Clock, Zap, Brain, Box, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import AstraPackageCard from '@/components/portal/AstraPackageCard'
import { getUnlockedPackageIds, getPremiumSubscriptionStatus } from '@/lib/access'
import { ASTRA_SUBTESTS } from '@/lib/exam-scoring'

const SUBTEST_COLORS: Record<string, { bg: string; text: string }> = {
  QR:  { bg: 'bg-blue-100',    text: 'text-blue-800' },
  DR:  { bg: 'bg-sky-100',     text: 'text-sky-800' },
  RC:  { bg: 'bg-indigo-100',  text: 'text-indigo-800' },
  IR:  { bg: 'bg-teal-100',    text: 'text-teal-800' },
  VIZ: { bg: 'bg-purple-100',  text: 'text-purple-800' },
  PS:  { bg: 'bg-amber-100',   text: 'text-amber-800' },
  WM:  { bg: 'bg-emerald-100', text: 'text-emerald-800' },
}

const SCORE_COLORS = ['bg-sky-50 border-sky-100 text-sky-700', 'bg-emerald-50 border-emerald-100 text-emerald-700', 'bg-amber-50 border-amber-100 text-amber-700']

export default async function AstraPortalPage() {
  let packages: PackageRow[] = []
  let isLoggedIn = false
  let hasPremium = false
  let unlockedPackageIds: string[] = []
  let recentAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user

    const { data: pkgData } = await supabase
      .from('packages')
      .select('*')
      .eq('category', 'ASTRA')
      .eq('is_published', true)
      .order('is_free', { ascending: false })
      .order('created_at', { ascending: true })
    packages = (pkgData ?? []) as PackageRow[]

    if (user) {
      const premium = await getPremiumSubscriptionStatus(user.id)
      hasPremium = premium.active
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
    <div className="space-y-7">

      {/* ── Hero Banner ── */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-800"
        style={{ background: 'linear-gradient(to right, #0C1B2E, #102D4F, #16487E)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

          {/* Left: Content */}
          <div className="p-6 md:p-8 lg:p-10 lg:col-span-8 flex flex-col justify-between z-10">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2.5 flex-wrap mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase text-sky-200 border border-white/15"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <Briefcase className="w-3.5 h-3.5 text-sky-300" />
                  Rekrutmen Swasta &amp; BUMN
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-300 border border-sky-400/30"
                  style={{ background: 'rgba(56,154,221,0.20)' }}>
                  Psikotes
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                Psikotes ASTRA International
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                Simulasi Tes Psikologi Rekrutmen PT Astra International, dengan format per-sub-tes dan timer terpisah persis tes aslinya.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {[
                { v: '80', l: 'Total Soal', c: 'text-white' },
                { v: '7', l: 'Sub-tes', c: 'text-white' },
                { v: '41', l: 'Menit Total', c: 'text-white' },
                { v: '+1', l: 'Poin / Benar', c: 'text-emerald-400' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl p-3.5 border border-white/10 text-center"
                  style={{ background: 'rgba(255,255,255,0.10)' }}>
                  <span className={`text-xl md:text-2xl font-black block ${s.c}`}>{s.v}</span>
                  <span className="text-[11px] text-sky-200 font-medium tracking-wide uppercase">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative lg:col-span-4 min-h-[180px] lg:min-h-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/card-astra.jpg"
              alt="PT Astra International"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
            />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, #0C1B2E 0%, rgba(12,27,46,0.3) 60%, transparent 100%)' }} />
          </div>
        </div>
      </section>

      {/* ── Sub-Tes Section ── */}
      <section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-5 bg-sky-500 rounded-full" />
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">Sub-Tes Yang Diujikan</h2>
              <p className="text-[11px] text-slate-500 font-medium">7 instrumen asesmen kognitif resmi Astra Group</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60">
            <Clock className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <span>Format timer otomatis berpindah sub-tes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(ASTRA_SUBTESTS).map(([key, sub]) => {
            const col = SUBTEST_COLORS[key] ?? { bg: 'bg-slate-100', text: 'text-slate-700' }
            return (
              <div key={key}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/40 transition-all duration-200 group">
                <div className={`w-9 h-9 rounded-lg ${col.bg} ${col.text} font-extrabold flex items-center justify-center text-xs flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs`}>
                  {key}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">{sub.full}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                    <span>{sub.soal} soal</span>
                    <span className="text-slate-300">•</span>
                    <span>{sub.minutes} menit</span>
                  </p>
                </div>
              </div>
            )
          })}
          {/* Info card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-100/80 to-slate-50 border border-dashed border-slate-200/90 text-slate-600">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 text-sky-600 font-bold flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-700 block">Format Terstandarisasi</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Urutan sub-tes sesuai tes asli</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2-Kolom: Paket + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

        {/* Left: Paket + Riwayat */}
        <div className="lg:col-span-8 space-y-7">

          {/* Paket Simulasi */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Paket Simulasi</h2>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {packages.length} Paket Tersedia
              </span>
            </div>

            {packages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center">
                <p className="font-bold text-slate-700">Belum ada paket tersedia</p>
                <p className="text-sm mt-1 text-slate-500">Pantau terus untuk update paket baru</p>
              </div>
            ) : (
              <div className="space-y-3">
                {packages.map((pkg, i) => (
                  <AstraPackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isLoggedIn={isLoggedIn}
                    hasPremium={hasPremium}
                    isUnlocked={unlockedPackageIds.includes(pkg.id)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Simulasi */}
          {isLoggedIn && recentAttempts.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Riwayat Simulasi Saya</h2>
                <span className="text-xs text-slate-400 font-medium">{recentAttempts.length} Percobaan Terakhir</span>
              </div>
              <div className="divide-y divide-slate-100">
                {recentAttempts.map((a, i) => {
                  const scoreColor = SCORE_COLORS[i % SCORE_COLORS.length]
                  return (
                    <Link key={a.id} href={`/hasil/${a.id}`}
                      className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors group">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl border font-black text-sm flex items-center justify-center shrink-0 ${scoreColor}`}>
                          {a.score ?? '–'}
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {packageNameMap[a.package_id] ?? 'Paket'}
                          </h4>
                          <p className="text-[11px] text-slate-400">{formatDate(a.started_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <span className="text-xs font-medium hidden sm:inline">Pembahasan</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <Link href="/riwayat"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  <span>Lihat Semua Riwayat</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">

          {/* Sistem Penilaian */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              Sistem Penilaian
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200/60">
                Semua Sub-tes
              </div>
              {[
                { l: 'Benar', v: '+1', c: 'font-bold text-emerald-600 text-sm' },
                { l: 'Salah', v: '0', c: 'font-bold text-slate-700 text-sm' },
                { l: 'Tidak dijawab', v: '0', c: 'font-bold text-slate-700 text-sm' },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600">{r.l}</span>
                  <span className={r.c}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-emerald-900 leading-snug">
                Tidak ada penalti nilai minus! Jawab semua soal sebelum timer sub-tes habis.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Tips Sukses Astra
            </h3>
            <div className="space-y-4">
              {[
                { Icon: Zap,      iconBg: 'bg-amber-50 border-amber-100', iconC: 'text-amber-600', title: 'Perceptual Speed', text: '30 soal dalam 2 menit. Latih kecepatan membaca pola karakter & hindari terpaku pada 1 nomor.' },
                { Icon: Brain,    iconBg: 'bg-purple-50 border-purple-100', iconC: 'text-purple-600', title: 'Working Memory', text: 'Buat asosiasi mental kata-angka saat menghafal. Fokus di jeda antar soal.' },
                { Icon: Box,      iconBg: 'bg-sky-50 border-sky-100', iconC: 'text-sky-600', title: 'Visualization & IR', text: 'Pelajari pola rotasi & jaring-jaring bangun ruang. Latih dengan gambar nyata.' },
                { Icon: BookOpen, iconBg: 'bg-teal-50 border-teal-100', iconC: 'text-teal-600', title: 'Reading Comprehension', text: 'Baca sekali dengan fokus, jawab tanpa kembali ke teks. Tandai kata kunci.' },
              ].map(({ Icon, iconBg, iconC, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl ${iconBg} ${iconC} flex items-center justify-center flex-shrink-0 mt-0.5 border`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest CTA */}
          {!isLoggedIn && (
            <div className="rounded-3xl p-6 text-white border border-slate-700"
              style={{ background: 'linear-gradient(135deg, #0B1C2D, #123150, #0A1A29)' }}>
              <p className="font-bold text-sm mb-1">Mulai Latihan Gratis</p>
              <p className="text-white/60 text-xs mb-4 leading-relaxed">Daftar sekarang dan akses paket simulasi tanpa biaya.</p>
              <Link href="/register"
                className="block w-full text-center py-2 px-3 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-colors">
                Upgrade Sekarang
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
