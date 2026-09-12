import { createServiceClient } from '@/lib/supabase/server'
import { getPlansConfig } from '@/lib/plans-server'
import { Ticket } from 'lucide-react'
import {
  VoucherManager,
  type AdminVoucher,
  type PackageOption,
  type PlanOption,
} from '@/components/admin/VoucherManager'

export const dynamic = 'force-dynamic'

export default async function AdminVouchersPage() {
  const service = createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (service.from('vouchers') as any)
    .select('*')
    .order('created_at', { ascending: false })

  const vouchers = (data ?? []) as AdminVoucher[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pkgData } = await (service.from('packages') as any)
    .select('id, name, category, slug')
    .order('name', { ascending: true })

  const packages = (pkgData ?? []) as PackageOption[]

  const plansConfig = await getPlansConfig()
  const plans: PlanOption[] = Object.values(plansConfig).map((p) => ({ id: p.id, label: p.label }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="w-6 h-6 text-blue-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kelola Voucher</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Buat voucher diskon (%) atau gratis hari, atur kuota, masa berlaku, dan cakupan paket/plan.
          </p>
        </div>
      </div>

      <VoucherManager vouchers={vouchers} packages={packages} plans={plans} />
    </div>
  )
}
