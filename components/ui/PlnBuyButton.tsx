'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import { AKDING_BIDANG, BIDANG_BY_SLUG, PLN_BIDANG_PLANS } from '@/lib/bidang-config'

type PlnPlanType = 'pln_gat_monthly' | 'pln_tahap2_monthly' | 'pln_complete_monthly'

interface PlnBuyButtonProps {
  planType: PlnPlanType
  planLabel: string
  highlight?: boolean
  preselectedBidang?: string   // dari URL ?plnBidang=...
  className?: string
  onSuccess?: () => void
}


function loadSnap(): Promise<void> {
  return new Promise((resolve) => {
    if (window.snap) { resolve(); return }
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''
    const isProd = process.env.NODE_ENV === 'production'
    const src = isProd
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.src = src
    s.setAttribute('data-client-key', clientKey)
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
}

const requiresBidang = (t: PlnPlanType) =>
  (PLN_BIDANG_PLANS as readonly string[]).includes(t)

export function PlnBuyButton({
  planType,
  planLabel,
  highlight = false,
  preselectedBidang,
  className,
  onSuccess,
}: PlnBuyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [selectedBidang, setSelectedBidang] = useState(preselectedBidang ?? '')

  async function doPay(bidang: string) {
    setLoading(true)
    setError('')
    setShowPicker(false)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, bidang: bidang || undefined }),
      })
      const data = await res.json() as { snapToken?: string; error?: string }
      if (!res.ok || !data.snapToken) {
        setError(data.error ?? 'Gagal membuat transaksi.')
        setLoading(false)
        return
      }
      await loadSnap()
      if (!window.snap) {
        setError('Gagal memuat Midtrans. Coba refresh halaman.')
        setLoading(false)
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window.snap as any).pay(data.snapToken, {
        onSuccess: () => { if (onSuccess) { onSuccess() } else { router.push('/?payment=success') } },
        onPending: () => { router.push('/?payment=pending') },
        onError: () => { setError('Pembayaran gagal. Coba lagi.'); setLoading(false) },
        onClose: () => { setLoading(false) },
      })
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

  function handleClick() {
    if (!requiresBidang(planType)) {
      doPay('')
      return
    }
    if (selectedBidang) {
      doPay(selectedBidang)
      return
    }
    setShowPicker(true)
  }

  const btnBase = highlight
    ? 'bg-brand text-white hover:bg-brand-700'
    : 'bg-ink text-white hover:bg-ink-soft'

  return (
    <>
      <div className="space-y-1.5">
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className ?? btnBase}`}
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : planLabel}
        </button>
        {selectedBidang && requiresBidang(planType) && (
          <p className="text-[11px] text-center text-ink-muted">
            Bidang: <strong className="text-ink">{BIDANG_BY_SLUG[selectedBidang]?.name}</strong>
            <button onClick={() => setSelectedBidang('')} className="ml-1 text-brand underline">ubah</button>
          </p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* ── Bidang Picker Modal ── */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] max-w-lg mx-auto bg-white rounded-3xl shadow-soft overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
              <div>
                <p className="font-heading font-bold text-ink">Pilih Bidang Akademikmu</p>
                <p className="text-xs text-ink-muted mt-0.5">Subscription hanya berlaku untuk 1 bidang AKDING</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-1.5 rounded-lg text-ink-muted hover:bg-paper-soft">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid bidang */}
            <div className="p-4 overflow-y-auto max-h-[55vh]">
              <div className="grid grid-cols-2 gap-2">
                {AKDING_BIDANG.map((b) => (
                  <button
                    key={b.slug}
                    onClick={() => { setSelectedBidang(b.slug); doPay(b.slug) }}
                    className="flex items-center gap-2.5 text-left p-3 rounded-xl border border-hairline hover:border-brand/40 hover:bg-brand/5 transition-all group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 border ${b.color}`}>
                      {b.short.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-ink leading-snug group-hover:text-brand">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-hairline bg-paper-soft">
              <p className="text-[11px] text-ink-muted">Bidang yang dipilih tidak bisa diubah setelah pembayaran. Pastikan sesuai bidangmu di rekrutmen PLN.</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
