import { createServiceClient } from '@/lib/supabase/server'
import type { UserRow } from '@/lib/utils'
import { UserRowExpand } from '@/components/admin/UserRowExpand'
import { Users, Crown, UserX, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 25

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string; status?: string; page?: string }>
}) {
  const { q, plan, status, page } = await searchParams
  const supabase = createServiceClient()

  const currentPage = Math.max(1, Number(page) || 1)
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // ── Query user (server-side filter + pagination) ───────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('users') as any)
    .select('id, email, full_name, plan, plan_expires_at, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

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

  const { data, count } = await query
  type UserEntry = Pick<UserRow, 'id' | 'email' | 'full_name' | 'plan' | 'plan_expires_at' | 'created_at'>
  const users = (data ?? []) as UserEntry[]

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

  // ── Statistik user ──────────────────────────────────────────────────────────
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

  const buildHref = (next: { plan?: string; status?: string }) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const nextPlan = next.plan !== undefined ? next.plan : plan ?? ''
    const nextStatus = next.status !== undefined ? next.status : status ?? ''
    if (nextPlan && nextStatus !== 'expiring') params.set('plan', nextPlan)
    if (nextStatus) params.set('status', nextStatus)
    return `/admin/users?${params.toString()}`
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

  const pageHref = (p: number) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (status !== 'expiring' && plan) params.set('plan', plan)
    if (status) params.set('status', status)
    params.set('page', String(p))
    return `/admin/users?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">{count ?? 0} user ditemukan</p>
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
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium text-center">Plan</th>
              <th className="px-5 py-3 font-medium text-center hidden md:table-cell">Premium s.d.</th>
              <th className="px-5 py-3 font-medium text-center hidden sm:table-cell">Daftar</th>
              <th className="px-5 py-3 font-medium text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  Tidak ada user ditemukan.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <UserRowExpand key={u.id} user={u} packageNameMap={packageNameMap} />
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
              href={pageHref(currentPage - 1)}
              aria-disabled={currentPage <= 1}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                currentPage <= 1 ? 'pointer-events-none opacity-40 bg-gray-50 text-gray-400' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </a>
            <a
              href={pageHref(currentPage + 1)}
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
