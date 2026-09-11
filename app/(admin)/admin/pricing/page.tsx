import type { Metadata } from 'next'
import { getPlansConfig } from '@/lib/plans-server'
import PricingManager from '@/components/admin/PricingManager'

export const metadata: Metadata = {
  title: 'Kelola Paket & Harga · Admin TembusKarir',
  description: 'Atur konfigurasi harga dan opsi paket berbayar di platform',
}

export const dynamic = 'force-dynamic'

export default async function AdminPricingPage() {
  const plans = await getPlansConfig()

  return (
    <div className="space-y-6">
      <PricingManager initialPlans={plans} />
    </div>
  )
}
