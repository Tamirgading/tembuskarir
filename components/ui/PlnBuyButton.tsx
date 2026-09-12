'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { AKDING_BIDANG, BIDANG_BY_SLUG, PLN_BIDANG_PLANS } from '@/lib/bidang-config'
import { CheckoutModal } from '@/components/ui/CheckoutModal'

type PlnPlanType = 'pln_gat_monthly' | 'pln_tahap2_monthly' | 'pln_complete_monthly'

interface PlnBuyButtonProps {
  planType: PlnPlanType
  planLabel: string
  amount: number
  highlight?: boolean
  preselectedBidang?: string   // dari URL ?plnBidang=...
  className?: string
  onSuccess?: () => void
}

const requiresBidang = (t: PlnPlanType) =>
  (PLN_BIDANG_PLANS as readonly string[]).includes(t)

export function PlnBuyButton({
  planType,
  planLabel,
  amount,
  highlight = false,
  preselectedBidang,
  className,
  onSuccess,
}: PlnBuyButtonProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedBidang, setSelectedBidang] = useState(preselectedBidang ?? '')

  function handleClick() {
    if (!requiresBidang(planType)) {
      setCheckoutOpen(true)
      return
    }
    if (selectedBidang) {
      setCheckoutOpen(true)
      return
    }
    setShowPicker(true)
  }

  function chooseBidang(slug: string) {
    setSelectedBidang(slug)
    setShowPicker(false)
    setCheckoutOpen(true)
  }

  const btnBase = highlight
    ? 'bg-brand text-white hover:bg-brand-700'
    : 'bg-ink text-white hover:bg-ink-soft'

  return (
    <>
      <div className="space-y-1.5">
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-colors ${className ?? btnBase}`}
        >
          {planLabel}
        </button>
        {selectedBidang && requiresBidang(planType) && (
          <p className="text-[11px] text-center text-ink-muted">
            Bidang: <strong className="text-ink">{BIDANG_BY_SLUG[selectedBidang]?.name}</strong>
            <button onClick={() => setSelectedBidang('')} className="ml-1 text-brand underline">ubah</button>
          </p>
        )}
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
                    onClick={() => chooseBidang(b.slug)}
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

      {checkoutOpen && (
        <CheckoutModal
          planType={planType}
          planLabel={planLabel}
          amount={amount}
          bidang={selectedBidang || undefined}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
