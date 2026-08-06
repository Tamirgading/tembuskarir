import Link from 'next/link'
import { Zap, BookOpen, ChevronRight, Clock, FileText, Layers } from 'lucide-react'
import { PLN_SUBTESTS } from '@/lib/exam-scoring'

const GAT_STATS = [
  { v: '8', l: 'sub-tes' },
  { v: '210', l: 'total soal' },
  { v: '180', l: 'menit' },
]
const T2_STATS = [
  { v: '12', l: 'bidang' },
  { v: '100', l: 'total soal' },
  { v: '100', l: 'menit' },
]

export default function PlnHubPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">Portal Seleksi</p>
        <h1 className="text-2xl font-heading font-extrabold text-ink">Rekrutmen PLN</h1>
        <p className="text-ink-muted mt-1.5">Seleksi PT PLN (Persero) terdiri dari dua tahap. Pilih tahap yang ingin kamu persiapkan.</p>
      </div>

      {/* 2 kartu utama */}
      <div className="grid sm:grid-cols-2 gap-5">

        {/* Tahap 1 — GAT */}
        <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft flex flex-col">
          <div className="px-6 py-6 text-white flex-1" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-4.5 h-4.5 text-white/80" />
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wider font-semibold">Tahap 1</p>
                <p className="text-white font-heading font-bold text-base leading-snug">General Aptitude Test</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Tes Aptitude umum: 8 sub-tes kognitif berurutan. Wajib untuk semua pelamar PLN, tanpa terkecuali.
            </p>
            {/* Sub-tes grid kecil */}
            <div className="flex flex-wrap gap-1 mb-4">
              {Object.keys(PLN_SUBTESTS).map((k) => (
                <span key={k} className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-white/70 rounded">{k}</span>
              ))}
            </div>
            <div className="flex gap-4">
              {GAT_STATS.map((s) => (
                <div key={s.l}>
                  <p className="font-num font-extrabold text-white text-xl leading-none">{s.v}</p>
                  <p className="text-white/50 text-[10px]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <Link href="/portal/pln/gat"
            className="flex items-center justify-between px-6 py-4 bg-white hover:bg-paper-soft transition-colors border-t border-hairline group">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText className="w-4 h-4 text-brand" />
              Lihat Paket Simulasi GAT
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-brand transition-colors" />
          </Link>
        </div>

        {/* Tahap 2 — Akademik */}
        <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft flex flex-col">
          <div className="px-6 py-6 flex-1" style={{ background: 'linear-gradient(135deg,#1a3a2e,#0d2118)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-4.5 h-4.5 text-white/80" />
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wider font-semibold text-white">Tahap 2</p>
                <p className="text-white font-heading font-bold text-base leading-snug">Akademik &amp; Bahasa Inggris</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Tes bidang keilmuan + Bahasa Inggris. Materi Akademik berbeda per bidang; pilih bidangmu terlebih dahulu.
            </p>
            <div className="flex gap-1 mb-4">
              {['Akademik', 'Bahasa Inggris'].map((l) => (
                <span key={l} className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-white/70 rounded">{l}</span>
              ))}
            </div>
            <div className="flex gap-4">
              {T2_STATS.map((s) => (
                <div key={s.l}>
                  <p className="font-num font-extrabold text-white text-xl leading-none">{s.v}</p>
                  <p className="text-white/50 text-[10px]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <Link href="/portal/pln/tahap2"
            className="flex items-center justify-between px-6 py-4 bg-white hover:bg-paper-soft transition-colors border-t border-hairline group">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Layers className="w-4 h-4 text-brand" />
              Pilih Bidang Akademik
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-brand transition-colors" />
          </Link>
        </div>
      </div>

      {/* Info alur */}
      <div className="bg-paper-soft rounded-2xl border border-hairline p-5">
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Alur Seleksi PLN</p>
        <div className="flex items-center gap-3 flex-wrap text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-num font-bold flex items-center justify-center shrink-0">1</span>
            <span>Lolos Administrasi</span>
          </div>
          <ChevronRight className="w-4 h-4 text-hairline shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-num font-bold flex items-center justify-center shrink-0">2</span>
            <span><strong className="text-ink">Tahap 1: GAT</strong> (semua pelamar)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-hairline shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-num font-bold flex items-center justify-center shrink-0">3</span>
            <span><strong className="text-ink">Tahap 2: Akademik + BI</strong> (yang lolos Tahap 1)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-hairline shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-paper-soft border border-hairline text-ink-muted text-xs font-num font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-ink-muted">Wawancara &amp; lanjutan</span>
          </div>
        </div>
      </div>

      {/* Info timer per tahap */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-hairline p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand shrink-0" />
          <div>
            <p className="text-sm font-semibold text-ink">Tahap 1 · 180 menit total</p>
            <p className="text-xs text-ink-muted">8 sub-tes dengan timer terpisah, dikerjakan berurutan</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-hairline p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand shrink-0" />
          <div>
            <p className="text-sm font-semibold text-ink">Tahap 2 · 100 menit total</p>
            <p className="text-xs text-ink-muted">50 mnt Akademik + 50 mnt Bahasa Inggris, urutan bebas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
