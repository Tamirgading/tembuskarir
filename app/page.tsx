import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Landmark, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

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
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
              <Image src="/logotk.png" alt="Tembuskarir" width={140} height={40} className="h-10 w-auto object-contain" priority />
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="#fitur" className="hover:text-blue-600 transition-colors py-2 relative group">
                Fitur
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="#jenis-tes" className="hover:text-blue-600 transition-colors py-2 relative group">
                Jenis Tes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>

              {isLoggedIn ? (
                <Link href="/dashboard"
                  className="flex items-center gap-3 px-2 py-1 pr-4 ml-4 bg-slate-50 rounded-full border border-slate-200 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Halo,</p>
                    <span className="font-bold text-slate-700 text-sm leading-none">{firstName}</span>
                  </div>
                  <svg className="w-3 h-3 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Link href="/login" className="px-5 py-2.5 font-bold text-slate-600 hover:text-blue-600 transition-colors">
                    Masuk
                  </Link>
                  <Link href="/register"
                    className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95">
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </Link>
              ) : (
                <Link href="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">
                  Daftar
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

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
            {/* ── CPNS — AKTIF ── */}
            <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(37,99,235,0.12)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.22)] transition-all duration-300 border border-blue-100 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 group overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 to-cyan-500 rounded-l-3xl" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 group-hover:bg-blue-100 transition-colors" />

              {/* Badge aktif */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
                </span>
                <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Tersedia
                </div>
              </div>

              {/* Visual card */}
              <div className="w-full sm:w-48 h-36 sm:h-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 relative shadow-lg z-10 flex flex-col items-center justify-center text-white">
                <Landmark className="w-12 h-12 mb-2 opacity-90" />
                <p className="text-sm font-bold">SKD CPNS 2025</p>
                <p className="text-[11px] text-blue-200 mt-0.5">110 soal · 90 menit</p>
                <div className="flex gap-1.5 mt-3">
                  {['TWK', 'TIU', 'TKP'].map((s) => (
                    <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Konten */}
              <div className="flex-1 text-center sm:text-left w-full z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase">Instansi Pemerintah</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-bold uppercase">Gratis & Premium</span>
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Persiapan Seleksi CPNS 2025 — SKD
                </h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-xl">
                  Simulasi Seleksi Kompetensi Dasar (SKD) dengan sistem penilaian resmi BKN. Latihan TWK, TIU, dan TKP dengan soal berkualitas tinggi, passing grade real, dan pembahasan lengkap.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-full" />TWK ≥65 · TIU ≥80 · TKP ≥166</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" />Total ≥311 / 550</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/portal/cpns"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                    Latihan Sekarang
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </Link>
                  <Link href="/harga"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all w-full sm:w-auto text-sm">
                    Lihat Paket Harga
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Coming Soon — 2 kolom ── */}
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                {
                  visual: <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden shadow-sm"><Image src="/card-ojk.png" width={56} height={56} className="w-full h-full object-cover" alt="OJK" /></div>,
                  title: 'Seleksi OJK — PCAM & MLE', tag: 'Lembaga Negara', desc: 'Tes Potensi Dasar dan Kemampuan Umum mengikuti standar SHL Interactive Test.',
                },
                {
                  visual: <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden shadow-sm"><Image src="/card-pln.jpg" width={56} height={56} className="w-full h-full object-cover" alt="PLN" /></div>,
                  title: 'AKDING Rekrutmen PLN', tag: 'BUMN', desc: 'Simulasi Akademik dan Bahasa Inggris (Akding) khusus rekrutmen PLN.',
                },
                {
                  visual: <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden shadow-sm"><Image src="/card-astra.jpg" width={56} height={56} className="w-full h-full object-cover" alt="BUMN" /></div>,
                  title: 'Seleksi BUMN & Swasta', tag: 'BUMN / Swasta', desc: 'BRI, Mandiri, Pertamina, dan perusahaan swasta terkemuka Indonesia.',
                },
                {
                  visual: <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-sm"><GraduationCap className="w-7 h-7 text-white" /></div>,
                  title: 'Seleksi Kedinasan', tag: 'Kedinasan', desc: 'STAN, IPDN, PKN STAN, dan sekolah kedinasan lainnya.',
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
          <Link href={isLoggedIn ? '/portal/cpns' : '/register'}
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
                  { label: 'Simulasi SKD CPNS', href: '/portal/cpns' },
                  { label: 'Paket & Harga', href: '/harga' },
                  { label: 'E-Book & PDF', href: 'https://lynk.id/tembuskarir' },
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
