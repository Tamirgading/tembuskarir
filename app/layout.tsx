import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { VisitTracker } from '@/components/ui/VisitTracker'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans', 
  display: 'swap' 
})

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
    <html lang="id" className={`scroll-smooth ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-paper text-ink-soft overflow-x-hidden selection:bg-brand-light/30 selection:text-brand-dark">
        {children}
        <VisitTracker />
        <Analytics />
      </body>
    </html>
  )
}
