import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Simulasi CPNS – Pindah ke TembusASN' }

export default function CpnsPortalPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">

        {/* Ikon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
          <ExternalLink className="w-9 h-9 text-blue-500" />
        </div>

        {/* Judul */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Simulasi CPNS Telah Pindah
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Simulasi SKD CPNS kini tersedia eksklusif di platform khusus kami —{' '}
            <span className="font-semibold text-blue-600">TembusASN</span>.
            Platform ini dirancang khusus untuk persiapan seleksi ASN yang lebih lengkap dan terarah.
          </p>
        </div>

        {/* Card info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-5 text-left space-y-3 shadow-sm">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Tersedia di TembusASN</p>
          {[
            'Simulasi SKD — TWK, TIU, TKP',
            'Sistem penilaian resmi BKN',
            'Passing grade & analisis per kategori',
            'Pembahasan lengkap setiap soal',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://tembusasn.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-200"
          >
            Kunjungi TembusASN
            <ExternalLink className="w-4 h-4" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Masih ada pertanyaan?{' '}
          <a href="mailto:support@tembuskarir.id" className="underline hover:text-gray-600">
            Hubungi support kami
          </a>
        </p>
      </div>
    </div>
  )
}
