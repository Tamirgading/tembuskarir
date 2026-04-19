'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PersiapanActionsProps {
  packageId: string
  pkgCategory: string
  ongoingAttemptId: string | null
  ongoingAnsweredCount: number
  ongoingStartedAt: string | null
}

export function PersiapanActions({
  packageId,
  pkgCategory,
  ongoingAttemptId,
  ongoingAnsweredCount,
  ongoingStartedAt,
}: PersiapanActionsProps) {
  const ujianHref =
    pkgCategory === 'ASTRA' ? `/ujian/astra/${packageId}` :
    pkgCategory === 'PLN'   ? `/ujian/pln/${packageId}` :
    `/ujian/${packageId}`
  const router = useRouter()
  const [isAbandonLoading, setIsAbandonLoading] = useState(false)
  const [error, setError] = useState('')

  // Format elapsed time dari started_at
  function getElapsed(startedAt: string | null) {
    if (!startedAt) return ''
    const diff = Date.now() - new Date(startedAt).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(mins / 60)
    if (hrs > 0) return `${hrs} jam ${mins % 60} menit lalu`
    if (mins > 0) return `${mins} menit lalu`
    return 'baru saja'
  }

  async function handleAbandonAndStart() {
    if (!ongoingAttemptId) {
      router.push(ujianHref)
      return
    }
    setIsAbandonLoading(true)
    setError('')
    try {
      const res = await fetch('/api/attempts/abandon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: ongoingAttemptId }),
      })
      if (!res.ok) {
        const json = await res.json() as { error?: string }
        throw new Error(json.error ?? 'Gagal menutup sesi lama')
      }
      router.push(ujianHref)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setIsAbandonLoading(false)
    }
  }

  if (ongoingAttemptId) {
    // Ada sesi aktif — tampilkan pilihan
    return (
      <div className="space-y-4">
        {/* Banner sesi aktif */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">⚡</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">Kamu punya sesi ujian yang belum selesai</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Dimulai {getElapsed(ongoingStartedAt)} · {ongoingAnsweredCount} soal sudah dijawab
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
        )}

        {/* CTA: Lanjutkan */}
        <button
          onClick={() => router.push(ujianHref)}
          className="w-full py-4 bg-blue-600 text-white font-bold text-base rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
        >
          ▶ Lanjutkan Ujian
        </button>

        {/* CTA: Mulai Baru */}
        <button
          onClick={handleAbandonAndStart}
          disabled={isAbandonLoading}
          className="w-full py-3 border-2 border-gray-300 text-gray-600 font-semibold text-sm rounded-2xl hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAbandonLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
              Memproses...
            </span>
          ) : (
            '↺ Mulai Ujian Baru (sesi lama ditutup)'
          )}
        </button>

        <p className="text-xs text-center text-gray-400">
          Memulai ujian baru akan menutup sesi sebelumnya secara permanen
        </p>
      </div>
    )
  }

  // Tidak ada sesi aktif — tombol mulai biasa
  return (
    <button
      onClick={() => router.push(ujianHref)}
      className="w-full py-4 bg-blue-600 text-white font-bold text-base rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
    >
      Mulai Simulasi →
    </button>
  )
}
