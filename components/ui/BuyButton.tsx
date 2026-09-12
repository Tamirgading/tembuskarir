'use client'

import { useState } from 'react'
import { CheckoutModal } from '@/components/ui/CheckoutModal'

type PlanType = string

interface BuyButtonProps {
  planType: PlanType
  planLabel: string
  amount: number
  highlight?: boolean
  packageId?: string         // wajib jika planType === 'package'
  className?: string
  onSuccess?: () => void     // callback opsional (misal: tutup modal)
}

export function BuyButton({
  planType,
  planLabel,
  amount,
  highlight = false,
  packageId,
  className,
  onSuccess,
}: BuyButtonProps) {
  const [open, setOpen] = useState(false)

  const defaultClass = highlight
    ? 'bg-white text-blue-600 hover:bg-blue-50'
    : 'bg-blue-600 text-white hover:bg-blue-700'

  return (
    <>
      <div className="space-y-1.5">
        <button
          onClick={() => setOpen(true)}
          className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${className ?? defaultClass}`}
        >
          {planLabel}
        </button>
      </div>

      {open && (
        <CheckoutModal
          planType={planType}
          planLabel={planLabel}
          amount={amount}
          packageId={packageId}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
