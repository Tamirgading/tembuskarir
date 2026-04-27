'use client'

import { usePathname } from 'next/navigation'

/**
 * Client wrapper untuk container padding.
 * Menghapus padding/max-width saat di halaman ujian agar exam full-width.
 */
export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Halaman ujian: langsung render tanpa padding container
  if (pathname.startsWith('/ujian')) return <>{children}</>

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  )
}
