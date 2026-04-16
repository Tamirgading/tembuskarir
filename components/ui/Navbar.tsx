'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  userName: string | null
  userPlan: 'free' | 'premium'
}

export default function Navbar({ userName, userPlan }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/dashboard', label: 'Beranda' },
    { href: '/paket', label: 'Paket Soal' },
    { href: '/harga', label: 'Harga' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            TryOut Platform
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {userPlan === 'premium' ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                ✦ Premium
              </span>
            ) : (
              <Link
                href="/harga"
                className="hidden sm:inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade
              </Link>
            )}

            <Link
              href="/profil"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:block font-medium">{userName ?? 'Pengguna'}</span>
            </Link>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {signingOut ? '...' : 'Keluar'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
