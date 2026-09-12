'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Ticket, CheckCircle2, Tag } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

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

interface AppliedVoucher {
  code: string
  name: string | null
  discount_value: number
  discount_amount: number
  final_amount: number
}

interface CheckoutModalProps {
  planType: string
  planLabel: string
  amount: number
  packageId?: string
  bidang?: string
  onClose: () => void
  onSuccess?: () => void
}

function loadSnapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.snap) { resolve(); return }

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const isProd = process.env.NODE_ENV === 'production'
    const src = isProd
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'

    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) { existing.addEventListener('load', () => resolve()); return }

    const script = document.createElement('script')
    script.src = src
    script.setAttribute('data-client-key', clientKey ?? '')
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export function CheckoutModal({
  planType,
  planLabel,
  amount,
  packageId,
  bidang,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<AppliedVoucher | null>(null)
  const [applying, setApplying] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const finalAmount = applied?.final_amount ?? amount

  function handleCodeChange(value: string) {
    setCode(value.toUpperCase())
    if (applied) setApplied(null)
    setError('')
  }

  async function applyCode() {
    if (!code.trim()) return
    setApplying(true)
    setError('')
    try {
      const res = await fetch('/api/voucher/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), planType, packageId }),
      })
      const data = await res.json() as {
        code?: string
        name?: string | null
        discount_value?: number
        discount_amount?: number
        final_amount?: number
        error?: string
      }
      if (!res.ok || !data.code) {
        setError(data.error ?? 'Kode voucher tidak valid.')
        setApplied(null)
        return
      }
      setApplied({
        code: data.code,
        name: data.name ?? null,
        discount_value: data.discount_value ?? 0,
        discount_amount: data.discount_amount ?? 0,
        final_amount: data.final_amount ?? amount,
      })
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setApplying(false)
    }
  }

  async function pay() {
    setPaying(true)
    setError('')
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          packageId,
          bidang,
          voucherCode: applied?.code,
        }),
      })
      const data = await res.json() as { snapToken?: string; error?: string }
      if (!res.ok || !data.snapToken) {
        setError(data.error ?? 'Gagal membuat transaksi. Coba lagi.')
        setPaying(false)
        return
      }

      await loadSnapScript()
      if (!window.snap) {
        setError('Gagal memuat Midtrans. Refresh halaman dan coba lagi.')
        setPaying(false)
        return
      }

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          onClose()
          if (onSuccess) onSuccess()
          else router.push('/?payment=success')
        },
        onPending: () => {
          onClose()
          router.push('/?payment=pending')
        },
        onError: () => {
          setError('Pembayaran gagal. Silakan coba lagi.')
          setPaying(false)
        },
        onClose: () => {
          setPaying(false)
        },
      })
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setPaying(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[301] max-w-md mx-auto bg-white rounded-3xl shadow-soft overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div className="min-w-0">
            <p className="font-bold text-slate-900">Konfirmasi Pembayaran</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{planLabel}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Ringkasan harga */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Harga normal</span>
              <span className={`font-semibold ${applied ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {formatRupiah(amount)}
              </span>
            </div>
            {applied && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-600 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Diskon {applied.discount_value}%
                </span>
                <span className="font-semibold text-emerald-600">
                  -{formatRupiah(applied.discount_amount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Total bayar</span>
              <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                {formatRupiah(finalAmount)}
              </span>
            </div>
          </div>

          {/* Input voucher */}
          {applied ? (
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-800 font-mono tracking-wider">{applied.code}</p>
                {applied.name && <p className="text-[11px] text-emerald-700 truncate">{applied.name}</p>}
              </div>
              <button
                onClick={() => { setApplied(null); setCode('') }}
                className="text-[11px] font-semibold text-emerald-700 underline shrink-0"
              >
                Hapus
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Punya kode diskon?</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyCode() }}
                    placeholder="MASUKKAN KODE"
                    maxLength={32}
                    disabled={applying || paying}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#0F2C44] focus:border-transparent transition"
                  />
                </div>
                <button
                  onClick={applyCode}
                  disabled={applying || paying || !code.trim()}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                >
                  {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Terapkan'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-2.5">
          <button
            onClick={onClose}
            disabled={paying}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={pay}
            disabled={paying}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition disabled:opacity-60"
            style={{ background: 'linear-gradient(to right,#00315f,#16487e)' }}
          >
            {paying ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : `Bayar ${formatRupiah(finalAmount)}`}
          </button>
        </div>
      </div>
    </>
  )
}
