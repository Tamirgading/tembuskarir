'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoginModal from '@/components/ui/LoginModal'

export default function PortalLoginCard() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-blue-200">
        <p className="text-white font-bold text-sm mb-1">Mulai Latihan Gratis</p>
        <p className="text-blue-200 text-xs mb-4 leading-relaxed">
          Daftar sekarang dan akses soal SKD CPNS tanpa biaya
        </p>
        <Link
          href="/register"
          className="block w-full text-center py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
        >
          Daftar Gratis →
        </Link>
        <button
          onClick={() => setShowLoginModal(true)}
          className="block w-full text-center py-2 text-blue-200 text-xs hover:text-white transition-colors mt-2"
        >
          Sudah punya akun? <span className="font-semibold underline underline-offset-2">Masuk</span>
        </button>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}
