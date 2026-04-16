'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2 } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import LoginModal from '@/components/ui/LoginModal'
import { BuyButton } from '@/components/ui/BuyButton'

interface AstraPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  isUnlocked: boolean
  index: number
}

const ASTRA_SUBTESTS = [
  { label: 'QR',  cls: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: 'DR',  cls: 'bg-amber-50 text-amber-600 border-amber-200' },
  { label: 'RC',  cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { label: 'IR',  cls: 'bg-red-50 text-red-500 border-red-200' },
  { label: 'VIZ', cls: 'bg-rose-50 text-rose-600 border-rose-200' },
  { label: 'PS',  cls: 'bg-pink-50 text-pink-600 border-pink-200' },
  { label: 'WM',  cls: 'bg-purple-50 text-purple-600 border-purple-200' },
]

export default function AstraPackageCard({
  pkg,
  isLoggedIn,
  isUnlocked,
  index,
}: AstraPackageCardProps) {
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
          ? 'border-gray-200 hover:border-orange-300 hover:shadow-md'
          : 'border-gray-200 hover:border-orange-400 hover:shadow-lg hover:-translate-y-0.5'
      }`}>
        {/* Accent bar kiri */}
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors ${
          pkg.is_free ? 'bg-green-400 group-hover:bg-green-500'
          : isUnlocked ? 'bg-orange-400 group-hover:bg-orange-500'
          : 'bg-amber-400 group-hover:bg-amber-500'
        }`} />

        <div className="pl-5 pr-5 py-4 flex items-center gap-4">
          {/* Nomor */}
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
            pkg.is_free ? 'bg-green-50 text-green-600'
            : isUnlocked ? 'bg-orange-50 text-orange-600'
            : 'bg-amber-50 text-amber-600'
          }`}>
            {isUnlocked && !pkg.is_free
              ? <CheckCircle2 className="w-4 h-4" />
              : String(index + 1).padStart(2, '0')}
          </div>

          {/* Konten */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5">
              <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">{pkg.name}</h3>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                pkg.is_free ? 'bg-green-100 text-green-700'
                : isUnlocked ? 'bg-orange-100 text-orange-700'
                : 'bg-amber-100 text-amber-700'
              }`}>
                {pkg.is_free ? 'GRATIS' : isUnlocked ? '✓ DIMILIKI' : '✦ PREMIUM'}
              </span>
            </div>

            {pkg.description && (
              <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-1">{pkg.description}</p>
            )}

            {/* Subtest tags */}
            <div className="flex gap-1.5 flex-wrap">
              {ASTRA_SUBTESTS.map((s) => (
                <span key={s.label} className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${s.cls}`}>
                  {s.label}
                </span>
              ))}
              <span className="text-xs px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 border border-gray-200">
                ⏱ {pkg.duration_minutes} mnt
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={handleStart}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                canAccess
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-orange-200 hover:shadow-md'
                  : !isLoggedIn
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
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

      {/* Modal: login */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Modal: beli */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400" />
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
                  className="bg-orange-500 text-white hover:bg-orange-600"
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
