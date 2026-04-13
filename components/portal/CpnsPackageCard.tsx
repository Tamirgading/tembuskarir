'use client'

import { useRouter } from 'next/navigation'
import type { PackageRow } from '@/lib/utils'

interface CpnsPackageCardProps {
  pkg: PackageRow
  isLoggedIn: boolean
  userPlan: 'free' | 'premium'
  index: number
}

export default function CpnsPackageCard({ pkg, isLoggedIn, userPlan, index }: CpnsPackageCardProps) {
  const router = useRouter()
  const canAccess = pkg.is_free || userPlan === 'premium'
  const isLocked = isLoggedIn && !canAccess

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
    <div className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
      isLocked
        ? 'border-gray-200 hover:border-amber-300 hover:shadow-md'
        : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5'
    }`}>
      {/* Accent bar kiri */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-colors ${
        pkg.is_free ? 'bg-green-400 group-hover:bg-green-500' : 'bg-amber-400 group-hover:bg-amber-500'
      }`} />

      <div className="pl-5 pr-5 py-4 flex items-center gap-4">
        {/* Nomor urut */}
        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
          pkg.is_free ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Konten utama */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">{pkg.name}</h3>
            <span className={`shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full ${
              pkg.is_free ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {pkg.is_free ? 'GRATIS' : '✦ PREMIUM'}
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
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              isLocked
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-amber-200 hover:shadow-md'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-blue-200 hover:shadow-md'
            }`}
          >
            {!isLoggedIn ? '🔑 Mulai' : isLocked ? '🔒 Upgrade' : 'Mulai →'}
          </button>
          <span className="text-xs text-gray-400">{pkg.total_questions} soal</span>
        </div>
      </div>
    </div>
  )
}
