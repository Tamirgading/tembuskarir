'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogIn, UserPlus } from 'lucide-react'
import LoginModal from '@/components/ui/LoginModal'

/** CTA masuk/daftar untuk pengunjung yang belum login (dipakai di beranda guest). */
export default function GuestLoginCta() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Daftar Gratis
        </Link>
        <button
          onClick={() => setShowLoginModal(true)}
          className="inline-flex items-center gap-2 bg-white border border-hairline text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper-soft transition-colors"
        >
          <LogIn className="w-4 h-4" /> Masuk
        </button>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
