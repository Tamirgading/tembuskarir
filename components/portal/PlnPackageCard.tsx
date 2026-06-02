'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2 } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import LoginModal from '@/components/ui/LoginModal'
import { BuyButton } from '@/components/ui/BuyButton'

interface PlnPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  isUnlocked: boolean
  index: number
}

const PLN_SUBTEST_TAGS = [
  { label: 'NUM', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { label: 'VER', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: 'SIL', cls: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: 'DER', cls: 'bg-red-50 text-red-500 border-red-200' },
  { label: 'FIG', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
  { label: 'PU',  cls: 'bg-sky-50 text-sky-600 border-sky-200' },
  { label: 'LA',  cls: 'bg-violet-50 text-violet-600 border-violet-200' },
  { label: 'AKHLAK', cls: 'bg-purple-50 text-purple-600 border-purple-200' },
]

export default function PlnPackageCard({
  pkg,
  isLoggedIn,
  isUnlocked,
  index,
}: PlnPackageCardProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)

  const canAccess = pkg.is_free || isUnlocked
  const isLocked = isLoggedIn && !canAccess

  function handleStart() {
    if (!isLoggedIn) { setShowLoginModal(true); return }
    if (!canAccess) { setShowBuyModal(true); return }
    router.push(`/persiapan/${pkg.id}`)
  }

  return (
    <>
      <div className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        isLocked
          ? 'border-hairline hover:border-brand/30 hover:shadow-md'
          : 'border-hairline hover:border-brand/50 hover:shadow-lg hover:-translate-y-0.5'
      }`}>
        {/* Accent bar kiri — brand */}
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors ${
          pkg.is_free ? 'bg-brand group-hover:bg-brand-700'
          : isUnlocked ? 'bg-brand group-hover:bg-brand-700'
          : 'bg-ink group-hover:bg-ink-soft'
        }`} />

        <div className="pl-5 pr-5 py-4 flex items-center gap-4">
          {/* Nomor */}
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-num font-bold ${
            pkg.is_free ? 'bg-brand/10 text-brand-700'
            : isUnlocked ? 'bg-brand/10 text-brand-700'
            : 'bg-paper-soft text-ink-soft'
          }`}>
            {isUnlocked && !pkg.is_free
              ? <CheckCircle2 className="w-4 h-4 text-brand" />
              : String(index + 1).padStart(2, '0')}
          </div>

          {/* Konten */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5">
              <h3 className="font-bold text-ink text-sm leading-snug flex-1">{pkg.name}</h3>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                pkg.is_free ? 'bg-brand/10 text-brand-700'
                : isUnlocked ? 'bg-brand/10 text-brand-700'
                : 'bg-amber-100 text-amber-700'
              }`}>
                {pkg.is_free ? 'GRATIS' : isUnlocked ? '✓ DIMILIKI' : '✦ PREMIUM'}
              </span>
            </div>

            {pkg.description && (
              <p className="text-xs text-ink-muted mb-2 leading-relaxed line-clamp-1">{pkg.description}</p>
            )}

            <div className="flex gap-1.5 flex-wrap">
              {PLN_SUBTEST_TAGS.map((s) => (
                <span key={s.label} className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${s.cls}`}>
                  {s.label}
                </span>
              ))}
              <span className="text-xs px-2 py-0.5 rounded-md bg-paper-soft text-ink-muted border border-hairline font-num">
                {pkg.duration_minutes} mnt
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={handleStart}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                canAccess
                  ? 'bg-brand text-white hover:bg-brand-700 shadow-soft'
                  : !isLoggedIn
                  ? 'bg-brand text-white hover:bg-brand-700 shadow-soft'
                  : 'bg-ink text-white hover:bg-ink-soft shadow-soft'
              }`}
            >
              {!isLoggedIn ? 'Mulai'
                : !canAccess ? <><Lock className="w-3.5 h-3.5" /> Beli</>
                : 'Mulai →'}
            </button>
            {isLocked && (
              <span className="text-[10px] text-ink-muted font-semibold">Rp 10.000</span>
            )}
            {!isLocked && (
              <span className="text-xs text-ink-muted font-num">{pkg.total_questions} soal</span>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-soft border border-hairline overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-brand to-brand-700" />
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
                  <span className="font-num text-base font-extrabold text-ink">Rp 10.000</span>
                </div>
                <p className="text-xs text-ink-muted mb-3">Akses permanen untuk paket ini saja</p>
                <BuyButton
                  planType="package"
                  planLabel="Beli Paket — Rp 10.000"
                  amount={10000}
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
