'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

function formatDateID(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export default function RedeemPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    expires_at?: string
    duration_days?: number
  } | null>(null)

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/voucher/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: data.message, expires_at: data.expires_at, duration_days: data.duration_days })
        setCode('')
      } else {
        setResult({ success: false, message: data.error ?? 'Gagal memproses voucher.' })
      }
    } catch {
      setResult({ success: false, message: 'Terjadi kesalahan. Coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
          <Ticket className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Redeem Voucher</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Masukkan kode voucher untuk mengaktifkan akses premium.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">
              Kode Voucher
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: TEMBUS2026"
              maxLength={32}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" />
                Gunakan Voucher
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className={`mt-4 rounded-xl p-4 flex gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-semibold ${result.success ? 'text-green-800' : 'text-red-700'}`}>
                {result.message}
              </p>
              {result.success && result.expires_at && (
                <p className="text-sm text-green-700 mt-1">
                  Akses premium aktif hingga{' '}
                  <span className="font-semibold">{formatDateID(result.expires_at)}</span>.
                  {result.duration_days && (
                    <span className="text-green-600"> (+{result.duration_days} hari)</span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {result?.success && (
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 w-full text-center text-sm text-blue-600 hover:underline font-medium"
          >
            Kembali ke Dashboard →
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Punya pertanyaan tentang voucher? Hubungi{' '}
        <a href="mailto:tembuskarir@gmail.com" className="underline hover:text-gray-600">
          tembuskarir@gmail.com
        </a>
      </p>
    </div>
  )
}
