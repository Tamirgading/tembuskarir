import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, Zap, Star, Infinity } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BuyButton } from '@/components/ui/BuyButton'
import { getCpnsSubscriptionStatus } from '@/lib/access'

export const metadata: Metadata = {
  title: 'Langganan & Harga — TembusKarir',
  description: 'Akses paket soal SKD CPNS. Beli per-paket Rp 10.000 atau berlangganan mulai Rp 39.000/bulan.',
}

const PLANS = [
  {
    id: 'cpns_monthly' as const,
    price: 39000,
    priceLabel: 'Rp 39.000',
    period: '/ bulan',
    highlight: true,
    badge: 'Populer',
    description: 'Akses semua paket SKD CPNS selama 30 hari',
    features: ['Akses semua paket soal SKD', 'Pembahasan lengkap tiap soal', 'Riwayat & analisis skor per kategori', 'Leaderboard nasional'],
    icon: Zap,
  },
  {
    id: 'cpns_quarterly' as const,
    price: 89000,
    priceLabel: 'Rp 89.000',
    period: '/ 3 bulan',
    highlight: false,
    badge: 'Hemat 24%',
    description: 'Akses semua paket SKD CPNS selama 90 hari',
    features: ['Semua fitur paket Bulanan', 'Hemat vs beli 3× bulanan', 'Persiapan lebih tenang & terencana', 'Akses fitur baru selama periode'],
    icon: Star,
  },
]

const planTypeLabel: Record<string, string> = { cpns_monthly: '1 Bulan', cpns_quarterly: '3 Bulan' }

export default async function HargaPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const { payment } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let cpnsSub = { active: false, expiresAt: null as string | null, planType: null as string | null }
  if (user) cpnsSub = await getCpnsSubscriptionStatus(user.id)

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Paket Langganan CPNS</h1>
        <p className="text-gray-500 text-sm mt-1.5">Pilih cara terbaik untuk persiapan SKD kamu</p>
      </div>

      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <div><p className="font-semibold text-green-800 text-sm">Pembayaran berhasil!</p><p className="text-xs text-green-600 mt-0.5">Akses kamu sudah aktif. Selamat berlatih!</p></div>
        </div>
      )}
      {payment === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <div><p className="font-semibold text-yellow-800 text-sm">Pembayaran sedang diproses</p><p className="text-xs text-yellow-600 mt-0.5">Akses aktif otomatis setelah dikonfirmasi.</p></div>
        </div>
      )}

      {cpnsSub.active && cpnsSub.expiresAt && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-xl mt-0.5">✦</span>
          <div>
            <p className="font-bold text-amber-800 text-sm">Langganan CPNS {planTypeLabel[cpnsSub.planType ?? ''] ?? ''} Aktif</p>
            <p className="text-xs text-amber-600 mt-0.5">Berlaku hingga <strong>{fmt(cpnsSub.expiresAt)}</strong></p>
            <p className="text-xs text-amber-700 mt-2">Perpanjang sekarang agar akses tidak terputus.</p>
          </div>
        </div>
      )}

      {/* Per-paket */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          <Infinity className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-900 text-sm">Beli Per Paket</h3>
            <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">Rp 10.000 · Akses Selamanya</span>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Beli akses ke satu paket soal — tidak ada expired. Cocok jika hanya butuh satu paket tertentu.</p>
          <Link href="/portal/cpns" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Pilih paket di Portal CPNS →
          </Link>
        </div>
      </div>

      {/* Langganan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <div key={plan.id} className={`relative rounded-2xl border p-5 space-y-4 ${plan.highlight ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200' : 'bg-white border-gray-200'}`}>
              {plan.badge && (
                <span className={`absolute -top-3 right-4 text-[11px] font-bold px-3 py-1 rounded-full ${plan.highlight ? 'bg-amber-400 text-amber-900' : 'bg-green-100 text-green-700'}`}>{plan.badge}</span>
              )}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-white/20' : 'bg-blue-50'}`}>
                  <Icon className={`w-4 h-4 ${plan.highlight ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className={`text-2xl font-extrabold leading-none ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.priceLabel}</p>
                  <p className={`text-xs mt-0.5 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</p>
                </div>
              </div>
              <p className={`text-xs leading-relaxed ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-xs ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <span className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-blue-300' : 'text-green-500'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {user ? (
                <BuyButton planType={plan.id} planLabel={plan.id === 'cpns_monthly' ? 'Mulai 1 Bulan' : 'Mulai 3 Bulan'} amount={plan.price} highlight={plan.highlight} />
              ) : (
                <Link href="/register" className={`block w-full text-center py-2.5 text-sm font-semibold rounded-xl transition-colors ${plan.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Daftar & Mulai
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
        <p className="font-semibold text-gray-800 text-sm">Pertanyaan Umum</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
          {[
            { q: 'Metode pembayaran apa saja?', a: 'Transfer bank, QRIS, GoPay, OVO, Dana, kartu kredit/debit via Midtrans.' },
            { q: 'Kapan akses aktif?', a: 'Otomatis dalam hitungan detik setelah pembayaran dikonfirmasi.' },
            { q: 'Apakah ada refund?', a: 'Tidak ada refund setelah pembayaran berhasil diproses.' },
            { q: 'Cara perpanjang?', a: 'Beli ulang paket yang sama. Durasi otomatis ditambahkan.' },
          ].map((item) => (
            <div key={item.q}><p className="font-medium text-gray-700 mb-0.5">{item.q}</p><p>{item.a}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
