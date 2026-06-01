import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, BriefcaseBusiness, Zap, BookOpenCheck, BarChart3, MonitorCheck, ArrowRight, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import LandingNavbar from '@/components/ui/LandingNavbar'

async function getAuthState() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { isLoggedIn: false, firstName: null }
    const { data } = await supabase.from('users').select('full_name').eq('id', user.id).single()
    const fullName = (data as { full_name: string | null } | null)?.full_name ?? ''
    return { isLoggedIn: true, firstName: fullName.split(' ')[0] || 'Kamu' }
  } catch {
    return { isLoggedIn: false, firstName: null }
  }
}

export default async function HomePage() {
  const { isLoggedIn } = await getAuthState()

  return (
    <>
      <LandingNavbar isLoggedIn={isLoggedIn} firstName={null} />

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-paper">
        <div className="absolute inset-0 bg-grid-slate opacity-50 z-0" />
        {/* satu wash emerald lembut — tenang, bukan glow ramai */}
        <div className="absolute -top-32 -right-24 w-[460px] h-[460px] bg-brand/10 rounded-full blur-[120px] z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Teks */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-hairline text-ink-soft text-xs font-bold tracking-wide mb-6 shadow-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                Simulasi tes kerja BUMN &amp; Swasta
              </div>

              <h1 className="text-4xl lg:text-[3.4rem] font-extrabold font-heading text-ink tracking-tight leading-[1.1] mb-6">
                Latihan yang terasa<br />
                <span className="text-brand">persis seperti tesnya.</span>
              </h1>

              <p className="text-lg text-ink-muted mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Simulasi rekrutmen PLN, ASTRA, dan BUMN dengan format per-subtes & timer seperti aslinya. Setiap hasil memetakan kesiapanmu — kamu tahu persis apa yang harus dilatih berikutnya.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href={isLoggedIn ? '/dashboard' : '/register'}
                  className="inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-xl bg-brand text-white font-bold text-base shadow-soft hover:bg-brand-700 transition-colors">
                  {isLoggedIn ? 'Ke Dashboard' : 'Mulai Gratis'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#jenis-tes"
                  className="inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-ink font-semibold text-base border border-hairline hover:bg-paper-soft transition-colors">
                  <Play className="w-4 h-4 text-brand" /> Lihat Jenis Tes
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-10 pt-7 border-t border-hairline grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {[
                  { k: '2.000+', l: 'Peserta aktif' },
                  { k: '15+', l: 'Sub-tes terukur' },
                  { k: '100%', l: 'Format tes asli' },
                ].map((s) => (
                  <div key={s.l} className="text-center lg:text-left">
                    <p className="font-num font-bold text-2xl text-ink">{s.k}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gambar hero */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 border border-hairline shadow-soft">
                <Image
                  src="/gambar-beranda.png"
                  alt="Ilustrasi Platform Simulasi Tes Kerja"
                  width={600}
                  height={420}
                  className="relative z-10 w-full h-auto rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FITUR ══════════════════════════ */}
      <section id="fitur" className="py-20 bg-white border-y border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand font-bold tracking-wider text-sm uppercase">Kenapa TembusKarir</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink mt-2 mb-3">Dibuat untuk membuatmu siap</h2>
            <p className="text-ink-muted text-lg">Bukan sekadar kumpulan soal — sebuah peta jalan menuju lolos seleksi.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MonitorCheck className="w-6 h-6" />,
                title: 'Simulasi Sungguhan',
                desc: 'Antarmuka, timer, dan urutan sub-tes dibuat presisi seperti tes PLN & ASTRA yang asli. Latih mental sebelum hari-H.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Peta Kesiapan',
                desc: 'Setiap simulasi memetakan penguasaanmu per sub-tes dan menyorot kelemahan — kamu tahu persis apa yang harus dilatih.',
              },
              {
                icon: <BookOpenCheck className="w-6 h-6" />,
                title: 'Pembahasan Lengkap',
                desc: 'Tinjau tiap soal setelah ujian dengan pembahasan rinci. Pahami kenapa, bukan sekadar tahu jawaban benarnya.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-paper rounded-2xl p-7 border border-hairline hover:shadow-soft transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-5">{f.icon}</div>
                <h3 className="text-lg font-bold font-heading text-ink mb-2">{f.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ JENIS TES ══════════════════════════ */}
      <section id="jenis-tes" className="py-16 bg-paper">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-9">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink">Pilih jalur seleksimu</h2>
            <p className="text-ink-muted mt-2.5 text-lg">Pilih kategori sesuai target karier tahun ini.</p>
          </div>

          <div className="space-y-5">
            {/* ── ASTRA ── */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 border border-hairline shadow-soft hover:border-orange-200 transition-colors flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 rounded-l-3xl" />
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tersedia</span>
              </div>

              <div className="w-full sm:w-48 h-36 sm:h-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 relative shadow-sm z-10 flex flex-col items-center justify-center text-white">
                <BriefcaseBusiness className="w-12 h-12 mb-2 opacity-90" />
                <p className="text-sm font-bold">Psikotes ASTRA</p>
                <p className="text-[11px] text-orange-100 mt-0.5">80 soal · per sub-tes</p>
                <div className="flex flex-wrap gap-1 mt-3 justify-center px-2">
                  {['QR', 'DR', 'RC', 'PS'].map((s) => (
                    <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left w-full z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-xs font-bold uppercase">Swasta / BUMN</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-brand/10 text-brand-700 text-xs font-bold uppercase">Gratis &amp; Premium</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-ink mb-3">Persiapan Psikotes ASTRA</h3>
                <p className="text-ink-muted text-sm mb-4 leading-relaxed max-w-xl">
                  Simulasi psikotes ASTRA dengan format sub-tes berurutan dan waktu terpisah per sub-tes — persis seperti tes aslinya. Meliputi 7 sub-tes dari Quantitative Reasoning hingga Working Memory.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-5 text-xs text-ink-muted">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-500 rounded-full" />QR · DR · RC · IR · VIZ · PS · WM</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full" />Waktu per sub-tes</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/portal/astra" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors w-full sm:w-auto">
                    Latihan Sekarang <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/harga" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-hairline text-ink-soft font-semibold hover:bg-paper-soft transition-colors w-full sm:w-auto text-sm">
                    Lihat Paket Harga
                  </Link>
                </div>
              </div>
            </div>

            {/* ── PLN ── */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 border border-hairline shadow-soft hover:border-yellow-200 transition-colors flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 rounded-l-3xl" />
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                <span className="bg-brand text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Baru</span>
                <span className="bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tersedia</span>
              </div>

              <div className="w-full sm:w-48 h-36 sm:h-44 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 relative shadow-sm z-10 flex flex-col items-center justify-center text-white p-3">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                <Zap className="w-10 h-10 mb-1.5 opacity-95 relative z-10" />
                <p className="text-sm font-bold relative z-10">GAT PLN</p>
                <p className="text-[10px] text-yellow-50 mt-0.5 relative z-10">Rekrutmen PT PLN (Persero)</p>
                <div className="flex items-center gap-3 mt-2.5 relative z-10">
                  <div className="text-center"><p className="font-num text-lg font-extrabold leading-none">8</p><p className="text-[9px] text-yellow-100 uppercase tracking-wider">Sub-tes</p></div>
                  <div className="w-px h-6 bg-white/30" />
                  <div className="text-center"><p className="font-num text-lg font-extrabold leading-none">180</p><p className="text-[9px] text-yellow-100 uppercase tracking-wider">Menit</p></div>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left w-full z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-yellow-100 text-yellow-800 text-xs font-bold uppercase">BUMN</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-bold uppercase">AKHLAK Core Values</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-brand/10 text-brand-700 text-xs font-bold uppercase">Gratis &amp; Premium</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-ink mb-2">Persiapan Rekrutmen PLN — GAT</h3>
                <p className="text-ink-muted text-sm mb-3 leading-relaxed max-w-xl">
                  Simulasi General Aptitude Test PT PLN (Persero) — format <strong className="text-ink-soft">per-sub-tes berurutan</strong> persis tes aslinya. Dilengkapi <strong className="text-ink-soft">Learning Agility</strong> dan <strong className="text-ink-soft">AKHLAK</strong> — dua sub-tes khas BUMN.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-4">
                  {[
                    { label: 'NUM', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                    { label: 'VER', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { label: 'SIL', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
                    { label: 'DER', cls: 'bg-red-50 text-red-600 border-red-200' },
                    { label: 'FIG', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
                    { label: 'PU', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
                    { label: 'LA', cls: 'bg-violet-50 text-violet-700 border-violet-200' },
                    { label: 'AKHLAK', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
                  ].map((s) => (
                    <span key={s.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${s.cls}`}>{s.label}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/portal/pln" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-colors w-full sm:w-auto">
                    Latihan Sekarang <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/harga" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-hairline text-ink-soft font-semibold hover:bg-paper-soft transition-colors w-full sm:w-auto text-sm">
                    Lihat Paket Harga
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Coming Soon ── */}
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                {
                  visual: <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden"><Image src="/card-ojk.png" width={56} height={56} className="w-full h-full object-cover" alt="OJK" /></div>,
                  title: 'PCAM OJK', tag: 'Lembaga Negara', desc: 'Penerimaan Calon Analis Muda OJK — TPA, Bahasa Inggris, dan asesmen.',
                },
                {
                  visual: <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center"><Banknote className="w-7 h-7 text-white" /></div>,
                  title: 'PCPM BI', tag: 'Bank Sentral', desc: 'Penerimaan Calon Pegawai Muda Bank Indonesia — TPA dan studi kasus ekonomi.',
                },
              ] as { visual: React.ReactNode; title: string; tag: string; desc: string }[]).map((item) => (
                <div key={item.title} className="relative bg-white rounded-2xl p-5 border border-hairline flex items-center gap-4 overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-white/55 backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed">
                    <span className="bg-ink text-white px-5 py-1.5 rounded-lg font-bold text-xs tracking-widest shadow-soft">SEGERA HADIR</span>
                  </div>
                  {item.visual}
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-paper-soft text-ink-muted text-[10px] font-bold uppercase">{item.tag}</span>
                    <h3 className="text-sm font-bold text-ink mt-1 mb-0.5">{item.title}</h3>
                    <p className="text-ink-muted text-xs leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STEPS ══════════════════════════ */}
      <section className="py-20 bg-white border-y border-hairline overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand font-bold tracking-wider text-sm uppercase">Alur Belajar</span>
            <h2 className="text-3xl font-heading font-bold text-ink mt-2">Tiga langkah menuju siap</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-9 left-[16%] right-[16%] h-px border-t border-dashed border-hairline z-0" />
            {[
              { num: 1, title: 'Pilih Tes', desc: 'Tentukan jenis seleksi sesuai lowongan kerja impianmu.' },
              { num: 2, title: 'Kerjakan Simulasi', desc: 'Hadapi soal dengan tekanan waktu nyata seperti ujian asli.', active: true },
              { num: 3, title: 'Pelajari Hasil', desc: 'Lihat peta kesiapanmu, tutup kelemahan, lalu ulangi.' },
            ].map((step) => (
              <div key={step.num} className="relative z-10 text-center">
                <div className={`w-[72px] h-[72px] border-4 border-white shadow-soft rounded-full flex items-center justify-center text-2xl font-extrabold font-num mx-auto mb-5 ${
                  step.active ? 'bg-brand text-white' : 'bg-paper text-brand'
                }`}>
                  {step.num}
                </div>
                <h3 className="text-lg font-bold font-heading text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted px-4 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
        <div className="absolute -top-24 -right-16 w-96 h-96 bg-brand/15 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
            Mulai petakan kesiapanmu hari ini
          </h2>
          <p className="text-white/65 mb-9 text-lg max-w-xl mx-auto">
            Daftar gratis, kerjakan simulasi pertamamu, dan lihat persis di mana kamu berdiri menuju karier impian.
          </p>
          <Link href={isLoggedIn ? '/dashboard' : '/register'}
            className="inline-flex justify-center items-center gap-2 bg-brand text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-700 transition-colors text-base">
            {isLoggedIn ? 'Ke Dashboard' : 'Mulai Gratis'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ══════════════════════════ */}
      <footer className="bg-ink text-white/55 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <Image src="/logotk.png" alt="Tembuskarir" width={140} height={36} className="h-8 w-auto opacity-80 mb-6 brightness-200 invert" />
              <p className="text-sm leading-relaxed max-w-sm">
                Platform simulasi tes rekrutmen kerja — membantu jobseeker menembus seleksi BUMN, PLN, Astra, dan lainnya dengan latihan yang terukur.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-widest">Produk</h4>
              <ul className="space-y-3.5 text-sm font-medium">
                {[
                  { label: 'Psikotes ASTRA', href: '/portal/astra' },
                  { label: 'Rekrutmen PLN', href: '/portal/pln' },
                  { label: 'Paket & Harga', href: '/harga' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-brand-300 transition-colors flex items-center gap-2">
                      <ArrowRight className="w-3 h-3" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 uppercase text-sm tracking-widest">Komunitas</h4>
              <ul className="space-y-3.5 text-sm font-medium">
                <li>
                  <a href="https://www.youtube.com/@Tembuskarir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-red-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@tembuskarir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" /></svg>
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 mt-10 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
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
