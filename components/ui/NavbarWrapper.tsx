'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

interface NavbarWrapperProps {
  userName: string | null
}

/**
 * Client wrapper agar Navbar bisa disembunyikan secara reaktif.
 * Menggunakan usePathname() sehingga update saat soft navigation.
 */
export function NavbarWrapper({ userName }: NavbarWrapperProps) {
  const pathname = usePathname()

  // Sembunyikan navbar di semua halaman ujian
  if (pathname.startsWith('/ujian')) return null

  return <Navbar userName={userName} />
}
