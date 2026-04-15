import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
})

const APP_URL = 'https://tembuskarir.id'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'TembusKarir — Platform Try Out CPNS & SKD Terbaik',
    template: '%s | TembusKarir',
  },
  description:
    'Latihan soal CPNS SKD dengan ribuan soal TWK, TIU, TKP berkualitas tinggi. Timer realistis, pembahasan lengkap, dan analisis progress. Mulai gratis sekarang!',
  keywords: [
    'try out CPNS',
    'soal CPNS',
    'latihan SKD',
    'TWK TIU TKP',
    'simulasi ujian CPNS',
    'belajar CPNS online',
    'tembuskarir',
  ],
  authors: [{ name: 'TembusKarir' }],
  creator: 'TembusKarir',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'TembusKarir',
    title: 'TembusKarir — Platform Try Out CPNS & SKD Terbaik',
    description:
      'Latihan soal CPNS SKD dengan ribuan soal TWK, TIU, TKP berkualitas tinggi. Timer realistis, pembahasan lengkap, dan analisis progress.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TembusKarir — Platform Try Out CPNS & SKD Terbaik',
    description:
      'Latihan soal CPNS SKD dengan ribuan soal TWK, TIU, TKP berkualitas tinggi.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased bg-slate-50 text-slate-600 overflow-x-hidden selection:bg-blue-100 selection:text-blue-700`}>
        {children}
      </body>
    </html>
  )
}
