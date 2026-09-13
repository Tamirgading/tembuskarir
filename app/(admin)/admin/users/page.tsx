import { createServiceClient } from '@/lib/supabase/server'
import type { UserRow } from '@/lib/utils'
import { UserRowExpand } from '@/components/admin/UserRowExpand'
import { Users, Crown, UserX, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

const PAGE_SIZE = 25

type UserEntry = Pick<UserRow, 'id' | 'email' | 'full_name' | 'plan' | 'plan_expires_at' | 'created_at'>
interface UserStat { attempt_count: number; total_spending: number; paid_count: number }

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; status?: string; page?: string; sort?: string }>
}) {
  const { q, plan, status, page, sort: sortParam } = await searchParams
  const supabase = createServiceClient()

  const currentPage = Math.max(1, Number(page) || 1)
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const sort: 'newest' | 'attempts' | 'spending' =
    sortParam === 'attempts' || sortParam === 'spending' ? sortParam : 'newest'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyFilters = (qb: any) => {
    let query = qb
    if (plan === 'premium') query = query.eq('plan', 'premium')
    else if (plan === 'free') query = query.eq('plan', 'free')

    if (status === 'expiring') {
      const now = new Date()
      const later = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      query = query.eq('plan', 'premium')
        .gte('plan_expires_at', now.toISOString())
        .lte('plan_expires_at', later.toISOString())
    }

    if (q?.trim()) {
      const lower = q.trim().toLowerCase()
      query = query.or(`email.ilike.%${lower}%,full_name.ilike.%${lower}%`)
    }
    return query
  }

  // Ambil statistik agregat (view admin_user_stats). Tanpa ids = seluruh user.
  const fetchStats = async (ids?: string[]): Promise<Map<string, UserStat>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from('admin_user_stats') as any)
      .select('user_id, attempt_count, total_spending, paid_count')
    if (ids) {
      if (ids.length === 0) return new Map()
      query = query.in('user_id', ids)
    }
    const { data } = await query
    return new Map(
      ((data ?? []) as { user_id: string; attempt_count: number; total_spending: number | string; paid_count: number }[])
        .map((r) => [r.user_id, {
          attempt_count: Number(r.attempt_count) || 0,
          total_spending: Number(r.total_spending) || 0,
          paid_count: Number(r.paid_count) || 0,
        }])
    )
  }

  const baseSelect = 'id, email, full_name, plan, plan_expires_at, created_at'
  let users: UserEntry[] = []
  let totalMatching = 0
  let statsMap = new Map<string, UserStat>()

  if (sort === 'newest') {
    // Jalur cepat: pagination di database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = applyFilters((supabase.from('users') as any)
      .select(baseSelect, { count: 'exact' })
      .order('created_at', { ascending: false }))
    query = query.range(from, to)
    const { data, count } = await query
    users = (data ?? []) as UserEntry[]
    totalMatching = count ?? 0
    statsMap = await fetchStats(users.map((u) => u.id))
  } else {
    // Sorting berbasis agregat: ambil semua user yang cocok lalu urutkan di server
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await applyFilters((supabase.from('users') as any).select(baseSelect))
    const all = (data ?? []) as UserEntry[]
    statsMap = await fetchStats()
    const stat = (id: string) => statsMap.get(id)
    const sorted = [...all].sort((a, b) => {
      const primary = sort === 'attempts'
        ? (stat(b.id)?.attempt_count ?? 0) - (stat(a.id)?.attempt_count ?? 0)
        : (stat(b.id)?.total_spending ?? 0) - (stat(a.id)?.total_spending ?? 0)
      if (primary !== 0) return primary
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    totalMatching = sorted.length
    users = sorted.slice(from, to + 1)
  }

  const totalPages = Math.max(1, Math.ceil(totalMatching / PAGE_SIZE))

  // ── Statistik ringkasan ─────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: totalCount } = await (supabase.from('users') as any)
    .select('*', { count: 'exact', head: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: premiumCount } = await (supabase.from('users') as any)
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'premium')

  // Nama paket untuk detail ujian
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgData } = await (supabase.from('packages') as any)
    .select('id, name')
  const packageNameMap = Object.fromEntries(((pkgData ?? []) as { id: string; name: string }[]).map((p) => [p.id, p.name]))

  const stats = [
    { label: 'Total User', value: totalCount ?? 0, Icon: Users, cls: 'bg-blue-50 text-blue-700' },
    { label: 'Premium', value: premiumCount ?? 0, Icon: Crown, cls: 'bg-amber-50 text-amber-700' },
    { label: 'Free', value: (totalCount ?? 0) - (premiumCount ?? 0), Icon: UserX, cls: 'bg-gray-100 text-gray-600' },
  ]

  const buildHref = (next: { plan?: string; status?: string; sort?: string; page?: number }) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const nextPlan = next.plan !== undefined ? next.plan : plan ?? ''
    const nextStatus = next.status !== undefined ? next.status : status ?? ''
    const nextSort = next.sort !== undefined ? next.sort : sort
    const nextPage = next.page !== undefined ? next.page : 1
    if (nextPlan && nextStatus !== 'expiring') params.set('plan', nextPlan)
    if (nextStatus) params.set('status', nextStatus)
    if (nextSort && nextSort !== 'newest') params.set('sort', nextSort)
    if (nextPage > 1) params.set('page', String(nextPage))
    const qs = params.toString()
    return `/admin/users${qs ? `?${qs}` : ''}`
  }

  const renderFilters = (label: string, options: { label: string; value: string }[], active: string, onPick: (v: string) => { plan?: string; status?: string }) => (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400 mr-1">{label}</span>
      {options.map((o) => (
        <a
          key={o.value}
          href={buildHref(onPick(o.value))}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            active === o.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {o.label}
        </a>
      ))}
    </div>
  )

  const sortOptions: { label: string; value: 'newest' | 'attempts' | 'spending' }[] = [
    { label: 'Terbaru', value: 'newest' },
    { label: 'Paling banyak sesi', value: 'attempts' },
    { label: 'Paling banyak spending', value: 'spending' },
  ]

  const thSort = (label: string, value: 'newest' | 'attempts' | 'spending', align: 'left' | 'center' = 'center') => (
    <a
      href={buildHref({ sort: value })}
      className={`inline-flex items-center gap-1 hover:text-gray-900 transition-colors ${
        sort === value ? 'text-blue-600 font-semibold' : ''
      } ${align === 'center' ? 'justify-center' : ''}`}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </a>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">{totalMatching} user ditemukan</p>
      </div>

      {/* KPI mini */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, Icon, cls }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${cls}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <form className="flex gap-2">
          {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari nama atau email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Cari
          </button>
        </form>

        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {renderFilters(
            'Plan',
            [
              { label: 'Semua', value: '' },
              { label: 'Premium', value: 'premium' },
              { label: 'Free', value: 'free' },
            ],
            status === 'expiring' ? '' : plan ?? '',
            (v) => ({ plan: v, status: status === 'expiring' ? 'expiring' : undefined })
          )}
          {renderFilters(
            'Status',
            [
              { label: 'Semua', value: '' },
              { label: 'Akan expired (7 hari)', value: 'expiring' },
            ],
            status ?? '',
            (v) => ({ status: v })
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 mr-1">Urutkan:</span>
          {sortOptions.map((o) => (
            <a
              key={o.value}
              href={buildHref({ sort: o.value })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                sort === o.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {o.label}
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
              <th className="px-5 py-3 font-medium text-center hidden md:table-cell">
                {thSort('Sesi', 'attempts')}
              </th>
              <th className="px-5 py-3 font-medium text-center hidden lg:table-cell">
                {thSort('Spending', 'spending')}
              </th>
              <th className="px-5 py-3 font-medium text-center hidden md:table-cell">Premium s.d.</th>
              <th className="px-5 py-3 font-medium text-center hidden sm:table-cell">
                {thSort('Daftar', 'newest')}
              </th>
              <th className="px-5 py-3 font-medium text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  Tidak ada user ditemukan.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UserRowExpand
                  key={u.id}
                  user={u}
                  packageNameMap={packageNameMap}
                  attemptCount={statsMap.get(u.id)?.attempt_count ?? 0}
                  totalSpending={statsMap.get(u.id)?.total_spending ?? 0}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <a
              href={buildHref({ page: currentPage - 1 })}
              aria-disabled={currentPage <= 1}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                currentPage <= 1 ? 'pointer-events-none opacity-40 bg-gray-50 text-gray-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </a>
            <a
              href={buildHref({ page: currentPage + 1 })}
              aria-disabled={currentPage >= totalPages}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                currentPage >= totalPages ? 'pointer-events-none opacity-40 bg-gray-50 text-gray-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
