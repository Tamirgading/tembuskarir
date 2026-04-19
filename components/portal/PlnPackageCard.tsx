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
  { label: 'PU', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: 'LA', cls: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
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
          ? 'border-gray-200 hover:border-yellow-300 hover:shadow-md'
          : 'border-gray-200 hover:border-yellow-400 hover:shadow-lg hover:-translate-y-0.5'
      }`}>
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors ${
          pkg.is_free ? 'bg-green-400 group-hover:bg-green-500'
          : isUnlocked ? 'bg-yellow-400 group-hover:bg-yellow-500'
          : 'bg-amber-400 group-hover:bg-amber-500'
        }`} />

        <div className="pl-5 pr-5 py-4 flex items-center gap-4">
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
            pkg.is_free ? 'bg-green-50 text-green-600'
            : isUnlocked ? 'bg-yellow-50 text-yellow-700'
            : 'bg-amber-50 text-amber-600'
          }`}>
            {isUnlocked && !pkg.is_free
              ? <CheckCircle2 className="w-4 h-4" />
              : String(index + 1).padStart(2, '0')}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5">
              <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">{pkg.name}</h3>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                pkg.is_free ? 'bg-green-100 text-green-700'
                : isUnlocked ? 'bg-yellow-100 text-yellow-700'
                : 'bg-amber-100 text-amber-700'
              }`}>
                {pkg.is_free ? 'GRATIS' : isUnlocked ? '✓ DIMILIKI' : '✦ PREMIUM'}
              </span>
            </div>

            {pkg.description && (
              <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-1">{pkg.description}</p>
            )}

            <div className="flex gap-1.5 flex-wrap">
              {PLN_SUBTEST_TAGS.map((s) => (
                <span key={s.label} className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${s.cls}`}>
                  {s.label}
                </span>
              ))}
              <span className="text-xs px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 border border-gray-200">
                ⏱ {pkg.duration_minutes} mnt
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={handleStart}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                canAccess
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm hover:shadow-yellow-200 hover:shadow-md'
                  : !isLoggedIn
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-amber-200 hover:shadow-md'
              }`}
            >
              {!isLoggedIn ? 'Mulai'
                : !canAccess ? <><Lock className="w-3.5 h-3.5" /> Beli</>
                : 'Mulai →'}
            </button>
            {isLocked && (
              <span className="text-[10px] text-amber-600 font-semibold">Rp 10.000</span>
            )}
            {!isLocked && (
              <span className="text-xs text-gray-400">{pkg.total_questions} soal</span>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Akses Paket Ini</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{pkg.name}</p>
                </div>
                <button onClick={() => setShowBuyModal(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-gray-900 text-sm">Beli Paket Ini</p>
                  <span className="text-base font-extrabold text-gray-900">Rp 10.000</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Akses permanen untuk paket ini saja</p>
                <BuyButton
                  planType="package"
                  planLabel="Beli Paket — Rp 10.000"
                  amount={10000}
                  packageId={pkg.id}
                  onSuccess={() => { setShowBuyModal(false); router.refresh() }}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                />
              </div>

              <p className="text-[10px] text-center text-gray-400 mt-4">
                Pembayaran aman via Midtrans · Aktif instan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
