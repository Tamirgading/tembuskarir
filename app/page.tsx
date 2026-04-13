import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const SELEKSI = [
  {
    id: 'cpns',
    emoji: '🏛️',
    title: 'CPNS',
    subtitle: 'Calon Pegawai Negeri Sipil',
    desc: 'Simulasi SKD & SKB lengkap dengan penilaian resmi BKN. TWK, TIU, TKP.',
    tags: ['SKD', 'SKB'],
    href: '/portal/cpns',
    active: true,
    color: 'from-blue-600 to-blue-700',
    lightColor: 'bg-blue-50 border-blue-200',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'ojk',
    emoji: '🏦',
    title: 'OJK',
    subtitle: 'Otoritas Jasa Keuangan',
    desc: 'Seleksi MLE, PCAM, PCT. Reguler & Campus Hiring.',
    tags: ['MLE', 'PCAM', 'PCT'],
    href: '#',
    active: false,
    color: 'from-emerald-600 to-emerald-700',
    lightColor: 'bg-emerald-50 border-emerald-200',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'bi',
    emoji: '🏛️',
    title: 'Bank Indonesia',
    subtitle: 'PCPM & Non-PCPM',
    desc: 'Program Calon Pegawai Muda BI dengan multi-subtes terstruktur.',
    tags: ['PCPM', 'Non-PCPM'],
    href: '#',
    active: false,
    color: 'from-red-600 to-red-700',
    lightColor: 'bg-red-50 border-red-200',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    id: 'bumn',
    emoji: '⚡',
    title: 'BUMN Pintar',
    subtitle: 'Rekrutmen Bersama BUMN',
    desc: 'Tes Potensi, Bahasa Inggris, dan Kompetensi Bidang BUMN.',
    tags: ['Kompetensi', 'Bahasa'],
    href: '#',
    active: false,
    color: 'from-orange-600 to-orange-700',
    lightColor: 'bg-orange-50 border-orange-200',
    tagColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'kedinasan',
    emoji: '🎓',
    title: 'Sekolah Kedinasan',
    subtitle: 'IPDN, PKN STAN, Bintara',
    desc: 'Simulasi seleksi masuk sekolah kedinasan pemerintah.',
    tags: ['IPDN', 'STAN'],
    href: '#',
    active: false,
    color: 'from-violet-600 to-violet-700',
    lightColor: 'bg-violet-50 border-violet-200',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'tni',
    emoji: '⭐',
    title: 'TNI / POLRI',
    subtitle: 'Akademi & Bintara',
    desc: 'Tes Pengetahuan Umum dan Wawasan Nusantara TNI & POLRI.',
    tags: ['Akademi', 'Bintara'],
    href: '#',
    active: false,
    color: 'from-slate-600 to-slate-700',
    lightColor: 'bg-slate-50 border-slate-200',
    tagColor: 'bg-slate-100 text-slate-700',
  },
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'Penilaian Resmi BKN',
    desc: 'Sistem skoring TWK/TIU/TKP sesuai aturan resmi: +5 benar, −1,67 salah untuk TWK & TIU, TKP tanpa penalti.',
  },
  {
    icon: '⏱️',
    title: 'Timer Realistis',
    desc: 'Simulasi ujian 90 menit dengan hitungan mundur, auto-submit saat waktu habis.',
  },
  {
    icon: '📊',
    title: 'Analisis per Sub-tes',
    desc: 'Lihat skor TWK, TIU, TKP secara terpisah. Ketahui apakah kamu lolos passing grade tiap sub-tes.',
  },
  {
    icon: '💡',
    title: 'Pembahasan Lengkap',
    desc: 'Setiap soal dilengkapi pembahasan mendalam. Support LaTeX untuk soal matematika & logika.',
  },
  {
    icon: '🔖',
    title: 'Tandai Soal',
    desc: 'Bookmark soal yang ingin ditinjau ulang saat mengerjakan. Review per kategori setelah ujian.',
  },
  {
    icon: '📱',
    title: 'Akses Multi-device',
    desc: 'Latihan di laptop, tablet, atau HP. Progress tersimpan otomatis di cloud.',
  },
]

const STATS = [
  { value: '110', label: 'Soal per Paket', sub: 'TWK · TIU · TKP' },
  { value: '3', label: 'Sub-tes SKD', sub: 'Sesuai standar BKN' },
  { value: '100%', label: 'Gratis Mulai', sub: 'Tanpa kartu kredit' },
]

export default async function HomePage() {
  let isLoggedIn = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user
  } catch { /* ignore */ }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">TembusKarir</Link>
          <nav className="flex items-center gap-3">
            <Link href="/harga" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900">Harga</Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Masuk</Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Daftar Gratis
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Platform Simulasi Seleksi Karir #1
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Tembus Karir
            <br />
            <span className="text-yellow-300">Impianmu</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Simulasi CPNS, OJK, BI, BUMN, dan Kedinasan dengan sistem penilaian resmi.
            Latihan intensif, pembahasan lengkap, analisis mendalam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              href="/portal/cpns"
              className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg"
            >
              Mulai Simulasi CPNS →
            </Link>
            {!isLoggedIn && (
              <Link
                href="/register"
                className="px-8 py-4 bg-white/20 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors text-lg"
              >
                Daftar Gratis
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm font-medium text-blue-100 mt-0.5">{s.label}</p>
                <p className="text-xs text-blue-300">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pilih Seleksi ──────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mb-3">
              Pilih Seleksimu
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Portal Seleksi Karir
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Setiap seleksi punya karakteristik berbeda. Kami siapkan simulasi yang spesifik dan akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SELEKSI.map((sel) => (
              <div
                key={sel.id}
                className={`relative rounded-2xl border-2 p-6 flex flex-col gap-4 transition-all ${
                  sel.active
                    ? `${sel.lightColor} hover:shadow-lg hover:-translate-y-0.5`
                    : 'bg-white border-gray-200 opacity-70'
                }`}
              >
                {/* Coming Soon badge */}
                {!sel.active && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">
                      Segera Hadir
                    </span>
                  </div>
                )}

                {/* Icon + title */}
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${sel.color} rounded-xl flex items-center justify-center text-2xl shrink-0 ${!sel.active ? 'grayscale' : ''}`}>
                    {sel.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{sel.title}</h3>
                    <p className="text-xs text-gray-500">{sel.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">{sel.desc}</p>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap">
                  {sel.tags.map((tag) => (
                    <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${sel.active ? sel.tagColor : 'bg-gray-100 text-gray-400'}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-2">
                  {sel.active ? (
                    <Link
                      href={sel.href}
                      className={`block w-full text-center py-2.5 bg-gradient-to-r ${sel.color} text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity`}
                    >
                      Mulai Belajar →
                    </Link>
                  ) : (
                    <div className="w-full text-center py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed">
                      Dalam Pengembangan
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Mengapa TembusKarir?</h2>
            <p className="text-gray-500 mt-3">Platform yang dirancang serius untuk hasil yang serius.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cara kerja ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mulai dalam 3 Langkah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Pilih Seleksi', desc: 'Pilih jenis seleksi yang kamu tuju — CPNS, OJK, BI, atau BUMN.' },
              { step: '02', title: 'Kerjakan Simulasi', desc: 'Simulasi dengan timer realistis, penilaian sesuai aturan resmi, dan bookmark soal.' },
              { step: '03', title: 'Analisis & Perbaiki', desc: 'Lihat skor per sub-tes, pelajari pembahasan, identifikasi area yang perlu diperkuat.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="text-center mt-12">
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Daftar Gratis Sekarang
              </Link>
              <p className="text-blue-200 text-sm mt-3">Tidak perlu kartu kredit · Mulai dalam 30 detik</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'Apakah penilaian SKD sesuai aturan resmi BKN?',
                a: 'Ya. Kami menggunakan sistem penilaian resmi: TWK & TIU benar +5, salah −1,67, kosong 0. TKP benar +5 tanpa penalti. Passing grade mengacu standar BKN terbaru.',
              },
              {
                q: 'Apakah bisa diakses gratis?',
                a: 'Ya. Paket gratis tersedia tanpa batas waktu. Paket Premium memberi akses ke seluruh bank soal dan fitur analitik lanjutan.',
              },
              {
                q: 'Berapa soal dalam satu sesi SKD?',
                a: '110 soal: TWK 30 soal, TIU 35 soal, TKP 45 soal. Durasi 90 menit, sama seperti ujian SKD sesungguhnya.',
              },
              {
                q: 'Apakah saya bisa mengerjakan ulang soal yang sama?',
                a: 'Ya. Setiap percobaan tercatat dan kamu bisa melihat perkembangan skor dari waktu ke waktu di Dashboard.',
              },
              {
                q: 'Bagaimana cara upgrade ke Premium?',
                a: 'Setelah login, kunjungi halaman Harga. Pembayaran melalui Midtrans: transfer bank, QRIS, e-wallet.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-xl">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 list-none">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform text-lg">↓</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>
              <span className="font-bold text-gray-700 text-lg">TembusKarir</span>
              <p className="text-xs mt-0.5">Platform Simulasi Seleksi Karir Indonesia</p>
            </div>
            <div className="flex gap-6">
              <Link href="/portal/cpns" className="hover:text-gray-700">CPNS</Link>
              <Link href="/harga" className="hover:text-gray-700">Harga</Link>
              <Link href="/login" className="hover:text-gray-700">Masuk</Link>
              <Link href="/register" className="hover:text-gray-700">Daftar</Link>
            </div>
            <span>© {new Date().getFullYear()} TembusKarir</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
