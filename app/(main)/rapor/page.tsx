import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  TrendingUp, TrendingDown, BarChart3, Briefcase, Zap, Building2, FileText, Target,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ASTRA_SUBTESTS, PLN_SUBTESTS } from '@/lib/exam-scoring'

export const metadata: Metadata = {
  title: 'Rapor Belajar',
  description: 'Perkembangan skor dan rincian penguasaan per sub-tes dari simulasimu.',
}

interface CatStats { correct: number; wrong: number; empty: number; rawScore: number }
interface AttemptRow {
  id: string
  package_id: string
  score: number | null
  started_at: string
  score_details: { categories?: Record<string, CatStats> } | null
}

const SUBTEST_FULL: Record<string, string> = Object.fromEntries([
  ...Object.entries(ASTRA_SUBTESTS).map(([k, v]) => [k, v.full]),
  ...Object.entries(PLN_SUBTESTS).map(([k, v]) => [k, v.full]),
])

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  ASTRA: Briefcase, PLN: Zap, BUMN: Building2,
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

export default async function RaporPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: attData } = await supabase
    .from('attempts')
    .select('id, package_id, score, started_at, score_details')
    .eq('user_id', user.id)
    .eq('status', 'finished')
    .order('started_at', { ascending: true })
    .limit(200)

  const attempts = (attData ?? []) as AttemptRow[]

  // Kategori tiap paket
  const pkgIds = Array.from(new Set(attempts.map((a) => a.package_id)))
  const pkgCat: Record<string, string> = {}
  if (pkgIds.length > 0) {
    const { data: pkgData } = await supabase
      .from('packages').select('id, category').in('id', pkgIds)
    for (const p of (pkgData ?? []) as { id: string; category: string }[]) {
      pkgCat[p.id] = p.category
    }
  }

  // Kelompokkan attempts per kategori paket (urutan kronologis dipertahankan)
  const byCategory: Record<string, AttemptRow[]> = {}
  for (const a of attempts) {
    const cat = pkgCat[a.package_id] ?? 'LAINNYA'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(a)
  }
  const categories = Object.keys(byCategory).sort()

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-up">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-ink">Rapor Belajar</h1>
        <p className="text-[13px] text-ink-muted mt-1">
          Tren skor dan penguasaan per sub-tes dari seluruh simulasimu, per jalur seleksi.
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="bg-white border border-hairline rounded-2xl p-10 text-center shadow-soft">
          <div className="grid place-items-center mx-auto mb-3 bg-brand/10 rounded-2xl w-14 h-14">
            <BarChart3 className="w-[26px] h-[26px] text-brand" />
          </div>
          <p className="font-heading font-bold text-[15px] text-ink">Rapormu masih kosong</p>
          <p className="text-[12.5px] leading-relaxed text-ink-muted mt-1 max-w-sm mx-auto">
            Selesaikan minimal satu simulasi. Rapor akan menampilkan tren skor dan rincian kekuatanmu per sub-tes.
          </p>
          <Link href="/paket"
            className="inline-block mt-4 bg-brand text-white text-[13px] font-bold rounded-xl px-4 py-2 hover:bg-brand-700 transition-colors">
            Lihat Semua Paket
          </Link>
        </div>
      ) : (
        categories.map((cat) => <CategorySection key={cat} category={cat} attempts={byCategory[cat]} />)
      )}
    </div>
  )
}

function CategorySection({ category, attempts }: { category: string; attempts: AttemptRow[] }) {
  const Icon = CATEGORY_ICON[category] ?? FileText
  const last = attempts[attempts.length - 1]
  const prev = attempts.length > 1 ? attempts[attempts.length - 2] : null
  const lastScore = last.score ?? 0
  const delta = prev ? lastScore - (prev.score ?? 0) : null

  // Tren skor — maksimal 8 titik terakhir
  const trend = attempts.slice(-8).map((a) => ({ d: fmtDate(a.started_at), v: a.score ?? 0 }))
  const maxTrend = Math.max(...trend.map((t) => t.v), 1)

  // Agregasi penguasaan per sub-tes dari seluruh attempts kategori ini
  const agg: Record<string, CatStats> = {}
  for (const a of attempts) {
    for (const [code, s] of Object.entries(a.score_details?.categories ?? {})) {
      if (!agg[code]) agg[code] = { correct: 0, wrong: 0, empty: 0, rawScore: 0 }
      agg[code].correct += s.correct ?? 0
      agg[code].wrong += s.wrong ?? 0
      agg[code].empty += s.empty ?? 0
      agg[code].rawScore += s.rawScore ?? 0
    }
  }
  const mastery = Object.entries(agg)
    .map(([code, s]) => {
      const total = s.correct + s.wrong + s.empty
      const pct = total > 0 ? Math.round((s.correct / total) * 100) : 0
      return { code, pct, total, correct: s.correct }
    })
    .filter((m) => m.total > 0)
    .sort((a, b) => a.pct - b.pct)
  const weakest = mastery[0]

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand/10">
          <Icon className="w-[18px] h-[18px] text-brand" />
        </span>
        <h2 className="font-heading font-bold text-lg text-ink">{category}</h2>
        <span className="ml-auto text-[11.5px] font-semibold text-ink-muted bg-paper-soft border border-hairline rounded-full px-2.5 py-0.5">
          {attempts.length} simulasi
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4 items-stretch">
        {/* Skor terakhir + tren */}
        <div className="bg-white border border-hairline rounded-2xl p-5 shadow-soft">
          <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-3">Skor terakhir</p>
          <div className="flex items-end gap-2">
            <span className="font-num font-bold text-[36px] leading-none text-ink">{lastScore}</span>
            {delta !== null && (
              <span className={`flex items-center gap-0.5 font-num text-[13px] font-bold mb-1 ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {delta >= 0 ? <TrendingUp className="w-[13px] h-[13px]" /> : <TrendingDown className="w-[13px] h-[13px]" />}
                {delta >= 0 ? '+' : ''}{delta}
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-ink-muted mt-1">Simulasi {fmtDate(last.started_at)}</p>

          {/* Mini bar chart tren */}
          <div className="flex items-end gap-1.5 h-20 mt-4">
            {trend.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <div
                  className={`w-full rounded-t-md ${i === trend.length - 1 ? 'bg-brand' : 'bg-brand/25'}`}
                  style={{ height: `${Math.max(8, (t.v / maxTrend) * 100)}%` }}
                  title={`${t.d}: ${t.v}`}
                />
                <span className="text-[9px] text-ink-muted truncate w-full text-center">{t.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Penguasaan sub-tes */}
        <div className="bg-white border border-hairline rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">Penguasaan sub-tes</p>
            <span className="text-[10.5px] text-ink-muted">agregat semua simulasi</span>
          </div>
          {mastery.length === 0 ? (
            <p className="text-[12.5px] text-ink-muted py-4">Belum ada rincian per sub-tes.</p>
          ) : (
            <div className="space-y-0.5">
              {mastery.map((m) => (
                <div key={m.code} className="flex items-center gap-3 py-2 border-b border-hairline last:border-0">
                  <span className="w-11 text-[11px] font-bold text-center text-ink bg-paper-soft rounded-md py-1 shrink-0">{m.code}</span>
                  <span className="flex-1 text-[13px] text-ink-soft truncate">{SUBTEST_FULL[m.code] ?? m.code}</span>
                  <span className="w-24 sm:w-32 h-[7px] bg-hairline rounded-full overflow-hidden shrink-0">
                    <span className="block h-full rounded-full" style={{ width: `${m.pct}%`, background: m.pct < 60 ? '#F4B400' : '#0E9F6E' }} />
                  </span>
                  <span className="w-9 text-right font-num font-semibold text-[12.5px] text-ink shrink-0">{m.pct}%</span>
                </div>
              ))}
            </div>
          )}
          {weakest && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-3">
              <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-[12px] text-amber-800">
                Fokus latihan: <strong>{SUBTEST_FULL[weakest.code] ?? weakest.code}</strong> — baru {weakest.pct}% benar.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
