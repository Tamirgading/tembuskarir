import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Users, Ticket } from 'lucide-react'
import type { SubscriptionRow, UserRow } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const supabase = createServiceClient()

  // Stats: total users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: totalUsers } = await (supabase.from('users') as any)
    .select('*', { count: 'exact', head: true })

  // Stats: premium users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: premiumUsers } = await (supabase.from('users') as any)
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'premium')

  // Stats: total paid subscriptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: paidSubs } = await (supabase.from('subscriptions') as any)
    .select('amount, plan_type, paid_at')
    .eq('status', 'paid')
    .order('paid_at', { ascending: false })

  type PaidSub = Pick<SubscriptionRow, 'amount' | 'plan_type' | 'paid_at'>
  const subs = (paidSubs ?? []) as PaidSub[]
  const totalRevenue = subs.reduce((sum, s) => sum + s.amount, 0)

  // Stats: total attempts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: totalAttempts } = await (supabase.from('attempts') as any)
    .select('*', { count: 'exact', head: true })
    .eq('status', 'finished')

  // Recent 5 users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentUsersData } = await (supabase.from('users') as any)
    .select('id, email, full_name, plan, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  type RecentUser = Pick<UserRow, 'id' | 'email' | 'full_name' | 'plan' | 'created_at'>
  const recentUsers = (recentUsersData ?? []) as RecentUser[]

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/packages" className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">Kelola Paket Soal</h2>
          <p className="text-sm text-gray-500 mt-1">Tambah, edit, publish/unpublish paket</p>
        </Link>
        <Link href="/admin/users" className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">Users & Revenue</h2>
          <p className="text-sm text-gray-500 mt-1">Lihat daftar user dan riwayat transaksi</p>
        </Link>
        <Link href="/admin/vouchers" className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-colors group">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
            <Ticket className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">Kelola Voucher</h2>
          <p className="text-sm text-gray-500 mt-1">Buat dan pantau penggunaan kode voucher</p>
        </Link>
      </div>

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
                  <p className="font-medium text-gray-900 text-sm">{u.full_name ?? '—'}</p>
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
                  {s.paid_at ? new Date(s.paid_at).toLocaleDateString('id-ID') : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
