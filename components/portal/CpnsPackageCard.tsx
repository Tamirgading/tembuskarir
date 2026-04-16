'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2 } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import LoginModal from '@/components/ui/LoginModal'
import { BuyButton } from '@/components/ui/BuyButton'

interface CpnsPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  hasCpnsSubscription: boolean  // punya langganan CPNS aktif
  isUnlocked: boolean           // sudah beli satuan
  index: number
}

export default function CpnsPackageCard({
  pkg,
  isLoggedIn,
  hasCpnsSubscription,
  isUnlocked,
  index,
}: CpnsPackageCardProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showBuyModal, setShowBuyModal] = useState(false)

  const canAccess = pkg.is_free || hasCpnsSubscription || isUnlocked
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
          ? 'border-gray-200 hover:border-amber-300 hover:shadow-md'
          : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5'
      }`}>
        {/* Accent bar kiri */}
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors ${
          pkg.is_free ? 'bg-green-400 group-hover:bg-green-500'
          : isUnlocked ? 'bg-blue-400 group-hover:bg-blue-500'
          : 'bg-amber-400 group-hover:bg-amber-500'
        }`} />

        <div className="pl-5 pr-5 py-4 flex items-center gap-4">
          {/* Nomor urut */}
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
            pkg.is_free ? 'bg-green-50 text-green-600'
            : isUnlocked ? 'bg-blue-50 text-blue-600'
            : 'bg-amber-50 text-amber-600'
          }`}>
            {isUnlocked && !pkg.is_free
              ? <CheckCircle2 className="w-4 h-4" />
              : String(index + 1).padStart(2, '0')}
          </div>

          {/* Konten utama */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5">
              <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">{pkg.name}</h3>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                pkg.is_free ? 'bg-green-100 text-green-700'
                : isUnlocked ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
              }`}>
                {pkg.is_free ? 'GRATIS' : isUnlocked ? '✓ DIMILIKI' : '✦ PREMIUM'}
              </span>
            </div>

            {pkg.description && (
              <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-1">{pkg.description}</p>
            )}

            {/* Tag sub-tes */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: 'TWK', q: 30, cls: 'bg-blue-50 text-blue-600 border-blue-200' },
                { label: 'TIU', q: 35, cls: 'bg-purple-50 text-purple-600 border-purple-200' },
                { label: 'TKP', q: 45, cls: 'bg-green-50 text-green-600 border-green-200' },
              ].map((s) => (
                <span key={s.label} className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${s.cls}`}>
                  {s.label} <span className="font-normal opacity-75">{s.q}</span>
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-blue-200 hover:shadow-md'
                  : !isLoggedIn
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
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

      {/* Modal: pilih cara beli */}
      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Akses Paket Ini</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{pkg.name}</p>
                </div>
                <button onClick={() => setShowBuyModal(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              </div>

              <div className="space-y-3">
                {/* Per-paket */}
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
                    className="bg-amber-500 text-white hover:bg-amber-600"
                  />
                </div>

                {/* Langganan */}
                <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-blue-900 text-sm">Langganan Bulanan</p>
                    <span className="text-base font-extrabold text-blue-900">Rp 39.000</span>
                  </div>
                  <p className="text-xs text-blue-600 mb-3">Akses semua paket SKD selama 30 hari</p>
                  <BuyButton
                    planType="cpns_monthly"
                    planLabel="Berlangganan — Rp 39.000/bln"
                    amount={39000}
                    onSuccess={() => { setShowBuyModal(false); router.refresh() }}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  />
                </div>
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
