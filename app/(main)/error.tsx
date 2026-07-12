'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log ke console agar mudah debug
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
          <p className="text-gray-500 text-sm">
            Halaman mengalami error yang tidak terduga. Data ujian kamu tersimpan otomatis,
            kamu bisa lanjutkan dari halaman sebelumnya.
          </p>
        </div>

        {/* Pesan error teknis (hanya di development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
            <p className="text-xs font-semibold text-red-700 mb-1">Detail Error (dev only):</p>
            <p className="text-xs text-red-600 font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-400 mt-1">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Beranda
          </button>
        </div>
      </div>
    </div>
  )
}
