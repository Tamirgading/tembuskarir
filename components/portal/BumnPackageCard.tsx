'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, Clock, FileText } from 'lucide-react'
import type { PackageRow } from '@/lib/utils'
import LoginModal from '@/components/ui/LoginModal'
import { BuyButton } from '@/components/ui/BuyButton'
import { getSatuanPrice } from '@/lib/plans'

interface BumnPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  hasPremium: boolean
  index: number
}

const BADGE_TINT = 'bg-brand/10 text-brand-700 border-brand/20'

const BUMN_SUBTESTS = [
  { label: 'TWK',    cls: BADGE_TINT, title: 'Tes Wawasan Kebangsaan' },
  { label: 'VLR',    cls: BADGE_TINT, title: 'Verbal Logical Reasoning' },
  { label: 'WC',     cls: BADGE_TINT, title: 'Word Classification' },
  { label: 'NS',     cls: BADGE_TINT, title: 'Number Sequence' },
  { label: 'DIAG',   cls: BADGE_TINT, title: 'Diagram Reasoning' },
  { label: 'AKHLAK', cls: BADGE_TINT, title: 'Nilai AKHLAK (poin)' },
]

const TAHAP1_BADGES = [
  { label: 'TKD',    cls: BADGE_TINT, title: 'Tes Kemampuan Dasar' },
  { label: 'AKHLAK', cls: BADGE_TINT, title: 'Nilai AKHLAK' },
  { label: 'TWK',    cls: BADGE_TINT, title: 'Tes Wawasan Kebangsaan' },
]

const TAHAP2_BADGES = [
  { label: 'ER', cls: BADGE_TINT, title: 'Error Recognition' },
  { label: 'RC', cls: BADGE_TINT, title: 'Reading Comprehension' },
  { label: 'SC', cls: BADGE_TINT, title: 'Sentence Completion' },
]

function getBadges(slug: string) {
  if (slug?.startsWith('rbb-bumn-tahap-2')) return TAHAP2_BADGES
  if (slug?.startsWith('rbb-bumn-tahap-1')) return TAHAP1_BADGES
  return BUMN_SUBTESTS
}

export default function BumnPackageCard({ pkg, isLoggedIn, hasPremium, index }: BumnPackageCardProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal]   = useState(false)
  const [showBuyModal, setShowBuyModal]       = useState(false)

  const canAccess = pkg.is_free || hasPremium
  const isLocked  = isLoggedIn && !canAccess

  function handleStart() {
    if (!isLoggedIn) { setShowLoginModal(true); return }
    if (!canAccess)  { setShowBuyModal(true);   return }
    router.push(`/persiapan/${pkg.id}`)
  }

  return (
    <>
      <div className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isLocked
          ? 'border-hairline hover:border-brand/30 hover:shadow-soft'
          : 'border-hairline hover:border-brand/40 hover:shadow-md hover:-translate-y-0.5'
      }`}>
        {/* Accent bar kiri */}
        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors ${
          pkg.is_free ? 'bg-brand group-hover:bg-brand-700'
          : hasPremium ? 'bg-brand group-hover:bg-brand-700'
          : 'bg-brand/40 group-hover:bg-brand/60'
        }`} />

        <div className="pl-5 pr-5 py-4 flex items-center gap-4">
          {/* Nomor */}
          <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
            pkg.is_free ? 'bg-brand/10 text-brand'
            : hasPremium ? 'bg-brand/10 text-brand'
            : 'bg-paper-soft text-ink-muted'
          }`}>
            {hasPremium && !pkg.is_free
              ? <CheckCircle2 className="w-4 h-4" />
              : String(index + 1).padStart(2, '0')}
          </div>

          {/* Konten */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1.5">
              <h3 className="font-bold text-ink text-sm leading-snug flex-1">{pkg.name}</h3>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                pkg.is_free ? 'bg-brand/10 text-brand'
                : hasPremium ? 'bg-brand/10 text-brand'
                : 'bg-amber-100 text-amber-700'
              }`}>
                {pkg.is_free ? 'GRATIS' : hasPremium ? '✓ DIMILIKI' : '✦ PREMIUM'}
              </span>
            </div>

            {/* Sub-tes + durasi */}
            <div className="flex gap-1.5 flex-wrap items-center">
              {getBadges(pkg.slug).map((s) => (
                <span key={s.label} title={s.title}
                  className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${s.cls}`}>
                  {s.label}
                </span>
              ))}
              <span className="text-xs px-2 py-0.5 rounded-md bg-paper text-ink-muted border border-hairline flex items-center gap-1">
                <Clock className="w-3 h-3" /> {pkg.duration_minutes} mnt
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={handleStart}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                canAccess
                  ? 'bg-brand text-white hover:bg-brand-700 shadow-sm'
                  : !isLoggedIn
                  ? 'bg-brand text-white hover:bg-brand-700 shadow-sm'
                  : 'bg-ink text-white hover:bg-ink-soft shadow-sm'
              }`}
            >
              {!isLoggedIn ? 'Mulai'
                : !canAccess ? <><Lock className="w-3.5 h-3.5" /> Beli</>
                : 'Mulai →'}
            </button>
            <span className="text-xs text-ink-muted">
              <FileText className="w-3 h-3 inline mr-0.5" />
              {pkg.total_questions} soal
            </span>
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {showBuyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-brand to-emerald-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-ink text-base">Akses Paket Ini</h3>
                  <p className="text-xs text-ink-muted mt-0.5">{pkg.name}</p>
                </div>
                <button onClick={() => setShowBuyModal(false)} className="text-ink-muted hover:text-ink text-lg">×</button>
              </div>

              <div className="bg-paper rounded-xl p-4 mb-3 border border-hairline text-sm text-ink-muted">
                <p className="font-semibold text-ink mb-1">Tips lebih hemat</p>
                Upgrade ke <strong>Premium</strong> untuk akses ke semua paket BUMN, ASTRA, OJK, dan lainnya.
              </div>

              <BuyButton
                planType="package"
                planLabel={`Beli Paket — ${getSatuanPrice(pkg.slug).toLocaleString('id-ID')}`}
                amount={getSatuanPrice(pkg.slug)}
                packageId={pkg.id}
                onSuccess={() => { setShowBuyModal(false); router.refresh() }}
                className="bg-brand text-white hover:bg-brand-700"
              />

              <p className="text-[10px] text-center text-ink-muted mt-3">
                Pembayaran aman via Midtrans · Aktif instan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
