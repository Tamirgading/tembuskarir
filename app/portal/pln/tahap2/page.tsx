import Link from 'next/link'
import { ArrowRight, BookOpen, Languages } from 'lucide-react'
import { AKDING_BIDANG } from '@/lib/bidang-config'

export default function PlnTahap2SelectionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-7">

      {/* Header */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-7 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/portal/pln" className="hover:text-white transition-colors">Portal PLN</Link>
            <span>›</span>
            <span className="text-white/80">Tahap 2 — Akademik</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2 block">PLN Recruitment</span>
              <h1 className="text-2xl font-heading font-extrabold mb-2">Tahap 2 — Akademik &amp; Bahasa Inggris</h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                Simulasi tes akademik sesuai bidang keilmuan dan bahasa Inggris. Total 100 soal, 100 menit.
                Pilih bidangmu untuk mulai.
              </p>
            </div>
          </div>
          {/* Info strip */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { v: '100', l: 'total soal' },
              { v: '50', l: 'soal Akademik' },
              { v: '50', l: 'soal Bahasa Inggris' },
              { v: '100', l: 'menit' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-xl px-4 py-2 text-center">
                <p className="font-num font-bold text-white">{s.v}</p>
                <p className="text-white/55 text-[10px]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Paket yang tersedia */}
        <div className="bg-white px-6 py-4 flex items-center gap-5">
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Languages className="w-4 h-4 text-brand shrink-0" />
            <span><strong className="text-ink">Bahasa Inggris</strong> — 1 paket, sama untuk semua bidang</span>
          </div>
          <div className="h-4 w-px bg-hairline shrink-0" />
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <BookOpen className="w-4 h-4 text-brand shrink-0" />
            <span><strong className="text-ink">Akademik (AKDING)</strong> — 12 bidang tersedia</span>
          </div>
        </div>
      </div>

      {/* Pilih bidang */}
      <div>
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">
          Pilih Bidang Akademikmu
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AKDING_BIDANG.map((b) => (
            <Link
              key={b.slug}
              href={`/portal/pln/tahap2/${b.slug}`}
              className="group flex items-center gap-3.5 bg-white rounded-2xl border border-hairline px-4 py-4 hover:shadow-soft hover:border-brand/30 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold ${b.color}`}>
                {b.short.split(' ')[0].substring(0, 3).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink leading-snug">{b.name}</p>
                <p className="text-xs text-ink-muted mt-0.5">Akademik + Bahasa Inggris</p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-brand transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Info harga */}
      <div className="bg-paper-soft rounded-2xl border border-hairline p-5">
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Info Akses</p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-white rounded-xl border border-hairline p-3.5">
            <p className="font-semibold text-ink mb-0.5">Coba Gratis</p>
            <p className="text-xs text-ink-muted">20 soal Akademik + 20 soal Bahasa Inggris per bidang</p>
          </div>
          <div className="bg-white rounded-xl border border-hairline p-3.5">
            <p className="font-semibold text-ink mb-0.5">Satuan <span className="font-num">Rp 10.000</span></p>
            <p className="text-xs text-ink-muted">Beli 1 paket: Akademik saja atau Bahasa Inggris saja</p>
          </div>
          <div className="bg-brand rounded-xl p-3.5 text-white">
            <p className="font-semibold mb-0.5">Langganan dari <span className="font-num">Rp 30.000</span>/bln</p>
            <p className="text-xs text-white/70">Tahap 1, Tahap 2, atau Complete — pilih 1 bidang</p>
          </div>
        </div>
      </div>
    </div>
  )
}
