import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Harga & Paket Langganan',
  description: 'Upgrade ke Premium mulai Rp 49.000/bulan. Akses semua paket soal CPNS SKD tanpa batas. Bayar via transfer bank, QRIS, GoPay, dan lainnya.',
}
import type { UserRow } from '@/lib/utils'
import { BuyButton } from '@/components/ui/BuyButton'

const PLANS = [
  {
    id: 'monthly' as const,
    label: 'Monthly',
    price: 49000,
    priceLabel: 'Rp 49.000',
    period: '/ bulan',
    durationDays: 30,
    highlight: false,
    badge: null,
    features: [
      'Akses semua paket soal premium',
      'Pembahasan lengkap setiap soal',
      'Histori & analisis skor',
      'Leaderboard nasional',
    ],
  },
  {
    id: 'yearly' as const,
    label: 'Yearly',
    price: 399000,
    priceLabel: 'Rp 399.000',
    period: '/ tahun',
    durationDays: 365,
    highlight: true,
    badge: 'Hemat 32%',
    features: [
      'Semua fitur Monthly',
      'Harga lebih hemat (Rp 33.250/bln)',
      'Prioritas akses fitur baru',
      'Badge "Top Learner" eksklusif',
    ],
  },
]

const freeFeatures = [
  'Akses paket soal gratis',
  'Lihat skor setelah ujian',
  'Leaderboard terbatas',
]

export default async function HargaPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>
}) {
  const { payment } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let plan: string = 'free'
  let planExpiresAt: string | null = null

  if (user) {
    const { data } = await supabase
      .from('users')
      .select('plan, plan_expires_at')
      .eq('id', user.id)
      .single()

    const profile = data as Pick<UserRow, 'plan' | 'plan_expires_at'> | null
    plan = profile?.plan ?? 'free'
    planExpiresAt = profile?.plan_expires_at ?? null
  }

  const isPremium = plan === 'premium'

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Pilih Paket Langganan</h1>
        <p className="text-gray-500">
          Akses semua paket soal CPNS/SKD tanpa batas. Bisa dibatalkan kapan saja.
        </p>
      </div>

      {/* Payment status banner */}
      {payment === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3 text-green-700">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-semibold">Pembayaran berhasil!</p>
            <p className="text-sm text-green-600">Akun kamu sudah diupgrade ke Premium. Selamat belajar!</p>
          </div>
        </div>
      )}
      {payment === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3 text-red-700">
          <span className="text-xl">❌</span>
          <div>
            <p className="font-semibold">Pembayaran gagal</p>
            <p className="text-sm text-red-600">Coba lagi atau pilih metode pembayaran lain.</p>
          </div>
        </div>
      )}

      {/* Status premium aktif */}
      {isPremium && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✦</span>
            <div>
              <p className="font-semibold text-amber-800">Kamu sudah Premium!</p>
              {planExpiresAt && (
                <p className="text-sm text-amber-700">
                  Aktif hingga:{' '}
                  {new Date(planExpiresAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-amber-700 mt-2">
            Perpanjang sekarang agar langganan tidak putus.
          </p>
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Free plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Gratis</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">Rp 0</p>
            <p className="text-sm text-gray-400">selamanya</p>
          </div>
          <ul className="space-y-2.5">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
          {user ? (
            <Link
              href="/paket"
              className="block w-full text-center py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Paket Gratis
            </Link>
          ) : (
            <Link
              href="/register"
              className="block w-full text-center py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Daftar Gratis
            </Link>
          )}
        </div>

        {/* Premium plans */}
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 space-y-5 relative ${
              plan.highlight
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200'
                : 'bg-white border-gray-200'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                {plan.badge}
              </span>
            )}
            <div>
              <p className={`text-sm font-semibold uppercase tracking-wide ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>
                {plan.label}
              </p>
              <p className={`text-3xl font-bold mt-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                {plan.priceLabel}
              </p>
              <p className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                {plan.period}
              </p>
            </div>
            <ul className="space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                  <span className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {user ? (
              <BuyButton
                planType={plan.id}
                planLabel={plan.label}
                amount={plan.price}
                highlight={plan.highlight}
              />
            ) : (
              <Link
                href={`/register?next=/harga`}
                className={`block w-full text-center py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Daftar & Upgrade
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* FAQ singkat */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Pertanyaan tentang pembayaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {[
            { q: 'Metode pembayaran apa saja?', a: 'Transfer bank (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, Dana, dan kartu kredit/debit.' },
            { q: 'Apakah ada garansi uang kembali?', a: 'Tidak ada refund setelah pembayaran berhasil diproses.' },
            { q: 'Kapan akun premium aktif?', a: 'Otomatis aktif dalam hitungan detik setelah pembayaran dikonfirmasi.' },
            { q: 'Bagaimana cara perpanjang?', a: 'Kembali ke halaman ini dan beli paket baru. Durasi akan ditambahkan ke sisa masa aktif.' },
          ].map((item) => (
            <div key={item.q} className="space-y-1">
              <p className="font-medium text-gray-900">{item.q}</p>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 pb-4">
        {['🔒 Pembayaran aman via Midtrans', '✅ Aktif instan', '💳 Semua metode pembayaran', '🇮🇩 Dukung produk lokal'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}
