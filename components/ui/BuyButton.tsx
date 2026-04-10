'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BuyButtonProps {
  planType: 'monthly' | 'yearly'
  planLabel: string
  amount: number
  highlight: boolean
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess: (result: unknown) => void
          onPending: (result: unknown) => void
          onError: (result: unknown) => void
          onClose: () => void
        }
      ) => void
    }
  }
}

export function BuyButton({ planType, planLabel, amount, highlight }: BuyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleBuy() {
    setLoading(true)
    setError('')

    try {
      // Minta snap token dari server
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, amount }),
      })

      const data = await res.json() as { snapToken?: string; error?: string }

      if (!res.ok || !data.snapToken) {
        setError(data.error ?? 'Gagal membuat transaksi. Coba lagi.')
        setLoading(false)
        return
      }

      // Load Midtrans Snap script jika belum ada
      await loadSnapScript()

      if (!window.snap) {
        setError('Gagal memuat Midtrans. Refresh halaman dan coba lagi.')
        setLoading(false)
        return
      }

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          router.push('/dashboard?payment=success')
        },
        onPending: () => {
          router.push('/dashboard?payment=pending')
        },
        onError: () => {
          setError('Pembayaran gagal. Silakan coba lagi.')
          setLoading(false)
        },
        onClose: () => {
          setLoading(false)
        },
      })
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 ${
          highlight
            ? 'bg-white text-blue-600 hover:bg-blue-50'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 'Memproses...' : `Beli ${planLabel}`}
      </button>
      {error && (
        <p className={`text-xs ${highlight ? 'text-blue-200' : 'text-red-500'}`}>{error}</p>
      )}
    </div>
  )
}

function loadSnapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.snap) {
      resolve()
      return
    }

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const isProd = process.env.NODE_ENV === 'production'
    const src = isProd
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'

    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.setAttribute('data-client-key', clientKey ?? '')
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}
