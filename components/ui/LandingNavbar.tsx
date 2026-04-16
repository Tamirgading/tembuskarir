'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoginModal from '@/components/ui/LoginModal'

interface LandingNavbarProps {
  isLoggedIn: boolean
  firstName: string | null
}

export default function LandingNavbar({ isLoggedIn, firstName }: LandingNavbarProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
              <Image src="/logotk.png" alt="Tembuskarir" width={140} height={40} className="h-10 w-auto object-contain" priority />
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="#fitur" className="hover:text-blue-600 transition-colors py-2 relative group">
                Fitur
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="#jenis-tes" className="hover:text-blue-600 transition-colors py-2 relative group">
                Jenis Tes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>

              {isLoggedIn ? (
                <Link href="/dashboard"
                  className="flex items-center gap-3 px-2 py-1 pr-4 ml-4 bg-slate-50 rounded-full border border-slate-200 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Halo,</p>
                    <span className="font-bold text-slate-700 text-sm leading-none">{firstName}</span>
                  </div>
                  <svg className="w-3 h-3 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-5 py-2.5 font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Masuk
                  </button>
                  <Link href="/register"
                    className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95">
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Masuk
                  </button>
                  <Link href="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">
                    Daftar
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}
