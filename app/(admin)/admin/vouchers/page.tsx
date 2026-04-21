import { createServiceClient } from '@/lib/supabase/server'
import { Ticket } from 'lucide-react'
import { CreateVoucherForm } from '@/components/admin/CreateVoucherForm'

interface VoucherRow {
  id: string
  code: string
  discount_type: string
  duration_days: number
  max_uses: number
  used_count: number
  expires_at: string | null
  is_active: boolean
  note: string | null
  created_at: string
}

function formatDateID(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export default async function AdminVouchersPage() {
  const service = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (service.from('vouchers') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const vouchers = (data ?? []) as VoucherRow[]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Kelola Voucher</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Daftar voucher */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Semua Voucher ({vouchers.length})</p>
          </div>
          {vouchers.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">Belum ada voucher.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {vouchers.map((v) => {
                const isFull = v.max_uses > 0 && v.used_count >= v.max_uses
                const isExpired = v.expires_at ? new Date(v.expires_at) < new Date() : false
                const status = !v.is_active ? 'nonaktif' : isFull ? 'habis' : isExpired ? 'kadaluarsa' : 'aktif'
                const statusColor: Record<string, string> = {
                  aktif: 'bg-green-100 text-green-700',
                  nonaktif: 'bg-gray-100 text-gray-500',
                  habis: 'bg-red-100 text-red-600',
                  kadaluarsa: 'bg-amber-100 text-amber-700',
                }

                return (
                  <div key={v.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-gray-900 text-sm tracking-widest">{v.code}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[status]}`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                          <span>+{v.duration_days} hari premium</span>
                          <span>
                            Dipakai: {v.used_count}/{v.max_uses === 0 ? '∞' : v.max_uses}
                          </span>
                          {v.expires_at && (
                            <span>Exp: {formatDateID(v.expires_at)}</span>
                          )}
                          {v.note && (
                            <span className="text-gray-400 italic">{v.note}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDateID(v.created_at)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Form buat voucher */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
          <h2 className="font-semibold text-gray-900 mb-4">+ Buat Voucher Baru</h2>
          <CreateVoucherForm />
        </div>
      </div>
    </div>
  )
}
