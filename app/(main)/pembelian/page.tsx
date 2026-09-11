export const dynamic = 'force-dynamic'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ReceiptText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Package,
  ArrowRight,
  Calendar,
  ShieldCheck,
  Zap,
  ShoppingBag,
  CreditCard,
  Check,
  Layers,
} from 'lucide-react'
import { formatDate, formatRupiah } from '@/lib/utils'
import { DEFAULT_PLANS } from '@/lib/plans'
import { BIDANG_BY_SLUG } from '@/lib/bidang-config'

interface SubscriptionItem {
  id: string
  user_id: string
  midtrans_order_id: string
  plan_type: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'expired'
  paid_at: string | null
  expires_at: string | null
  created_at: string
  package_id: string | null
  bidang: string | null
}

interface UnlockedPackageItem {
  id: string
  package_id: string
  midtrans_order_id: string | null
  amount: number | null
  purchased_at: string
}

interface PackageItem {
  id: string
  name: string
  slug: string
  category: string
  duration_minutes: number
  total_questions: number
}

function getSubscriptionDisplayName(planType: string, bidang?: string | null): string {
  if (planType === 'package') return 'Paket Satuan'
  const defaultLabel = DEFAULT_PLANS[planType]?.label ?? planType
  if (bidang && BIDANG_BY_SLUG[bidang]) {
    return `${defaultLabel} (${BIDANG_BY_SLUG[bidang].name})`
  }
  return defaultLabel
}

function getCategoryBadge(category: string) {
  switch (category?.toUpperCase()) {
    case 'PLN':
      return { label: 'PLN', bg: 'bg-sky-50 text-sky-700 border-sky-200' }
    case 'ASTRA':
      return { label: 'ASTRA', bg: 'bg-blue-50 text-blue-700 border-blue-200' }
    case 'BUMN':
      return { label: 'BUMN', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
    case 'ANTAM':
      return { label: 'ANTAM', bg: 'bg-teal-50 text-teal-700 border-teal-200' }
    case 'BI':
      return { label: 'Bank Indonesia', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'OJK':
      return { label: 'OJK', bg: 'bg-rose-50 text-rose-700 border-rose-200' }
    default:
      return { label: category || 'Umum', bg: 'bg-slate-100 text-slate-700 border-slate-200' }
  }
}

export default async function PembelianPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/pembelian')
  }

  const service = createServiceClient()

  // Ambil data subscriptions user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subsDataRaw } = await (service.from('subscriptions') as any)
    .select('id, user_id, midtrans_order_id, plan_type, amount, status, paid_at, expires_at, created_at, package_id, bidang')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const subscriptions: SubscriptionItem[] = (subsDataRaw ?? []) as SubscriptionItem[]

  // Ambil data paket satuan user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: unlockedDataRaw } = await (service.from('unlocked_packages') as any)
    .select('id, package_id, midtrans_order_id, amount, purchased_at')
    .eq('user_id', user.id)
    .order('purchased_at', { ascending: false })

  const unlockedPackages: UnlockedPackageItem[] = (unlockedDataRaw ?? []) as UnlockedPackageItem[]

  // Ambil detail paket dari packages
  const packageIdsToFetch = Array.from(
    new Set([
      ...unlockedPackages.map((u) => u.package_id),
      ...subscriptions.map((s) => s.package_id).filter((id): id is string => Boolean(id)),
    ])
  )

  let packageMap = new Map<string, PackageItem>()
  if (packageIdsToFetch.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: packagesDataRaw } = await (service.from('packages') as any)
      .select('id, name, slug, category, duration_minutes, total_questions')
      .in('id', packageIdsToFetch)

    const pkgs = (packagesDataRaw ?? []) as PackageItem[]
    packageMap = new Map(pkgs.map((p) => [p.id, p]))
  }

  const now = new Date()

  // Cek langganan aktif: status paid, bukan satuan (plan_type !== 'package'), dan expires_at > now
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === 'paid' && s.plan_type !== 'package' && s.expires_at && new Date(s.expires_at) > now
  )

  const primaryActiveSub = activeSubscriptions[0] || null

  let remainingDays = 0
  if (primaryActiveSub?.expires_at) {
    const expDate = new Date(primaryActiveSub.expires_at).getTime()
    remainingDays = Math.max(0, Math.ceil((expDate - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  const paidTransactionsCount = subscriptions.filter((s) => s.status === 'paid').length

  return (
    <div className="max-w-[1100px] w-full mx-auto space-y-8 pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ReceiptText className="w-7 h-7 text-[#0F2C44]" />
            Paket & Pembelian Saya
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau status langganan aktif, akses paket satuan milik Anda, dan riwayat transaksi pembayaran.
          </p>
        </div>
        <Link
          href="/harga"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F2C44] hover:bg-[#164266] text-white text-sm font-semibold rounded-xl transition-all shadow-sm shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          Lihat Pilihan Paket
        </Link>
      </div>

      {/* 3 Kartu Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Status Langganan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Langganan</p>
              <div className="flex items-center gap-2 mt-2">
                {primaryActiveSub ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Aktif
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {remainingDays} hari tersisa
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    Tidak Ada Paket Aktif
                  </span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            {primaryActiveSub
              ? getSubscriptionDisplayName(primaryActiveSub.plan_type, primaryActiveSub.bidang)
              : 'Berlangganan untuk akses semua fitur'}
          </p>
        </div>

        {/* Stat 2: Paket Satuan Dimiliki */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paket Satuan Dimiliki</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {unlockedPackages.length} <span className="text-sm font-normal text-slate-500">Paket</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Akses selamanya tanpa batas waktu kedaluwarsa
          </p>
        </div>

        {/* Stat 3: Total Transaksi Selesai */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaksi Berhasil</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {paidTransactionsCount} <span className="text-sm font-normal text-slate-500">Pesanan</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Pembayaran terverifikasi otomatis via Midtrans
          </p>
        </div>
      </div>

      {/* Bagian 1: Informasi Langganan Aktif */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Langganan Aktif
          </h2>
        </div>

        {primaryActiveSub ? (
          <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border border-slate-200/90 p-6 shadow-xs relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-bold text-slate-900">
                    {getSubscriptionDisplayName(primaryActiveSub.plan_type, primaryActiveSub.bidang)}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Mulai: <strong className="text-slate-800">{formatDate(primaryActiveSub.paid_at || primaryActiveSub.created_at)}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Berakhir: <strong className="text-slate-800">{primaryActiveSub.expires_at ? formatDate(primaryActiveSub.expires_at) : '-'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sisa Waktu: <strong className="text-emerald-700">{remainingDays} Hari</strong></span>
                  </div>
                </div>

                {primaryActiveSub.bidang && BIDANG_BY_SLUG[primaryActiveSub.bidang] && (
                  <p className="text-xs text-slate-500 bg-sky-50 text-sky-800 border border-sky-200/70 inline-block px-3 py-1 rounded-lg">
                    Bidang Terdaftar: <strong>{BIDANG_BY_SLUG[primaryActiveSub.bidang].name}</strong>
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/paket"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F2C44] hover:bg-[#164266] text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  Buka Bank Soal
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/harga"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 transition-all"
                >
                  Perpanjang / Upgrade
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-slate-800">Tidak Ada Paket Langganan Aktif</h3>
              <p className="text-sm text-slate-500">
                Dapatkan akses penuh ke seluruh paket simulasi, pembahasan detail, perankingan, dan distribusi nilai sekarang.
              </p>
            </div>
            <Link
              href="/harga"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F2C44] hover:bg-[#164266] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              Lihat Pilihan Langganan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Bagian 2: Paket Satuan yang Dimiliki */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Paket Satuan yang Dimiliki
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Paket yang dibeli secara perorangan dengan masa akses selamanya tanpa batas waktu.
            </p>
          </div>
        </div>

        {unlockedPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedPackages.map((item) => {
              const pkg = packageMap.get(item.package_id)
              const badge = getCategoryBadge(pkg?.category || 'Umum')

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" />
                        Akses Selamanya
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug">
                      {pkg?.name ?? 'Paket Soal Ujian'}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {pkg?.total_questions ?? 0} Soal
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {pkg?.duration_minutes ?? 0} Menit
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Dibeli pada: {formatDate(item.purchased_at)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      href={`/persiapan/${item.package_id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      Mulai Simulasi
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-800">Belum Ada Paket Satuan</h3>
              <p className="text-sm text-slate-500">
                Anda belum pernah membeli paket soal secara satuan. Jika Anda ingin fokus pada satu ujian tertentu, Anda bisa membeli paketnya secara terpisah.
              </p>
            </div>
            <Link
              href="/paket"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Jelajahi Paket Soal
            </Link>
          </div>
        )}
      </div>

      {/* Bagian 3: Riwayat Transaksi Lengkap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-indigo-600" />
            Riwayat Transaksi
          </h2>
          <span className="text-xs text-slate-500">
            Total {subscriptions.length} pesanan
          </span>
        </div>

        {subscriptions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 border-b border-slate-200/80">
                  <tr>
                    <th className="px-5 py-3.5">ID Pesanan</th>
                    <th className="px-5 py-3.5">Item / Layanan</th>
                    <th className="px-5 py-3.5">Tanggal</th>
                    <th className="px-5 py-3.5">Nominal</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {subscriptions.map((sub) => {
                    let itemName = getSubscriptionDisplayName(sub.plan_type, sub.bidang)
                    if (sub.plan_type === 'package' && sub.package_id) {
                      const pkg = packageMap.get(sub.package_id)
                      if (pkg) {
                        itemName = `Paket Satuan: ${pkg.name}`
                      }
                    }

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          {sub.midtrans_order_id}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {itemName}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(sub.created_at)}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900 whitespace-nowrap">
                          {formatRupiah(sub.amount)}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {sub.status === 'paid' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Lunas
                            </span>
                          )}
                          {sub.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              Menunggu
                            </span>
                          )}
                          {sub.status === 'expired' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              Kedaluwarsa
                            </span>
                          )}
                          {sub.status === 'failed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Gagal
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ReceiptText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Belum Ada Riwayat Transaksi</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Semua transaksi pembelian paket atau langganan yang Anda lakukan akan dicatat dan muncul di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

