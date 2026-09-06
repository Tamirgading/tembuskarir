import { Plus_Jakarta_Sans, DM_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${jakarta.variable} ${dmSans.variable} ${inter.variable}`}>
      {children}
    </div>
  )
}
