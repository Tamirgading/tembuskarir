import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Banknote, BriefcaseBusiness, Zap } from 'lucide-react'
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
  const { isLoggedIn, firstName } = await getAuthState()

  return (
    <>
      {/* ══════════════════════════ NAVBAR ══════════════════════════ */}
      <LandingNavbar isLoggedIn={isLoggedIn} firstName={firstName} />

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative pt-10 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate opacity-60 z-0" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full filter blur-[80px] opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Teks */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Platform Persiapan Seleksi #1 Indonesia
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15] mb-6">
                Taklukkan Tes Kerja<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
                  Impian Anda.
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Platform simulasi tes kerja dengan sistem CAT paling relevan. Ribuan soal terupdate, analisis mendalam, dan pengalaman ujian nyata untuk memaksimalkan kelulusanmu.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="#jenis-tes"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 ring-4 ring-blue-600/10">
                  Mulai Simulasi
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link href="#fitur"
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-all duration-300">
                  Pelajari Fitur
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C'].map((l) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={l} className="w-8 h-8 rounded-full border-2 border-white" src={`https://ui-avatars.com/api/?name=${l}&background=random`} alt="User" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs text-slate-600">+2k</div>
                </div>
                <p>Bergabung dengan <span className="text-blue-600 font-bold">2.000+</span> Peserta</p>
              </div>
            </div>

            {/* Gambar hero */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm p-4 border border-white/60 shadow-2xl shadow-blue-200/50">
                <Image
                  src="/gambar-beranda.png"
                  alt="Ilustrasi Platform Simulasi Ujian"
                  width={600}
                  height={420}
                  className="relative z-10 w-full h-auto rounded-2xl hover:scale-[1.01] transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FITUR ══════════════════════════ */}
      <section id="fitur" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Mengapa Memilih Kami?</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mt-2 mb-4">Keunggulan Platform</h2>
            <p className="text-slate-600 text-lg">Ekosistem belajar lengkap yang dirancang khusus untuk memaksimalkan potensi Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
                accent: 'bg-blue-100/50', iconCls: 'text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
                title: 'Soal Terbaru & Valid',
                desc: 'Referensi soal disusun berdasarkan kisi-kisi resmi (PermenpanRB) dan field report peserta tes periode sebelumnya.',
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
                accent: 'bg-purple-100/50', iconCls: 'text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
                title: 'Analisis & Perangkingan',
                desc: 'Sistem penilaian otomatis Real Time. Ketahui peringkatmu secara nasional dan pelajari pembahasan rinci di setiap soal.',
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                accent: 'bg-cyan-100/50', iconCls: 'text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
                title: 'Simulasi CAT Real',
                desc: 'Antarmuka ujian dan manajemen waktu dirancang presisi seperti kondisi tes sesungguhnya. Latih mental sebelum ujian.',
              },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-[2rem] p-8 transition-all duration-300 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:border-blue-100 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${f.accent} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />
                <div className={`w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 transition-all relative z-10 border border-slate-100 ${f.iconCls}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 mb-3 relative z-10">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed relative z-10">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ JENIS TES ══════════════════════════ */}
      <section id="jenis-tes" className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">Pilih Jalur Seleksi</h2>
              <p className="text-slate-600 mt-3 text-lg">Pilih kategori tes sesuai target karirmu tahun ini.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* ── ASTRA — AKTIF ── */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(234,88,12,0.10)] hover:shadow-[0_25px_60px_rgba(234,88,12,0.20)] transition-all duration-300 border border-orange-100 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-400 rounded-l-3xl" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60 group-hover:bg-orange-100 transition-colors" />

              {/* Badge aktif */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
                </span>
                <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Tersedia
                </div>
              </div>

              {/* Visual card */}
              <div className="w-full sm:w-48 h-36 sm:h-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 relative shadow-lg z-10 flex flex-col items-center justify-center text-white">
                <BriefcaseBusiness className="w-12 h-12 mb-2 opacity-90" />
                <p className="text-sm font-bold">Psikotes ASTRA</p>
                <p className="text-[11px] text-orange-100 mt-0.5">60 soal · terbagi per subtes</p>
                <div className="flex flex-wrap gap-1 mt-3 justify-center px-2">
                  {['QR', 'DR', 'RC', 'PS'].map((s) => (
                    <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Konten */}
              <div className="flex-1 text-center sm:text-left w-full z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-xs font-bold uppercase">Swasta / BUMN</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-bold uppercase">Gratis & Premium</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                  Persiapan Psikotes ASTRA & BUMN
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-xl">
                  Simulasi psikotes ASTRA dengan format subtes berurutan dan waktu terpisah per subtes — persis seperti tes aslinya. Meliputi Quantitative Reasoning, Deductive Reasoning, Reading Comprehension, dan Perceptual Speed.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-500 rounded-full" />QR · DR · RC · IR · VIZ · PS · WM</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full" />Waktu per subtes</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/portal/astra"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                    Latihan Sekarang
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </Link>
                  <Link href="/harga"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-orange-300 hover:text-orange-600 transition-all w-full sm:w-auto text-sm">
                    Lihat Paket Harga
                  </Link>
                </div>
              </div>
            </div>

            {/* ── PLN — AKTIF ── */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(202,138,4,0.10)] hover:shadow-[0_25px_60px_rgba(202,138,4,0.20)] transition-all duration-300 border border-yellow-100 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-amber-400 rounded-l-3xl" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-60 group-hover:bg-yellow-100 transition-colors" />

              {/* Badge aktif + BARU */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                  ✦ Baru
                </div>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
                </span>
                <div className="bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Tersedia
                </div>
              </div>

              {/* Visual card */}
              <div className="w-full sm:w-48 h-36 sm:h-44 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 relative shadow-lg z-10 flex flex-col items-center justify-center text-white p-3">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                <Zap className="w-10 h-10 mb-1.5 opacity-95 relative z-10" />
                <p className="text-sm font-bold relative z-10">GAT PLN 2025</p>
                <p className="text-[10px] text-yellow-50 mt-0.5 relative z-10">Rekrutmen PT PLN (Persero)</p>
                <div className="flex items-center gap-3 mt-2.5 relative z-10">
                  <div className="text-center">
                    <p className="text-lg font-extrabold leading-none">8</p>
                    <p className="text-[9px] text-yellow-100 uppercase tracking-wider">Sub-tes</p>
                  </div>
                  <div className="w-px h-6 bg-white/30" />
                  <div className="text-center">
                    <p className="text-lg font-extrabold leading-none">180</p>
                    <p className="text-[9px] text-yellow-100 uppercase tracking-wider">Menit</p>
                  </div>
                </div>
              </div>

              {/* Konten */}
              <div className="flex-1 text-center sm:text-left w-full z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-xs font-bold uppercase">BUMN</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-bold uppercase">AKHLAK Core Values</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-bold uppercase">Gratis & Premium</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  Persiapan Rekrutmen PLN — GAT
                </h3>
                <p className="text-slate-600 text-sm mb-3 leading-relaxed max-w-xl">
                  Simulasi General Aptitude Test PT PLN (Persero) — format <strong>per-subtes berurutan</strong> persis tes aslinya. Dilengkapi <strong>Learning Agility</strong> dan <strong>AKHLAK</strong> — dua subtes khas BUMN yang paling membedakan dari psikotes swasta.
                </p>

                {/* Subtest chips — semua 8 */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-3">
                  {[
                    { label: 'NUM', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                    { label: 'VER', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { label: 'SIL', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
                    { label: 'DER', cls: 'bg-red-50 text-red-600 border-red-200' },
                    { label: 'FIG', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
                    { label: 'PU', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { label: 'LA', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                    { label: 'AKHLAK', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
                  ].map((s) => (
                    <span key={s.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${s.cls}`}>
                      {s.label}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-500 rounded-full" />6 subtes kognitif</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-purple-500 rounded-full" />2 subtes soft-skill</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full" />Waktu per subtes</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/portal/pln"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold hover:shadow-lg hover:shadow-yellow-500/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                    Latihan Sekarang
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </Link>
                  <Link href="/harga"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-yellow-300 hover:text-yellow-600 transition-all w-full sm:w-auto text-sm">
                    Lihat Paket Harga
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Coming Soon — 2 kartu (PLN sudah aktif) ── */}
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                {
                  visual: <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden shadow-sm"><Image src="/card-ojk.png" width={56} height={56} className="w-full h-full object-cover" alt="OJK" /></div>,
                  title: 'PCAM OJK', tag: 'Lembaga Negara', desc: 'Penerimaan Calon Analis Muda OJK — TPA, Bahasa Inggris, dan asesmen berbasis SHL.',
                },
                {
                  visual: <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-sm"><Banknote className="w-7 h-7 text-white" /></div>,
                  title: 'PCPM BI', tag: 'Bank Sentral', desc: 'Penerimaan Calon Pegawai Muda Bank Indonesia — TPA, Bahasa Inggris, dan studi kasus ekonomi.',
                },
              ] as { visual: React.ReactNode; title: string; tag: string; desc: string }[]).map((item) => (
                <div key={item.title} className="relative bg-white rounded-3xl p-5 border border-slate-200 flex items-center gap-4 overflow-hidden opacity-70 grayscale-[30%]">
                  <div className="absolute inset-0 z-10 bg-slate-50/60 flex items-center justify-center cursor-not-allowed">
                    <span className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold text-sm tracking-widest shadow-xl -rotate-1 border-2 border-slate-700">
                      COMING SOON
                    </span>
                  </div>
                  {item.visual}
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">{item.tag}</span>
                    <h3 className="text-sm font-bold text-slate-800 mt-1 mb-0.5">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STEPS ══════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">Alur Belajar</span>
            <h2 className="text-3xl font-heading font-bold text-slate-900 mt-2">3 Langkah Mudah</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px border-t border-dashed border-slate-300 z-0" />
            {[
              { num: 1, title: 'Pilih Tes', desc: 'Tentukan jenis seleksi yang sesuai dengan lowongan kerjamu.' },
              { num: 2, title: 'Kerjakan Simulasi', desc: 'Hadapi soal dengan tekanan waktu nyata seperti ujian asli.', active: true },
              { num: 3, title: 'Evaluasi Hasil', desc: 'Pelajari pembahasan mendalam dan perbaiki kelemahanmu.' },
            ].map((step) => (
              <div key={step.num} className="relative z-10 text-center group">
                <div className={`w-24 h-24 border-4 border-white shadow-xl rounded-full flex items-center justify-center text-3xl font-extrabold font-heading mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
                  step.active ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-blue-600'
                }`}>
                  {step.num}
                </div>
                <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 px-6 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA ══════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-blue-900">
        <div className="absolute inset-0 bg-blue-600 mix-blend-multiply" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
            Siap Wujudkan Karir <br /> Impianmu?
          </h2>
          <p className="text-blue-100 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Jangan biarkan kesempatan emas terlewat. Bergabunglah dengan ribuan peserta lain yang telah sukses.
          </p>
          <Link href={isLoggedIn ? '/portal/astra' : '/register'}
            className="inline-flex justify-center items-center bg-white text-blue-900 font-bold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-blue-50 hover:scale-105 transition-all duration-300 text-lg">
            {isLoggedIn ? 'Mulai Simulasi Sekarang' : 'Mulai Simulasi Gratis'}
          </Link>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ══════════════════════════ */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <Image src="/logotk.png" alt="Tembuskarir" width={140} height={36} className="h-8 w-auto opacity-70 mb-6 brightness-200 invert" />
              <p className="text-sm leading-relaxed max-w-sm">
                Platform edukasi karir terdepan yang membantu jobseeker menembus tes kerja BUMN, CPNS, dan lain-lain.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Produk</h4>
              <ul className="space-y-4 text-sm font-medium">
                {[
                  { label: 'Psikotes ASTRA', href: '/portal/astra' },
                  { label: 'Rekrutmen PLN', href: '/portal/pln' },
                  { label: 'Paket & Harga', href: '/harga' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-blue-500 transition-colors flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Komunitas</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a href="https://www.youtube.com/@Tembuskarir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@tembuskarir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" /></svg>
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-10 mt-10 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
            <p>© 2025 Tembuskarir. All Rights Reserved.</p>
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
