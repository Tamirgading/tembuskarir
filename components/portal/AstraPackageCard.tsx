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
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Konten */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
              {pkg.is_free && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Gratis
                </span>
              )}
              {!pkg.is_free && isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dimiliki
                </span>
              )}
              {!pkg.is_free && !isUnlocked && isLoggedIn && (
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  Premium
                </span>
              )}
            </div>

            {pkg.description && (
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed line-clamp-2">{pkg.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {ASTRA_SUBTEST_LABELS.map((label) => (
                <span key={label} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">
                  {label}
                </span>
              ))}
              <span className="text-slate-300 px-1">·</span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" /> {pkg.duration_minutes} mnt
              </span>
              <span className="text-slate-300 px-1">·</span>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <FileText className="w-3.5 h-3.5" /> {pkg.total_questions} soal
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-1.5">
            <button
              onClick={handleStart}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 group ${
                canAccess || !isLoggedIn
                  ? 'text-white shadow-blue-900/10 hover:shadow-lg'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
              style={canAccess || !isLoggedIn ? { background: 'linear-gradient(to right, #16487E, #1F5DA1)' } : undefined}
            >
              {!isLoggedIn ? (
                <><span>Mulai Simulasi</span><span className="group-hover:translate-x-1 transition-transform font-bold">→</span></>
              ) : !canAccess ? (
                <><Lock className="w-3.5 h-3.5" /><span>Beli Akses</span></>
              ) : (
                <><span>Mulai Simulasi</span><span className="group-hover:translate-x-1 transition-transform font-bold">→</span></>
              )}
            </button>
            {isLocked && (
              <span className="text-[10px] text-slate-400">{getSatuanPrice(pkg.slug).toLocaleString('id-ID')}</span>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
            <div className="h-1 w-full" style={{ background: 'linear-gradient(to right,#00315f,#10b981)' }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Akses Paket Ini</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{pkg.name}</p>
                </div>
                <button onClick={() => setShowBuyModal(false)} className="text-slate-500 hover:text-slate-900 text-lg leading-none">×</button>
              </div>

              <div className="border border-slate-200/90 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-900 text-sm">Beli Paket Ini</p>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">{getSatuanPrice(pkg.slug).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Akses permanen untuk paket ini saja</p>
                <BuyButton
                  planType="package"
                  planLabel={`Beli Paket - Rp ${getSatuanPrice(pkg.slug).toLocaleString('id-ID')}`}
                  amount={getSatuanPrice(pkg.slug)}
                  packageId={pkg.id}
                  onSuccess={() => { setShowBuyModal(false); router.refresh() }}
                  className="bg-[#00315f] text-white hover:bg-[#16487e]"
                />
              </div>

              <p className="text-[10px] text-center text-slate-500 mt-4">
                Pembayaran aman via Midtrans · Aktif instan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
