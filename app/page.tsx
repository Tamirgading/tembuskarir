import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Banknote, BriefcaseBusiness, Zap, MonitorCheck, BarChart3, BookOpenCheck,
  ArrowRight, CheckCircle2, ChevronDown,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import LandingNavbar from '@/components/ui/LandingNavbar'

async function getAuthState() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { isLoggedIn: false }
    return { isLoggedIn: true }
  } catch {
    return { isLoggedIn: false }
  }
}

// ── Komponen FAQ item ────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-hairline rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-ink text-sm select-none hover:bg-paper-soft transition-colors">
        {q}
        <ChevronDown className="w-4 h-4 text-ink-muted shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4 text-sm text-ink-muted leading-relaxed border-t border-hairline pt-3">
        {a}
      </div>
    </details>
  )
}

export default async function HomePage() {
  const { isLoggedIn } = await getAuthState()

  return (
    <>
      <LandingNavbar isLoggedIn={isLoggedIn} firstName={null} />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-paper pt-20 pb-24">
        <div className="absolute inset-0 bg-grid-slate opacity-40 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/7 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-hairline rounded-full text-ink-soft text-xs font-semibold mb-7 shadow-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Simulasi tes kerja BUMN &amp; Swasta
          </div>

          <h1 className="text-[2.75rem] sm:text-[3.75rem] font-heading font-extrabold text-ink leading-[1.06] tracking-tight mb-6">
            Latihan yang terasa<br />
            <span className="text-brand">persis seperti tesnya.</span>
          </h1>

          <p className="text-lg text-ink-muted leading-relaxed mb-10 max-w-xl mx-auto">
            Simulasi rekrutmen PLN, ASTRA, dan BUMN dengan format per-sub-tes dan timer seperti aslinya. Setiap hasil memetakan kesiapanmu secara terperinci.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-14">
            <Link href={isLoggedIn ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand text-white font-bold text-base hover:bg-brand-700 transition-colors shadow-soft">
              {isLoggedIn ? 'Ke Dashboard' : 'Mulai Gratis'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#jenis-tes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-hairline text-ink font-semibold text-base hover:bg-paper-soft transition-colors">
              Lihat Jenis Tes
            </Link>
          </div>

          {/* Trust strip — centered */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-8 border-t border-hairline">
            {[
              { k: '2.000+', l: 'Peserta aktif' },
              { k: '7', l: 'Sub-tes ASTRA' },
              { k: '100%', l: 'Format tes asli' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-num font-extrabold text-2xl text-ink">{s.k}</p>
                <p className="text-xs text-ink-muted mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ BUKTI ANGKA ════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white border-y border-hairline">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { k: '2.000+', l: 'Pengguna aktif' },
              { k: '90', l: 'Soal per paket ASTRA' },
              { k: '41', l: 'Menit simulasi ASTRA' },
              { k: '7', l: 'Sub-tes terukur' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-num font-extrabold text-3xl text-ink">{s.k}</p>
                <p className="text-sm text-ink-muted mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FITUR ══════════════════════════════════════════════════════════════ */}
      <section id="fitur" className="py-20 bg-paper">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand font-bold text-sm uppercase tracking-wider mb-2">Kenapa TembusKarir</p>
            <h2 className="text-3xl font-heading font-extrabold text-ink">Dibuat untuk membuatmu siap</h2>
            <p className="text-ink-muted mt-3 max-w-lg mx-auto">Bukan sekadar kumpulan soal — sistem yang memberi tahu kamu persis di mana kamu berdiri.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <MonitorCheck className="w-6 h-6" />,
                title: 'Simulasi Sungguhan',
                desc: 'Format per-sub-tes, timer terpisah, dan antarmuka yang dirancang persis seperti tes PLN & ASTRA aslinya. Latih mental sebelum hari-H.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Peta Kesiapan',
                desc: 'Setiap simulasi memetakan penguasaanmu per sub-tes, menyoroti kelemahan, dan merekomendasikan langkah berikut yang tepat.',
              },
              {
                icon: <BookOpenCheck className="w-6 h-6" />,
                title: 'Pembahasan Rinci',
                desc: 'Tinjau setiap soal setelah ujian dengan penjelasan lengkap. Pahami konsepnya, bukan sekadar tahu jawaban benarnya.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-hairline hover:shadow-soft transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-heading font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JENIS TES ══════════════════════════════════════════════════════════ */}
      <section id="jenis-tes" className="py-20 bg-white border-y border-hairline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-brand font-bold text-sm uppercase tracking-wider mb-2">Jalur Seleksi</p>
            <h2 className="text-3xl font-heading font-extrabold text-ink">Pilih jenis tesmu</h2>
            <p className="text-ink-muted mt-2">Format &amp; sub-tes sudah disesuaikan persis dengan tes aslinya.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {/* ASTRA */}
            <div className="bg-white rounded-2xl border border-hairline hover:shadow-soft hover:border-brand/30 transition-all p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
                    <BriefcaseBusiness className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ink">Psikotes ASTRA</p>
                    <p className="text-xs text-ink-muted">PT Astra International</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand-700">Tersedia</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {['QR','DR','RC','IR','VIZ','PS','WM'].map((k) => (
                  <span key={k} className="text-[10px] font-bold px-1.5 py-0.5 bg-paper-soft border border-hairline rounded text-ink-muted">{k}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-ink-muted mb-4">
                <span className="font-num">80 soal · 7 sub-tes · 41 mnt</span>
                <span className="font-semibold text-brand-700 bg-brand/10 px-2 py-0.5 rounded-full">Gratis &amp; Premium</span>
              </div>
              <Link href="/portal/astra"
                className="block w-full text-center py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
                Latihan Sekarang →
              </Link>
            </div>

            {/* PLN */}
            <div className="bg-white rounded-2xl border border-hairline hover:shadow-soft hover:border-brand/30 transition-all p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-ink">Rekrutmen PLN — GAT</p>
                    <p className="text-xs text-ink-muted">PT PLN (Persero)</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand-700">Tersedia</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand text-white">Baru</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {['NUM','VER','SIL','DER','FIG','PU','LA','AKHLAK'].map((k) => (
                  <span key={k} className="text-[10px] font-bold px-1.5 py-0.5 bg-paper-soft border border-hairline rounded text-ink-muted">{k}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-ink-muted mb-4">
                <span className="font-num">210 soal · 8 sub-tes · 180 mnt</span>
                <span className="font-semibold text-brand-700 bg-brand/10 px-2 py-0.5 rounded-full">Gratis &amp; Premium</span>
              </div>
              <Link href="/portal/pln"
                className="block w-full text-center py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
                Latihan Sekarang →
              </Link>
            </div>
          </div>

          {/* Coming soon — row compact */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Image src="/card-ojk.png" width={32} height={32} alt="OJK" className="rounded-lg object-cover w-8 h-8" />, title: 'PCAM OJK', sub: 'Otoritas Jasa Keuangan' },
              { icon: <Banknote className="w-5 h-5 text-white" />, title: 'PCPM Bank Indonesia', sub: 'Bank Sentral RI' },
            ].map((item) => (
              <div key={item.title} className="relative bg-paper-soft rounded-2xl border border-hairline p-4 flex items-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-paper-soft/80 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <span className="text-[10px] font-bold text-ink-muted bg-white border border-hairline px-4 py-1.5 rounded-lg tracking-widest">SEGERA HADIR</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center shrink-0 text-white">
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">{item.title}</p>
                  <p className="text-xs text-ink-muted">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CARA KERJA ═════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand font-bold text-sm uppercase tracking-wider mb-2">Alur Belajar</p>
            <h2 className="text-3xl font-heading font-extrabold text-ink">Tiga langkah menuju siap</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px border-t border-dashed border-hairline" />
            {[
              { num: 1, title: 'Pilih Jalur Seleksi', desc: 'Tentukan jenis tes sesuai lowongan kerja yang kamu incar.' },
              { num: 2, title: 'Kerjakan Simulasi', desc: 'Format per-sub-tes dengan timer terpisah — persis kondisi tes nyata.', active: true },
              { num: 3, title: 'Pelajari Kesiapanmu', desc: 'Lihat peta kesiapan, tutup kelemahan, dan ulangi sampai siap.' },
            ].map((step) => (
              <div key={step.num} className="relative z-10 text-center">
                <div className={`w-16 h-16 rounded-full border-4 border-white shadow-soft flex items-center justify-center font-num font-extrabold text-2xl mx-auto mb-4 ${
                  step.active ? 'bg-brand text-white' : 'bg-paper text-brand'
                }`}>
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted px-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-hairline">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-heading font-extrabold text-ink">Pertanyaan yang sering ditanya</h2>
          </div>
          <div className="space-y-3">
            <FaqItem
              q="Apakah TembusKarir gratis?"
              a="Ya, ada paket gratis yang bisa langsung dicoba tanpa kartu kredit. Paket premium mulai Rp 39.000/bulan membuka akses ke semua paket soal dan analisis lengkap."
            />
            <FaqItem
              q="Seberapa mirip dengan tes aslinya?"
              a="Sangat mirip — format per-sub-tes, timer terpisah per sub-tes, dan tipe soal disesuaikan dengan kisi-kisi rekrutmen PLN dan ASTRA yang beredar."
            />
            <FaqItem
              q="Berapa lama akses premium aktif?"
              a="Paket bulanan aktif 30 hari, paket 3 bulan aktif 90 hari. Keduanya bisa diperpanjang kapan saja dan durasi langsung ditambahkan."
            />
            <FaqItem
              q="Metode pembayaran apa yang tersedia?"
              a="Transfer bank, QRIS, GoPay, OVO, Dana, dan kartu kredit/debit via Midtrans. Akses aktif otomatis dalam detik setelah pembayaran dikonfirmasi."
            />
            <FaqItem
              q="Apakah bisa diakses di HP?"
              a="Ya, tampilan responsif dan sudah dioptimalkan untuk mobile. Tersedia juga navigasi bawah saat login untuk pengalaman seperti aplikasi."
            />
          </div>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
        <div className="absolute -top-24 -right-16 w-96 h-96 bg-brand/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
            Mulai petakan kesiapanmu hari ini
          </h2>
          <p className="text-white/60 mb-8 text-lg max-w-xl mx-auto">
            Daftar gratis, kerjakan simulasi pertamamu, dan lihat persis di mana kamu berdiri.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={isLoggedIn ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-700 transition-colors">
              {isLoggedIn ? 'Ke Dashboard' : 'Mulai Gratis'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#jenis-tes"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
              Lihat Jenis Tes
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-5 mt-8 text-sm text-white/50">
            {['Gratis tanpa kartu kredit', 'Akses premium mulai Rp 39.000/bln', 'Bayar via QRIS &amp; e-wallet'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-brand-300" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <footer className="bg-ink text-white/55 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <p className="text-sm leading-relaxed max-w-xs">
                Simulasi tes rekrutmen kerja yang terasa seperti aslinya.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Produk</h4>
              <ul className="space-y-3 text-sm font-medium">
                {[
                  { label: 'Psikotes ASTRA', href: '/portal/astra' },
                  { label: 'Rekrutmen PLN', href: '/portal/pln' },
                  { label: 'Paket &amp; Harga', href: '/harga' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-brand-300 transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" />
                      <span dangerouslySetInnerHTML={{ __html: l.label }} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Komunitas</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <a href="https://www.youtube.com/@Tembuskarir" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@tembuskarir" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-pink-400 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" /></svg>
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
            <p>© 2025 TembusKarir. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
