'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, Clock, FileText } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import LoginModal from '@/components/ui/LoginModal'
import { BuyButton } from '@/components/ui/BuyButton'
import { getSatuanPrice } from '@/lib/plans'

interface AstraPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  hasPremium?: boolean
  isUnlocked: boolean
  index: number
}

const ASTRA_SUBTEST_LABELS = ['QR', 'DR', 'RC', 'IR', 'VIZ', 'PS', 'WM']

export default function AstraPackageCard({
  pkg,
  isLoggedIn,
  hasPremium = false,
  isUnlocked,
}: AstraPackageCardProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)

  const canAccess = pkg.is_free || isUnlocked || hasPremium
  const isLocked = isLoggedIn && !canAccess

  function handleStart() {
    if (!isLoggedIn) { setShowLoginModal(true); return }
    if (!canAccess) { setShowBuyModal(true); return }
    router.push(`/persiapan/${pkg.id}`)
  }

  return (
    <>
      <div className="group bg-white rounded-2xl border border-hairline shadow-soft hover:shadow-md hover:border-brand/30 transition-all duration-200">
        <div className="px-5 py-4 flex items-center gap-5">

          {/* Konten */}
          <div className="flex-1 min-w-0">
            {/* Baris nama + status */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-heading font-bold text-ink text-[15px] leading-snug">{pkg.name}</h3>
              {pkg.is_free && (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0">
                  Gratis
                </span>
              )}
              {!pkg.is_free && isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Dimiliki
                </span>
              )}
              {!pkg.is_free && !isUnlocked && isLoggedIn && (
                <span className="text-[10px] font-semibold text-ink-muted shrink-0">Premium</span>
              )}
            </div>

            {/* Deskripsi */}
            {pkg.description && (
              <p className="text-xs text-ink-muted leading-relaxed line-clamp-1 mb-2.5">{pkg.description}</p>
            )}

            {/* Meta: subtest tags + durasi + jumlah soal */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {ASTRA_SUBTEST_LABELS.map((label) => (
                <span
                  key={label}
                  className="text-[10px] font-semibold text-ink-soft bg-paper-soft border border-hairline px-1.5 py-0.5 rounded-md"
                >
                  {label}
                </span>
              ))}
              <span className="text-ink-muted/40 text-xs mx-0.5">·</span>
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="w-3 h-3" />
                {pkg.duration_minutes} mnt
              </span>
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <FileText className="w-3 h-3" />
                {pkg.total_questions} soal
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={handleStart}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                canAccess || !isLoggedIn
                  ? 'bg-brand text-white hover:bg-brand-700 shadow-sm'
                  : 'bg-ink text-white hover:bg-ink-soft shadow-sm'
              }`}
            >
              {!isLoggedIn
                ? 'Mulai →'
                : !canAccess
                ? <><Lock className="w-3.5 h-3.5" /> Beli</>
                : 'Mulai →'}
            </button>
            {isLocked && (
              <span className="text-[10px] text-ink-muted">{getSatuanPrice(pkg.slug).toLocaleString('id-ID')}</span>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-soft border border-hairline overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-brand to-emerald-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading font-extrabold text-ink text-base">Akses Paket Ini</h3>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">{pkg.name}</p>
                </div>
                <button onClick={() => setShowBuyModal(false)} className="text-ink-muted hover:text-ink text-lg leading-none">×</button>
              </div>

              <div className="border border-hairline rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-ink text-sm">Beli Paket Ini</p>
                  <span className="font-num text-base font-extrabold text-ink">{getSatuanPrice(pkg.slug).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-xs text-ink-muted mb-3">Akses permanen untuk paket ini saja</p>
                <BuyButton
                  planType="package"
                  planLabel={`Beli Paket — ${getSatuanPrice(pkg.slug).toLocaleString('id-ID')}`}
                  amount={getSatuanPrice(pkg.slug)}
                  packageId={pkg.id}
                  onSuccess={() => { setShowBuyModal(false); router.refresh() }}
                  className="bg-brand text-white hover:bg-brand-700"
                />
              </div>

              <p className="text-[10px] text-center text-ink-muted mt-4">
                Pembayaran aman via Midtrans · Aktif instan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
