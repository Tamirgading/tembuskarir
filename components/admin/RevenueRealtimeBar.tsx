'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCw, Radio, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function RevenueRealtimeBar() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [currentTimeWib, setCurrentTimeWib] = useState<string>('')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Update clock WIB
  useEffect(() => {
    function updateClock() {
      const now = new Date()
      setCurrentTimeWib(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      )
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  // Set initial last updated time
  useEffect(() => {
    const now = new Date()
    setLastUpdated(
      now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' WIB'
    )
  }, [])

  const handleRefresh = useCallback(() => {
    startTransition(() => {
      router.refresh()
      const now = new Date()
      setLastUpdated(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      )
    })
  }, [router])

  // 1. Supabase Realtime listener untuk tabel subscriptions
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('admin-revenue-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions' },
        (payload) => {
          console.log('[Realtime] Subscription update detected:', payload.eventType)
          handleRefresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [handleRefresh])

  // 2. Fallback periodic polling (setiap 45 detik jika autoRefresh aktif)
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      handleRefresh()
    }, 45000)
    return () => clearInterval(interval)
  }, [autoRefresh, handleRefresh])

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl border border-slate-200/90 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            Live Sync (WIB)
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Waktu Sekarang: <strong className="text-slate-700 font-mono">{currentTimeWib || 'Memuat...'}</strong></span>
        </div>

        {lastUpdated && (
          <span className="text-[11px] text-slate-400 hidden md:inline">
            Diperbarui: {lastUpdated}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none mr-1">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
          />
          <span className="text-[11px] text-slate-500">Auto-refresh (45s)</span>
        </label>

        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition disabled:opacity-50"
          title="Segarkan data revenue sekarang"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
          <span>{isPending ? 'Memperbarui...' : 'Segarkan Data'}</span>
        </button>
      </div>
    </div>
  )
}
