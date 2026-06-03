'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, RotateCcw, Zap } from 'lucide-react'

interface PersiapanActionsProps {
  packageId: string
  pkgCategory: string
  pkgSlug: string
  ongoingAttemptId: string | null
  ongoingAnsweredCount: number
  ongoingStartedAt: string | null
}

/** Tentukan URL runner ujian berdasarkan kategori + slug paket */
function getUjianHref(packageId: string, pkgCategory: string, pkgSlug: string): string {
  if (pkgCategory === 'ASTRA') return `/ujian/astra/${packageId}`
  if (pkgCategory === 'PLN') {
    // AKDING & BI PLN pakai runner generik MCQ (bukan runner GAT)
    if (pkgSlug.startsWith('akding-') || pkgSlug.startsWith('bi-pln-')) {
      return `/ujian/${packageId}`
    }
    return `/ujian/pln/${packageId}`
  }
  return `/ujian/${packageId}`
}

export function PersiapanActions({
  packageId,
  pkgCategory,
  pkgSlug,
  ongoingAttemptId,
  ongoingAnsweredCount,
  ongoingStartedAt,
}: PersiapanActionsProps) {
  const ujianHref = getUjianHref(packageId, pkgCategory, pkgSlug)
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
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
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
          className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white font-bold text-base rounded-2xl hover:bg-brand-700 transition-all shadow-soft active:scale-[0.98]"
        >
          <Play className="w-4 h-4" /> Lanjutkan Ujian
        </button>

        {/* CTA: Mulai Baru */}
        <button
          onClick={handleAbandonAndStart}
          disabled={isAbandonLoading}
          className="w-full flex items-center justify-center gap-2 py-3 border border-hairline text-ink-soft font-semibold text-sm rounded-2xl hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAbandonLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
              Memproses...
            </span>
          ) : (
            <><RotateCcw className="w-4 h-4" /> Mulai Ujian Baru (sesi lama ditutup)</>
          )}
        </button>

        <p className="text-xs text-center text-ink-muted">
          Memulai ujian baru akan menutup sesi sebelumnya secara permanen
        </p>
      </div>
    )
  }

  // Tidak ada sesi aktif — tombol mulai biasa
  return (
    <button
      onClick={() => router.push(ujianHref)}
      className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white font-bold text-base rounded-2xl hover:bg-brand-700 transition-all shadow-soft active:scale-[0.98]"
    >
      <Play className="w-4 h-4" /> Mulai Simulasi
    </button>
  )
}
