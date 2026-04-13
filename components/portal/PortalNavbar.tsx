'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface PortalNavbarProps {
  isLoggedIn: boolean
  userName: string | null
  userPlan: 'free' | 'premium'
}

export default function PortalNavbar({ isLoggedIn, userName, userPlan }: PortalNavbarProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + breadcrumb */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-blue-600">
              TembusKarir
            </Link>
            <span className="text-gray-300 hidden sm:block">/</span>
            <span className="hidden sm:block text-sm font-medium text-gray-600">Portal Seleksi</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
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
                  href="/dashboard"
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
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
