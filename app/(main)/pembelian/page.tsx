import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, ShoppingBag, CalendarDays } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Pembelian — TembusKarir',
  description: 'Riwayat pembelian dan langganan aktif kamu.',
}

interface SubRow {
  id: string
  plan_type: string
  amount: number
  status: string
  paid_at: string | null
  expires_at: string | null
  created_at: string
}

interface UnlockRow {
  id: string
  package_id: string
  created_at: string
}

const PLAN_LABEL: Record<string, string> = {
  cpns_monthly: 'Langganan CPNS — 1 Bulan',
  cpns_quarterly: 'Langganan CPNS — 3 Bulan',
  package: 'Paket Satuan',
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Aktif', cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Menunggu Bayar', cls: 'bg-yellow-100 text-yellow-700' },
  failed: { label: 'Gagal', cls: 'bg-red-100 text-red-600' },
  expired: { label: 'Kedaluwarsa', cls: 'bg-gray-100 text-gray-500' },
}

export default async function PembelianPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const serviceClient = createServiceClient()

  // Subscriptions (paid & pending & failed/expired for history)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subsData } = await (serviceClient.from('subscriptions') as any)
    .select('id, plan_type, amount, status, paid_at, expires_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const subs = (subsData ?? []) as SubRow[]

  // Unlocked packages (beli satuan)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: unlocksData } = await (serviceClient.from('unlocked_packages') as any)
    .select('id, package_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const unlocks = (unlocksData ?? []) as UnlockRow[]

  // Ambil nama paket untuk unlocked_packages
  const pkgIds = unlocks.map((u) => u.package_id)
  const { data: pkgsData } = pkgIds.length > 0
    ? await supabase.from('packages').select('id, name').in('id', pkgIds)
    : { data: [] }

  const pkgMap: Record<string, string> = {}
  for (const p of (pkgsData ?? [])) {
    const pkg = p as { id: string; name: string }
    pkgMap[pkg.id] = pkg.name
  }

  const fmt = (d: string | null) => d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

  const fmtAmount = (n: number) =>
    'Rp ' + n.toLocaleString('id-ID')

  // Langganan aktif (status paid + expires_at di masa depan)
  const now = new Date()
  const activeSubs = subs.filter(
    (s) => s.status === 'paid' && s.expires_at && new Date(s.expires_at) > now
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <BackButton fallbackHref="/dashboard" label="Kembali" />
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Pembelian</h1>
        <p className="text-gray-500 text-sm mt-1">Riwayat langganan dan paket yang kamu beli.</p>
      </div>

      {/* Langganan aktif */}
      {activeSubs.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Langganan Aktif</p>
          {activeSubs.map((sub) => (
            <div key={sub.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-amber-900 text-sm">{PLAN_LABEL[sub.plan_type] ?? sub.plan_type}</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Berlaku hingga <strong>{fmt(sub.expires_at)}</strong>
                </p>
                <p className="text-xs text-amber-500 mt-1">{fmtAmount(sub.amount)} · Dibeli {fmt(sub.paid_at)}</p>
              </div>
              <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">Aktif</span>
            </div>
          ))}
        </div>
      )}

      {/* Paket satuan yang dimiliki */}
      {unlocks.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paket Satuan Dimiliki</p>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50 overflow-hidden">
            {unlocks.map((unlock) => (
              <div key={unlock.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {pkgMap[unlock.package_id] ?? 'Paket'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Dibeli {fmt(unlock.created_at)} · Akses selamanya</p>
                </div>
                <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Dimiliki</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semua riwayat transaksi */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Semua Transaksi</p>
        {subs.length === 0 && unlocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 text-sm">Belum ada pembelian</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Mulai dengan memilih paket di portal seleksi.</p>
            <Link href="/portal/cpns" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors">
              Ke Portal CPNS →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50 overflow-hidden">
            {subs.map((sub) => {
              const cfg = STATUS_CONFIG[sub.status] ?? { label: sub.status, cls: 'bg-gray-100 text-gray-500' }
              return (
                <div key={sub.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {PLAN_LABEL[sub.plan_type] ?? sub.plan_type}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {fmtAmount(sub.amount)} · {fmt(sub.created_at)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer info */}
      <p className="text-xs text-center text-gray-400 pb-4">
        Ada pertanyaan soal pembayaran? Hubungi{' '}
        <a href="mailto:support@tembuskarir.id" className="underline hover:text-gray-600">support@tembuskarir.id</a>
      </p>
    </div>
  )
}
