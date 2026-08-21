import type { Metadata } from 'next'
import { Bricolage_Grotesque, Hanken_Grotesk, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Body & UI — humanis, sangat terbaca
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' })
// Display / heading — berkarakter, editorial (anti generik)
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
// Angka / skor / timer — tabular, presisi
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' })

const APP_URL = 'https://tembuskarir.id'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'TembusKarir',
    template: '%s | TembusKarir',
  },
  icons: {
    icon: '/iconlogo.png',
    shortcut: '/iconlogo.png',
    apple: '/iconlogo.png',
  },
  description:
    'Latihan simulasi tes rekrutmen kerja PLN, Astra, BUMN, dan perusahaan lainnya dengan ribuan soal berkualitas. Timer realistis, pembahasan lengkap, dan analisis progress. Mulai gratis sekarang!',
  keywords: [
    'simulasi tes kerja',
    'tes rekrutmen PLN',
    'psikotes Astra',
    'tes BUMN',
    'latihan soal kerja',
    'try out kerja online',
    'tembuskarir',
  ],
  authors: [{ name: 'TembusKarir' }],
  creator: 'TembusKarir',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'TembusKarir',
    title: 'TembusKarir · Platform Simulasi Tes Kerja BUMN & Swasta',
    description:
      'Latihan simulasi tes rekrutmen kerja PLN, Astra, BUMN, dan perusahaan lainnya dengan ribuan soal berkualitas. Timer realistis, pembahasan lengkap, dan analisis progress.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TembusKarir · Platform Simulasi Tes Kerja BUMN & Swasta',
    description:
      'Latihan simulasi tes rekrutmen kerja PLN, Astra, BUMN, dan perusahaan lainnya dengan ribuan soal berkualitas.',
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
      <body className={`${hanken.variable} ${bricolage.variable} ${spaceGrotesk.variable} font-sans antialiased bg-paper text-slate-600 overflow-x-hidden selection:bg-blue-100 selection:text-blue-700`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
