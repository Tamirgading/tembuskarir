'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, FileCheck, Receipt, AlertCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface UserLite {
  id: string
  email: string
  full_name: string | null
  plan: string
  plan_expires_at: string | null
  created_at: string
}

interface DetailData {
  subscriptions: {
    id: string
    plan_type: string
    amount: number
    status: string
    paid_at: string | null
    created_at: string
    package_id: string | null
    bidang: string | null
  }[]
  attempts: {
    id: string
    package_id: string
    score: number | null
    status: string
    started_at: string
  }[]
}

const STATUS_BADGE: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-600',
  expired: 'bg-gray-100 text-gray-500',
}

export function UserRowExpand({
  user,
  packageNameMap,
}: {
  user: UserLite
  packageNameMap: Record<string, string>
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DetailData | null>(null)

  async function toggle() {
    if (open) { setOpen(false); return }
    setOpen(true)
    if (data) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/detail?id=${user.id}`)
      const json = await res.json() as DetailData & { error?: string }
      if (!res.ok) { setError(json.error ?? 'Gagal memuat detail.'); return }
      setData(json)
    } catch {
      setError('Gagal memuat detail.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={toggle}>
        <td className="px-5 py-3">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
              user.plan === 'premium' ? 'bg-amber-500' : 'bg-gray-400'
            }`}>
              {(user.full_name ?? user.email ?? '?').slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.full_name ?? '—'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-3 text-center">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
            {user.plan === 'premium' ? '✦ Premium' : 'Free'}
          </span>
        </td>
        <td className="px-5 py-3 text-center text-gray-500 text-xs hidden md:table-cell">
          {user.plan_expires_at ? new Date(user.plan_expires_at).toLocaleDateString('id-ID') : '—'}
        </td>
        <td className="px-5 py-3 text-center text-gray-400 text-xs hidden sm:table-cell">
          {new Date(user.created_at).toLocaleDateString('id-ID')}
        </td>
        <td className="px-5 py-3 text-center">
          {open ? <ChevronDown className="inline w-4 h-4 text-gray-400" /> : <ChevronRight className="inline w-4 h-4 text-gray-400" />}
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={5} className="px-6 py-4 bg-gray-50/70">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Memuat detail...
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {/* Transaksi */}
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" /> Riwayat Transaksi ({data?.subscriptions.length ?? 0})
                  </p>
                  {data?.subscriptions.length === 0 ? (
                    <p className="text-xs text-gray-400">Belum ada transaksi.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {data?.subscriptions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2 text-xs">
                          <span className="text-gray-600">{s.plan_type}</span>
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-green-600">{formatRupiah(s.amount)}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${STATUS_BADGE[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                              {s.status}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ujian */}
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" /> Riwayat Ujian ({data?.attempts.length ?? 0})
                  </p>
                  {data?.attempts.length === 0 ? (
                    <p className="text-xs text-gray-400">Belum ada ujian.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {data?.attempts.map((a) => (
                        <div key={a.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3 py-2 text-xs">
                          <span className="text-gray-600 truncate pr-2">{packageNameMap[a.package_id] ?? 'Paket'}</span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="font-num font-semibold text-gray-900">{a.score ?? '—'}</span>
                            <span className={`text-[10px] font-medium ${a.status === 'finished' ? 'text-green-600' : 'text-amber-600'}`}>{a.status}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  )
}
