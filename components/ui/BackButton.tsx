'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackHref?: string
  label?: string
}

export default function BackButton({ fallbackHref = '/', label = 'Kembali' }: BackButtonProps) {
  const router = useRouter()

  function handleBack() {
    // Jika ada riwayat browser, gunakan router.back()
    // Jika tidak (dibuka langsung), fallback ke href
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </button>
  )
}
