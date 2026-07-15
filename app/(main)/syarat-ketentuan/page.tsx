import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan TembusKarir.',
}

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Tentang Layanan',
    body: [
      'TembusKarir (tembuskarir.id) adalah platform simulasi tes rekrutmen kerja — antara lain rekrutmen PLN, psikotes ASTRA, dan Tes Kompetensi Dasar (TKD) BUMN — yang menyediakan paket latihan soal, simulasi ujian, pembahasan, serta analisis hasil.',
      'Dengan membuat akun dan/atau menggunakan layanan TembusKarir, kamu dianggap telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini.',
    ],
  },
  {
    title: '2. Akun Pengguna',
    body: [
      'Kamu wajib memberikan data yang benar saat mendaftar (nama dan email aktif) dan bertanggung jawab menjaga kerahasiaan kredensial akunmu.',
      'Satu akun hanya untuk digunakan oleh satu orang. TembusKarir berhak menonaktifkan akun yang terindikasi disalahgunakan, melanggar ketentuan ini, atau digunakan untuk tujuan kecurangan (misalnya joki/berbagi akun untuk simulasi).',
    ],
  },
  {
    title: '3. Paket Layanan & Akses',
    body: [
      'TembusKarir menyediakan akses gratis (paket simulasi terbatas) dan akses berbayar berupa langganan Premium serta pembelian paket satuan.',
      'Langganan Premium memberikan akses ke paket simulasi berbayar dan pembahasan soal selama periode berlangganan aktif (1 bulan atau 3 bulan, sesuai paket yang dipilih). Cakupan paket yang termasuk dalam setiap jenis langganan dijelaskan pada halaman harga/portal masing-masing.',
      'Pembelian paket satuan memberikan akses permanen (tidak ada tanggal kedaluwarsa) hanya untuk paket soal yang dibeli.',
      'Simulasi ini disusun berdasarkan format dan kisi-kisi yang beredar secara publik. TembusKarir tidak berafiliasi dengan PT PLN (Persero), PT Astra International Tbk, Kementerian BUMN, maupun instansi/perusahaan lain yang tesnya disimulasikan.',
    ],
  },
  {
    title: '4. Pembayaran',
    body: [
      'Seluruh transaksi pembayaran diproses melalui mitra payment gateway resmi (Midtrans) dan mendukung metode transfer bank, QRIS, e-wallet, serta kartu kredit/debit.',
      'Akses premium akan aktif secara otomatis dalam hitungan detik setelah pembayaran berhasil dikonfirmasi oleh sistem pembayaran.',
      'TembusKarir tidak menyimpan data kartu kredit/debit atau informasi rekening bank kamu. Seluruh data pembayaran ditangani langsung oleh Midtrans.',
    ],
  },
  {
    title: '5. Kebijakan Pembatalan & Refund',
    body: [
      'Tidak ada pengembalian dana (refund) untuk transaksi yang telah berhasil diproses, baik untuk paket berlangganan maupun pembelian paket satuan.',
      'Pastikan kamu memeriksa kembali jenis paket dan durasi sebelum melakukan pembayaran.',
    ],
  },
  {
    title: '6. Perpanjangan Langganan',
    body: [
      'Langganan tidak diperpanjang secara otomatis. Untuk memperpanjang akses, kamu dapat membeli ulang paket yang sama; durasi baru akan ditambahkan ke sisa masa aktif (jika masih berlaku) atau dimulai dari saat pembayaran dikonfirmasi.',
    ],
  },
  {
    title: '7. Voucher & Kode Promo',
    body: [
      'Kode voucher yang diberikan oleh TembusKarir (misalnya untuk promosi atau kerja sama tertentu) hanya dapat digunakan sesuai dengan syarat, masa berlaku, dan jenis akses yang tercantum pada saat voucher tersebut digunakan.',
      'Setiap kode voucher hanya dapat digunakan satu kali per akun, kecuali ditentukan lain.',
    ],
  },
  {
    title: '8. Hak Kekayaan Intelektual',
    body: [
      'Seluruh konten dalam platform TembusKarir, termasuk namun tidak terbatas pada soal, pembahasan, desain, dan logo, adalah milik TembusKarir atau pihak yang memberikan lisensi kepada TembusKarir, dan dilindungi oleh hukum hak cipta yang berlaku.',
      'Kamu tidak diperkenankan menyalin, mendistribusikan, memperjualbelikan, atau menggunakan kembali konten TembusKarir untuk tujuan komersial tanpa izin tertulis.',
    ],
  },
  {
    title: '9. Batasan Tanggung Jawab',
    body: [
      'TembusKarir berupaya menyajikan soal dan pembahasan yang akurat dan relevan dengan format tes rekrutmen yang disimulasikan, namun tidak dapat menjamin kelulusan peserta dalam proses rekrutmen yang sesungguhnya, karena hasil seleksi ditentukan oleh banyak faktor di luar kendali TembusKarir.',
      'TembusKarir tidak bertanggung jawab atas gangguan layanan yang disebabkan oleh faktor di luar kendali kami, seperti gangguan internet pengguna, pemeliharaan sistem, atau gangguan pada pihak ketiga (penyedia hosting, payment gateway, dll).',
    ],
  },
  {
    title: '10. Perubahan Ketentuan',
    body: [
      'TembusKarir dapat memperbarui Syarat & Ketentuan ini dari waktu ke waktu. Perubahan akan berlaku sejak dipublikasikan di halaman ini. Penggunaan layanan secara berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap ketentuan yang telah diperbarui.',
    ],
  },
  {
    title: '11. Kontak',
    body: [
      'Jika ada pertanyaan terkait Syarat & Ketentuan ini, silakan hubungi kami melalui email support@tembuskarir.id.',
    ],
  },
]

export default function SyaratKetentuanPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 fade-up">
      <Link href="/" className="flex items-center gap-1 text-[12.5px] text-ink-muted hover:text-ink transition-colors">
        <ChevronLeft className="w-3.5 h-3.5" /> Kembali
      </Link>

      <div>
        <h1 className="font-heading font-bold text-[22px] text-ink">Syarat &amp; Ketentuan</h1>
        <p className="text-[12.5px] text-ink-muted mt-0.5">Terakhir diperbarui: 12 Juli 2026</p>
      </div>

      <div className="bg-white border border-hairline shadow-soft rounded-2xl p-5 sm:p-6 space-y-5">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-bold text-ink mb-1.5">{section.title}</h2>
            <div className="space-y-2">
              {section.body.map((p, i) => (
                <p key={i} className="text-[12.5px] leading-[1.7] text-ink-muted">{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
