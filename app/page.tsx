import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow } from '@/lib/utils'

// ── FAQ data ──────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Apakah soal Try Out sesuai dengan standar CPNS SKD?',
    a: 'Ya. Soal kami disusun mengacu pada kisi-kisi resmi BKN yang mencakup Tes Wawasan Kebangsaan (TWK), Tes Intelegensi Umum (TIU), dan Tes Karakteristik Pribadi (TKP).',
  },
  {
    q: 'Apakah bisa diakses gratis?',
    a: 'Bisa. Kami menyediakan paket gratis yang bisa langsung diakses tanpa biaya. Paket Premium memberi akses ke semua paket soal tanpa batas.',
  },
  {
    q: 'Bagaimana cara upgrade ke Premium?',
    a: 'Setelah login, klik tombol Upgrade di navbar atau kunjungi halaman Harga. Pembayaran dilakukan melalui Midtrans yang mendukung transfer bank, QRIS, dan dompet digital.',
  },
  {
    q: 'Apakah ada batas waktu saat mengerjakan soal?',
    a: 'Ya, timer akan berjalan sesuai durasi paket. Ini bertujuan mensimulasikan kondisi ujian yang sesungguhnya. Jika waktu habis, jawaban otomatis tersimpan dan dihitung.',
  },
  {
    q: 'Bisakah saya mengerjakan ulang soal yang sama?',
    a: 'Bisa. Anda bisa mengerjakan paket soal yang sama berkali-kali. Setiap percobaan tercatat di dashboard sehingga Anda bisa memantau perkembangan skor.',
  },
]

// ── Fitur unggulan ────────────────────────────────────────────────────────────
const features = [
  {
    icon: '📝',
    title: 'Soal Berkualitas',
    desc: 'Ribuan soal TWK, TIU, dan TKP yang disusun sesuai kisi-kisi BKN, dilengkapi pembahasan lengkap di setiap soal.',
  },
  {
    icon: '⏱',
    title: 'Timer Realistis',
    desc: 'Simulasi ujian dengan hitungan mundur seperti kondisi sesungguhnya. Jawaban tersimpan otomatis saat waktu habis.',
  },
  {
    icon: '📊',
    title: 'Analisis Progress',
    desc: 'Pantau perkembangan skor dari waktu ke waktu. Identifikasi kategori yang masih perlu diperkuat.',
  },
]

// ── Stats platform (bisa hardcode dulu) ──────────────────────────────────────
const stats = [
  { value: '500+', label: 'Soal tersedia' },
  { value: '3', label: 'Kategori SKD' },
  { value: '100%', label: 'Gratis mulai' },
]

export default async function HomePage() {
  // Cek apakah user sudah login
  let isLoggedIn = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user
  } catch {
    // Supabase belum dikonfigurasi — tampilkan landing page biasa
  }

  // Fetch 3 paket untuk preview section
  let packages: PackageRow[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
      .limit(3)
    packages = (data ?? []) as PackageRow[]
  } catch {
    // Supabase belum dikonfigurasi
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar sederhana ── */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">TryOut Platform</span>
          <nav className="flex items-center gap-3">
            <Link href="/paket" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900">
              Paket Soal
            </Link>
            <Link href="/harga" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900">
              Harga
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Masuk
                </Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Mulai Gratis
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-6">
          Platform Try Out CPNS #1
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Persiapkan CPNS Kamu
          <br />
          <span className="text-blue-600">dengan Try Out Terbaik</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Latihan soal SKD CPNS dengan timer realistis, pembahasan lengkap, dan analisis progress.
          Mulai gratis sekarang — tidak perlu kartu kredit.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isLoggedIn ? (
            <Link href="/dashboard" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg">
              Ke Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/register" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg">
                Mulai Gratis Sekarang
              </Link>
              <Link href="/paket" className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-lg">
                Lihat Paket Soal
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fitur ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Kenapa TryOut Platform?</h2>
            <p className="text-gray-500 mt-3">Semua yang kamu butuhkan untuk lolos CPNS, dalam satu platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preview Paket ── */}
      {packages.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Paket Soal Tersedia</h2>
              <p className="text-gray-500 mt-3">Pilih paket yang sesuai kebutuhanmu.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {pkg.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-2 leading-snug">{pkg.name}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${pkg.is_free ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {pkg.is_free ? 'GRATIS' : 'PREMIUM'}
                    </span>
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">{pkg.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>📝 {pkg.total_questions} soal</span>
                    <span>⏱ {pkg.duration_minutes} menit</span>
                  </div>
                  <Link
                    href={isLoggedIn ? `/ujian/${pkg.id}` : '/register'}
                    className="block w-full text-center py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors mt-auto"
                  >
                    {isLoggedIn ? 'Mulai Try Out' : 'Daftar & Mulai'}
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/paket" className="text-blue-600 hover:underline text-sm font-medium">
                Lihat semua paket →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Cara Kerja ── */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mulai dalam 3 Langkah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Daftar Gratis', desc: 'Buat akun dalam 30 detik. Tidak perlu kartu kredit.' },
              { step: '2', title: 'Pilih Paket', desc: 'Pilih paket soal sesuai kebutuhan dan tingkat kesulitan.' },
              { step: '3', title: 'Lihat Hasil', desc: 'Kerjakan soal, lihat skor, dan pelajari pembahasannya.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          {!isLoggedIn && (
            <div className="text-center mt-10">
              <Link href="/register" className="inline-block px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                Mulai Sekarang — Gratis
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Pertanyaan Umum</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
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

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-semibold text-gray-700">TryOut Platform</span>
          <div className="flex gap-6">
            <Link href="/paket" className="hover:text-gray-700">Paket Soal</Link>
            <Link href="/harga" className="hover:text-gray-700">Harga</Link>
            <Link href="/login" className="hover:text-gray-700">Masuk</Link>
            <Link href="/register" className="hover:text-gray-700">Daftar</Link>
          </div>
          <span>© {new Date().getFullYear()} TryOut Platform</span>
        </div>
      </footer>
    </div>
  )
}
