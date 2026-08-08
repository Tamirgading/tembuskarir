import { createServiceClient } from '@/lib/supabase/server'
import type { UserRow, SubscriptionRow } from '@/lib/utils'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string }>
}) {
  const { q, plan } = await searchParams
  const supabase = createServiceClient()

  // Query users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let usersQuery = (supabase.from('users') as any)
    .select('id, email, full_name, plan, plan_expires_at, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (plan === 'premium') {
    usersQuery = usersQuery.eq('plan', 'premium')
  } else if (plan === 'free') {
    usersQuery = usersQuery.eq('plan', 'free')
  }

  const { data: usersData } = await usersQuery
  type UserEntry = Pick<UserRow, 'id' | 'email' | 'full_name' | 'plan' | 'plan_expires_at' | 'created_at'>
  let users = (usersData ?? []) as UserEntry[]

  // Filter by search query di JS (nama/email)
  if (q?.trim()) {
    const lower = q.trim().toLowerCase()
    users = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(lower) ||
        u.full_name?.toLowerCase().includes(lower)
    )
  }

  // Ambil semua transaksi paid untuk summary revenue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subData } = await (supabase.from('subscriptions') as any)
    .select('amount, plan_type, paid_at, status')
    .eq('status', 'paid')
    .order('paid_at', { ascending: false })

  type SubEntry = Pick<SubscriptionRow, 'amount' | 'plan_type' | 'paid_at' | 'status'>
  const subs = (subData ?? []) as SubEntry[]

  const totalRevenue = subs.reduce((sum, s) => sum + s.amount, 0)
  const monthlyCount = subs.filter((s) => s.plan_type === 'monthly').length
  const yearlyCount = subs.filter((s) => s.plan_type === 'yearly').length

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users & Revenue</h1>
        <p className="text-gray-500 mt-1">{users.length} user ditampilkan</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-700 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{formatRupiah(totalRevenue)}</p>
          <p className="text-xs text-green-600 mt-1">{subs.length} transaksi berhasil</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Langganan Monthly</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{monthlyCount}</p>
          <p className="text-xs text-gray-400 mt-1">{formatRupiah(monthlyCount * 49000)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Langganan Yearly</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{yearlyCount}</p>
          <p className="text-xs text-gray-400 mt-1">{formatRupiah(yearlyCount * 399000)}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <form className="flex gap-2 flex-1">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama atau email..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Cari
          </button>
        </form>
        <div className="flex gap-2">
          {[
            { label: 'Semua', value: '' },
            { label: 'Premium', value: 'premium' },
            { label: 'Free', value: 'free' },
          ].map((f) => (
            <a
              key={f.value}
              href={`/admin/users?plan=${f.value}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                (plan ?? '') === f.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </a>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium text-center">Plan</th>
              <th className="px-5 py-3 font-medium text-center hidden md:table-cell">Expired</th>
              <th className="px-5 py-3 font-medium text-center hidden sm:table-cell">Daftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  Tidak ada user ditemukan.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{u.full_name ?? '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.plan === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.plan === 'premium' ? '✦ Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center text-gray-500 text-xs hidden md:table-cell">
                    {u.plan_expires_at
                      ? new Date(u.plan_expires_at).toLocaleDateString('id-ID')
                      : '—'}
                  </td>
                  <td className="px-5 py-3 text-center text-gray-400 text-xs hidden sm:table-cell">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recent transactions */}
      {subs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Transaksi Terbaru</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Paket</th>
                <th className="px-5 py-3 font-medium text-right">Nominal</th>
                <th className="px-5 py-3 font-medium text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subs.slice(0, 20).map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 capitalize text-gray-700">{s.plan_type}</td>
                  <td className="px-5 py-3 text-right font-semibold text-green-600">{formatRupiah(s.amount)}</td>
                  <td className="px-5 py-3 text-right text-gray-400 text-xs">
                    {s.paid_at ? new Date(s.paid_at).toLocaleDateString('id-ID') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
