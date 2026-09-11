import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Users, Ticket, BarChart3, Tag } from 'lucide-react'
import type { SubscriptionRow, UserRow } from '@/lib/utils'
import { getFeatureFlags } from '@/lib/site-settings'
import FeatureToggles from '@/components/admin/FeatureToggles'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  let totalUsers = 0
  let premiumUsers = 0
  let totalRevenue = 0
  let totalAttempts = 0
  let recentUsers: UserRow[] = []
  let subs: Pick<SubscriptionRow, 'amount' | 'plan_type' | 'paid_at'>[] = []
  let featureFlags = {
    feature_info_seleksi: true,
    feature_semua_paket: true,
    feature_portal_pln: true,
    feature_portal_bumn: true,
    feature_portal_antam: true,
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any
    const [uCountRes, pCountRes, paidSubsRes, attCountRes, rUsersRes, flagsRes] = await Promise.all([
      sb.from('users').select('*', { count: 'exact', head: true }),
      sb.from('users').select('*', { count: 'exact', head: true }).eq('plan', 'premium'),
      sb.from('subscriptions').select('amount, plan_type, paid_at').eq('status', 'paid').order('paid_at', { ascending: false }),
      sb.from('attempts').select('*', { count: 'exact', head: true }).eq('status', 'finished'),
      sb.from('users').select('id, email, full_name, plan, created_at').order('created_at', { ascending: false }).limit(5),
      getFeatureFlags(),
    ])

    totalUsers = uCountRes.count ?? 0
    premiumUsers = pCountRes.count ?? 0
    subs = (paidSubsRes.data ?? []) as typeof subs
    totalRevenue = subs.reduce((sum, s) => sum + (s.amount ?? 0), 0)
    totalAttempts = attCountRes.count ?? 0
    recentUsers = (rUsersRes.data ?? []) as UserRow[]
    featureFlags = flagsRes
  } catch (err) {
    console.error('[AdminDashboard] Error loading stats:', err)
  }

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview platform TembusKarir</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers ?? 0, color: 'blue' },
          { label: 'Premium Users', value: premiumUsers ?? 0, color: 'amber' },
          { label: 'Total Revenue', value: formatRupiah(totalRevenue), color: 'green' },
          { label: 'Ujian Selesai', value: totalAttempts ?? 0, color: 'purple' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Link href="/admin/packages" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">Kelola Paket Soal</h2>
          <p className="text-xs text-gray-500 mt-1">Tambah, edit, publish/unpublish paket</p>
        </Link>
        <Link href="/admin/pricing" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
            <Tag className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">Paket &amp; Harga</h2>
          <p className="text-xs text-gray-500 mt-1">Atur harga jual, promo, &amp; visibilitas</p>
        </Link>
        <Link href="/admin/vouchers" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
            <Ticket className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">Kelola Voucher</h2>
          <p className="text-xs text-gray-500 mt-1">Buat dan pantau kode voucher</p>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-purple-600 text-sm">Users</h2>
          <p className="text-xs text-gray-500 mt-1">Daftar user, filter, &amp; detail</p>
        </Link>
        <Link href="/admin/revenue" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-green-600 text-sm">Revenue &amp; Analytics</h2>
          <p className="text-xs text-gray-500 mt-1">Grafik &amp; riwayat transaksi</p>
        </Link>
      </div>

      {/* Feature toggles */}
      <FeatureToggles initial={featureFlags} />

      {/* Recent users */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">User Terbaru</h2>
          <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">Lihat semua →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentUsers.length === 0 ? (
            <p className="text-center py-8 text-gray-400">Belum ada user.</p>
          ) : (
            recentUsers.map((u) => (
              <div key={u.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{u.full_name ?? '-'}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.plan}
                  </span>
                  <span className="text-gray-400">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent transactions */}
      {subs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Transaksi Terbaru</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {subs.slice(0, 5).map((s, i) => (
              <div key={i} className="px-6 py-3 flex items-center justify-between text-sm">
                <span className="text-gray-700 capitalize">{s.plan_type}</span>
                <span className="font-semibold text-green-600">{formatRupiah(s.amount)}</span>
                <span className="text-gray-400 text-xs">
                  {s.paid_at ? new Date(s.paid_at).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
