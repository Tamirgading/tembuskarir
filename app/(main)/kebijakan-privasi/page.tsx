import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi dan perlindungan data pengguna TembusKarir.',
}

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Pendahuluan',
    body: [
      'Kebijakan Privasi ini menjelaskan bagaimana TembusKarir (tembuskarir.id) mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi kamu saat menggunakan layanan kami.',
      'Dengan menggunakan TembusKarir, kamu menyetujui pengumpulan dan penggunaan data sebagaimana dijelaskan dalam kebijakan ini.',
    ],
  },
  {
    title: '2. Data yang Kami Kumpulkan',
    body: [
      'Data akun: nama lengkap dan alamat email yang kamu berikan saat mendaftar.',
      'Data aktivitas: riwayat pengerjaan simulasi, jawaban, skor, dan rincian hasil per sub-tes (misalnya sub-tes GAT PLN atau psikotes ASTRA) untuk menampilkan progres belajarmu.',
      'Data transaksi: jenis paket yang dibeli, status pembayaran, dan tanggal transaksi. Detail metode pembayaran (nomor kartu, rekening, dll) tidak disimpan oleh TembusKarir; diproses langsung oleh Midtrans.',
      'Data teknis: informasi dasar seperti alamat IP dan jenis perangkat, yang dikumpulkan secara otomatis untuk keperluan keamanan dan analitik dasar.',
    ],
  },
  {
    title: '3. Bagaimana Data Digunakan',
    body: [
      'Menyediakan dan mengoperasikan layanan: membuat akun, menyimpan progres belajar, menampilkan riwayat & hasil ujian, serta mengaktifkan akses premium setelah pembayaran berhasil.',
      'Komunikasi: mengirim email terkait akun (verifikasi, lupa password), konfirmasi pembayaran, dan informasi penting terkait layanan.',
      'Peningkatan layanan: menganalisis pola penggunaan secara agregat (tidak diidentifikasi per individu) untuk meningkatkan kualitas soal dan fitur platform.',
    ],
  },
  {
    title: '4. Berbagi Data dengan Pihak Ketiga',
    body: [
      'TembusKarir tidak menjual atau menyewakan data pribadi kamu kepada pihak manapun.',
      'Data dibagikan secara terbatas dengan penyedia layanan yang membantu operasional kami, yaitu: Supabase (penyimpanan database & autentikasi), Midtrans (pemrosesan pembayaran), Resend (pengiriman email), dan Vercel (hosting aplikasi). Masing-masing pihak ketiga ini terikat kebijakan privasi dan keamanan mereka sendiri.',
      'Data dapat diungkapkan apabila diwajibkan oleh hukum atau permintaan resmi dari pihak berwenang.',
    ],
  },
  {
    title: '5. Penyimpanan & Keamanan Data',
    body: [
      'Data disimpan pada infrastruktur database Supabase dengan kontrol akses (Row Level Security) sehingga setiap pengguna hanya dapat mengakses datanya sendiri.',
      'Password akun disimpan dalam bentuk terenkripsi (hash) dan tidak dapat dibaca oleh siapa pun, termasuk tim TembusKarir.',
      'Kami menerapkan praktik keamanan standar industri, namun tidak ada sistem yang sepenuhnya bebas risiko. Kami mendorong kamu untuk menjaga kerahasiaan password dan tidak membagikannya kepada siapa pun.',
    ],
  },
  {
    title: '6. Hak Pengguna',
    body: [
      'Kamu berhak untuk mengakses, memperbarui, atau menghapus data akunmu. Pengubahan data dasar (nama) dapat dilakukan melalui halaman Profil.',
      'Untuk permintaan penghapusan akun secara permanen beserta seluruh data terkait, silakan menghubungi kami melalui email support@tembuskarir.id. Permintaan akan diproses dalam waktu wajar setelah verifikasi identitas.',
    ],
  },
  {
    title: '7. Cookie & Teknologi Sejenis',
    body: [
      'TembusKarir menggunakan cookie untuk menjaga sesi login kamu agar tetap aman dan untuk fungsi dasar aplikasi (misalnya menyimpan jawaban sementara saat ujian berlangsung). Kami tidak menggunakan cookie untuk iklan pihak ketiga.',
    ],
  },
  {
    title: '8. Perubahan Kebijakan',
    body: [
      'Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu untuk menyesuaikan dengan perubahan layanan atau ketentuan hukum yang berlaku. Versi terbaru akan selalu tersedia di halaman ini.',
    ],
  },
  {
    title: '9. Kontak',
    body: [
      'Jika ada pertanyaan, masukan, atau permintaan terkait data pribadi kamu, silakan hubungi kami melalui email support@tembuskarir.id.',
    ],
  },
]

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 fade-up">
      <Link href="/" className="flex items-center gap-1 text-[12.5px] text-ink-muted hover:text-ink transition-colors">
        <ChevronLeft className="w-3.5 h-3.5" /> Kembali
      </Link>

      <div>
        <h1 className="font-heading font-bold text-[22px] text-ink">Kebijakan Privasi</h1>
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
