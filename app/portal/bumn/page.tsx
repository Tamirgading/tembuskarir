import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Zap, Languages, ChevronRight, FileText, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'

export default async function BumnHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const flags = await getEffectiveFeatureFlags(user?.email)
  if (!flags.feature_portal_bumn) redirect('/')

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="rounded-3xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-8 text-white" style={{ background: 'linear-gradient(135deg,#4C1D95,#1e1b4b)' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-white/80" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-bold uppercase tracking-widest mb-1">Rekrutmen Bersama</p>
              <h1 className="text-2xl font-heading font-extrabold leading-tight">Rekrutmen BUMN</h1>
              <p className="text-white/65 text-sm mt-2 max-w-lg leading-relaxed">
                Simulasi tes Rekrutmen Bersama BUMN (RBB). Tahap 1 berisi TKD, AKHLAK &amp; TWK; Tahap 2 berisi Tes Bahasa Inggris.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2 kartu tahap */}
      <div className="grid sm:grid-cols-2 gap-5">

        {/* Tahap 1 — GAT */}
        <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft flex flex-col">
          <div className="px-6 py-6 text-white flex-1" style={{ background: 'linear-gradient(135deg,#4C1D95,#312e81)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-4.5 h-4.5 text-white/80" />
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wider font-semibold">Tahap 1</p>
                <p className="text-white font-heading font-bold text-base leading-snug">TKD · AKHLAK · TWK</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Tes Kemampuan Dasar (VLR, NS, WC, DIAG), AKHLAK, dan TWK. Wajib untuk semua pelamar BUMN.
            </p>
            <div className="flex gap-1 mb-4 flex-wrap">
              {['VLR', 'NS', 'WC', 'DIAG', 'AKHLAK', 'TWK'].map((k) => (
                <span key={k} className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-white/70 rounded">{k}</span>
              ))}
            </div>
            <div className="flex gap-4">
              {[{ v: '200', l: 'soal' }, { v: '3', l: 'materi' }, { v: '113', l: 'menit' }].map((s) => (
                <div key={s.l}>
                  <p className="font-num font-extrabold text-white text-xl leading-none">{s.v}</p>
                  <p className="text-white/50 text-[10px]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <Link href="/portal/bumn/tahap1"
            className="flex items-center justify-between px-6 py-4 bg-white hover:bg-paper-soft transition-colors border-t border-hairline group">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <FileText className="w-4 h-4 text-violet-600" />
              Lihat Paket Simulasi Tahap 1
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-violet-600 transition-colors" />
          </Link>
        </div>

        {/* Tahap 2 — Bahasa Inggris */}
        <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft flex flex-col">
          <div className="px-6 py-6 flex-1" style={{ background: 'linear-gradient(135deg,#1e3a8a,#172554)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Languages className="w-4.5 h-4.5 text-white/80" />
              </div>
              <div>
                <p className="text-white/55 text-[10px] uppercase tracking-wider font-semibold">Tahap 2</p>
                <p className="text-white font-heading font-bold text-base leading-snug">Tes Bahasa Inggris</p>
              </div>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Untuk peserta yang lolos Tahap 1. Materi: Error Recognition, Reading Comprehension, dan Sentence Completion.
            </p>
            <div className="flex gap-1 mb-4 flex-wrap">
              {['ER', 'RC', 'SC'].map((k) => (
                <span key={k} className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-white/70 rounded">{k}</span>
              ))}
            </div>
            <div className="flex gap-4">
              {[{ v: '85', l: 'soal' }, { v: '3', l: 'sub-bagian' }, { v: '80', l: 'menit' }].map((s) => (
                <div key={s.l}>
                  <p className="font-num font-extrabold text-white text-xl leading-none">{s.v}</p>
                  <p className="text-white/50 text-[10px]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <Link href="/portal/bumn/tahap2"
            className="flex items-center justify-between px-6 py-4 bg-white hover:bg-paper-soft transition-colors border-t border-hairline group">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Lihat Paket Simulasi Tahap 2
            </div>
            <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Info alur */}
      <div className="bg-paper-soft rounded-2xl border border-hairline p-5">
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3">Alur Rekrutmen Bersama BUMN</p>
        <div className="flex items-center gap-3 flex-wrap text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand text-white text-xs font-num font-bold flex items-center justify-center shrink-0">1</span>
            <span>Lolos Administrasi</span>
          </div>
          <ChevronRight className="w-4 h-4 text-hairline shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-num font-bold flex items-center justify-center shrink-0">2</span>
            <span><strong className="text-ink">Tahap 1: TKD + AKHLAK + TWK</strong></span>
          </div>
          <ChevronRight className="w-4 h-4 text-hairline shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-num font-bold flex items-center justify-center shrink-0">3</span>
            <span><strong className="text-ink">Tahap 2: Bahasa Inggris</strong></span>
          </div>
          <ChevronRight className="w-4 h-4 text-hairline shrink-0" />
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-paper-soft border border-hairline text-ink-muted text-xs font-num font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-ink-muted">Tes lanjutan &amp; wawancara</span>
          </div>
        </div>
      </div>

      {/* BUMN yang pakai format ini */}
      <div className="bg-white rounded-2xl border border-hairline shadow-soft px-5 py-4">
        <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-3">BUMN yang Menggunakan Format Ini</p>
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
