'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase, Zap, Building2, FileText, ChevronRight,
  TrendingUp, Award, Layers, Inbox,
} from 'lucide-react'

export interface RiwayatAttempt {
  id: string
  name: string
  category: string
  score: number
  correctCount: number | null
  totalQuestions: number | null
  startedAt: string
  durationSeconds: number | null
}

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  ASTRA: Briefcase,
  PLN: Zap,
  BUMN: Building2,
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtDur = (s: number | null) => {
  if (!s) return null
  const m = Math.round(s / 60)
  return m < 60 ? `${m} mnt` : `${Math.floor(m / 60)} jam ${m % 60} mnt`
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="bg-white border border-hairline rounded-2xl p-4 text-center shadow-soft">
      <div className="flex justify-center mb-1.5">{icon}</div>
      <p className="font-num font-bold text-[22px] leading-none text-ink">{value}</p>
      <p className="text-[11px] text-ink-muted mt-1">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white border border-hairline rounded-2xl p-10 text-center shadow-soft">
      <div className="grid place-items-center mx-auto mb-3 bg-paper-soft rounded-2xl w-14 h-14">
        <Inbox className="w-[26px] h-[26px] text-ink-muted" />
      </div>
      <p className="font-heading font-bold text-[15px] text-ink">Belum ada simulasi</p>
      <p className="text-[12.5px] leading-relaxed text-ink-muted mt-1 max-w-sm mx-auto">
        Selesaikan simulasi pertamamu untuk melihat riwayat skor di sini.
      </p>
      <Link href="/paket"
        className="inline-block mt-4 bg-brand text-white text-[13px] font-bold rounded-xl px-4 py-2 hover:bg-brand-700 transition-colors">
        Lihat Semua Paket
      </Link>
    </div>
  )
}

export function RiwayatClient({ attempts }: { attempts: RiwayatAttempt[] }) {
  const categories = useMemo(
    () => Array.from(new Set(attempts.map((a) => a.category))).sort(),
    [attempts],
  )
  const [tab, setTab] = useState<string>('SEMUA')
  const filtered = tab === 'SEMUA' ? attempts : attempts.filter((a) => a.category === tab)

  const avg = filtered.length > 0 ? Math.round(filtered.reduce((s, a) => s + a.score, 0) / filtered.length) : 0
  const max = filtered.length > 0 ? Math.max(...filtered.map((a) => a.score)) : 0

  return (
    <div className="space-y-6">
      {categories.length > 1 && (
        <div className="inline-flex p-1 rounded-xl bg-paper-soft border border-hairline">
          {['SEMUA', ...categories].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 sm:px-5 py-2 rounded-[9px] text-[13px] transition-colors ${
                tab === t ? 'bg-white text-brand-700 font-bold shadow-sm' : 'text-ink-muted font-semibold hover:text-ink'
              }`}>
              {t === 'SEMUA' ? 'Semua' : t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<Layers className="w-4 h-4 text-brand" />} value={filtered.length} label="Simulasi" />
            <Stat icon={<TrendingUp className="w-4 h-4 text-brand" />} value={avg} label="Rata-rata skor" />
            <Stat icon={<Award className="w-4 h-4 text-amber-500" />} value={max} label="Tertinggi" />
          </div>
          <div className="space-y-3">
            {filtered.map((a) => <AttemptRow key={a.id} a={a} />)}
          </div>
        </>
      )}
    </div>
  )
}

function AttemptRow({ a }: { a: RiwayatAttempt }) {
  const Icon = CATEGORY_ICON[a.category] ?? FileText
  const dur = fmtDur(a.durationSeconds)
  const benar = a.correctCount !== null && a.totalQuestions
    ? `${a.correctCount}/${a.totalQuestions} benar`
    : null
  return (
    <Link href={`/hasil/${a.id}`}
      className="block bg-white border border-hairline rounded-2xl p-4 shadow-soft card-hover">
      <div className="flex items-center gap-4">
        <div className="grid place-items-center rounded-xl shrink-0 w-[50px] h-[50px] bg-brand/10">
          <span className="font-num font-bold text-[15px] leading-none text-brand-700">{a.score}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Icon className="w-3.5 h-3.5 text-brand" />
            <h3 className="font-heading font-bold text-[14.5px] text-ink truncate">{a.name}</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-paper-soft border border-hairline rounded text-ink-muted">{a.category}</span>
          </div>
          <p className="text-[11.5px] text-ink-muted mt-1">
            {fmtDate(a.startedAt)}
            {dur && ` · ${dur}`}
            {benar && ` · ${benar}`}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-ink-muted shrink-0" />
      </div>
    </Link>
  )
}
