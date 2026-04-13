'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { PackageRow } from '@/lib/utils'

interface CpnsPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  userPlan: 'free' | 'premium'
}

export default function CpnsPackageCard({ pkg, isLoggedIn, userPlan }: CpnsPackageCardProps) {
  const router = useRouter()
  const canAccess = pkg.is_free || userPlan === 'premium'
  const comingSoon = false // to be implemented

  function handleStart() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/portal/cpns`)
      return
    }
    if (!canAccess) {
      router.push('/harga')
      return
    }
    router.push(`/ujian/${pkg.id}`)
  }

  return (
    <div className={`bg-white rounded-xl border-2 p-5 flex flex-col gap-3 transition-all hover:shadow-md ${
      comingSoon ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-blue-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{pkg.name}</h3>
          {pkg.description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{pkg.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
          pkg.is_free ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {pkg.is_free ? 'GRATIS' : 'PREMIUM'}
        </span>
      </div>

      {/* Info soal per sub-tes */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'TWK', q: 30, color: 'bg-blue-50 text-blue-600 border-blue-200' },
          { label: 'TIU', q: 35, color: 'bg-purple-50 text-purple-600 border-purple-200' },
          { label: 'TKP', q: 45, color: 'bg-green-50 text-green-600 border-green-200' },
        ].map((s) => (
          <span key={s.label} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.color}`}>
            {s.label} {s.q}
          </span>
        ))}
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
          ⏱ {pkg.duration_minutes} mnt
        </span>
      </div>

      {/* CTA */}
      {comingSoon ? (
        <div className="mt-auto pt-1 text-center py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg">
          Segera Hadir
        </div>
      ) : (
        <div className="mt-auto pt-1 space-y-2">
          <button
            onClick={handleStart}
            className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              canAccess || !isLoggedIn
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {!isLoggedIn ? 'Masuk & Mulai' : canAccess ? 'Mulai Simulasi →' : 'Upgrade Premium'}
          </button>
          <Link
            href={`/paket/${pkg.id}/leaderboard`}
            className="block w-full text-center py-1.5 text-gray-400 text-xs hover:text-blue-600 transition-colors"
          >
            🏆 Lihat Leaderboard
          </Link>
        </div>
      )}
    </div>
  )
}
