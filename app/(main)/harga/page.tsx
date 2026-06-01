import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Clock, Zap, Star, Infinity as InfinityIcon, Check, Sparkles, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BuyButton } from '@/components/ui/BuyButton'
import { getPremiumSubscriptionStatus } from '@/lib/access'

export const metadata: Metadata = {
  title: 'Langganan & Harga — TembusKarir',
  description: 'Akses semua paket simulasi seleksi kerja. Beli per-paket Rp 10.000 atau berlangganan Premium mulai Rp 39.000/bulan.',
}

const PLANS = [
  {
    id: 'premium_monthly' as const,
    price: 39000,
    priceLabel: 'Rp 39.000',
    period: '/ bulan',
    highlight: true,
    badge: 'Populer',
    description: 'Akses semua paket simulasi selama 30 hari',
    features: ['Akses semua paket soal', 'Pembahasan lengkap tiap soal', 'Riwayat & analisis skor per sub-tes', 'Leaderboard nasional'],
    icon: Zap,
  },
  {
    id: 'premium_quarterly' as const,
    price: 89000,
    priceLabel: 'Rp 89.000',
    period: '/ 3 bulan',
    highlight: false,
    badge: 'Hemat 24%',
    description: 'Akses semua paket simulasi selama 90 hari',
    features: ['Semua fitur paket Bulanan', 'Hemat vs beli 3× bulanan', 'Persiapan lebih tenang & terencana', 'Akses fitur baru selama periode'],
    icon: Star,
  },
]

const planTypeLabel: Record<string, string> = { premium_monthly: '1 Bulan', premium_quarterly: '3 Bulan' }

export default async function HargaPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const { payment } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let premiumSub = { active: false, expiresAt: null as string | null, planType: null as string | null }
  if (user) premiumSub = await getPremiumSubscriptionStatus(user.id)

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-extrabold text-ink">Paket Langganan Premium</h1>
        <p className="text-ink-muted text-sm mt-1.5">Pilih cara terbaik untuk persiapan seleksi kerjamu</p>
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

      {premiumSub.active && premiumSub.expiresAt && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm">Langganan Premium {planTypeLabel[premiumSub.planType ?? ''] ?? ''} Aktif</p>
            <p className="text-xs text-amber-600 mt-0.5">Berlaku hingga <strong>{fmt(premiumSub.expiresAt)}</strong></p>
            <p className="text-xs text-amber-700 mt-2">Perpanjang sekarang agar akses tidak terputus.</p>
          </div>
        </div>
      )}

      {/* Langganan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          const hl = plan.highlight
          return (
            <div key={plan.id} className={`relative rounded-2xl border p-6 space-y-4 ${hl ? 'border-transparent text-white shadow-soft' : 'bg-white border-hairline'}`}
              style={hl ? { background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' } : undefined}>
              {plan.badge && (
                <span className={`absolute -top-3 right-4 text-[11px] font-bold px-3 py-1 rounded-full ${hl ? 'bg-brand text-white' : 'bg-brand/10 text-brand-700'}`}>{plan.badge}</span>
              )}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hl ? 'bg-white/10' : 'bg-brand/10'}`}>
                  <Icon className={`w-5 h-5 ${hl ? 'text-brand-300' : 'text-brand'}`} />
                </div>
                <div>
                  <p className={`font-num text-2xl font-extrabold leading-none ${hl ? 'text-white' : 'text-ink'}`}>{plan.priceLabel}</p>
                  <p className={`text-xs mt-1 ${hl ? 'text-white/55' : 'text-ink-muted'}`}>{plan.period}</p>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${hl ? 'text-white/70' : 'text-ink-muted'}`}>{plan.description}</p>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${hl ? 'text-white/85' : 'text-ink-soft'}`}>
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${hl ? 'text-brand-300' : 'text-brand'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              {user ? (
                <BuyButton planType={plan.id} planLabel={plan.id === 'premium_monthly' ? 'Mulai 1 Bulan' : 'Mulai 3 Bulan'} amount={plan.price} highlight={hl} />
              ) : (
                <Link href="/register" className={`block w-full text-center py-2.5 text-sm font-bold rounded-xl transition-colors ${hl ? 'bg-brand text-white hover:bg-brand-700' : 'bg-brand text-white hover:bg-brand-700'}`}>
                  Daftar &amp; Mulai
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Per-paket */}
      <div className="bg-white rounded-2xl border border-hairline p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-paper-soft rounded-xl flex items-center justify-center shrink-0">
          <InfinityIcon className="w-5 h-5 text-ink-soft" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-ink text-sm">Beli Per Paket</h3>
            <span className="text-[11px] px-2 py-0.5 bg-paper-soft text-ink-muted rounded-full font-medium">Rp 10.000 · Akses Selamanya</span>
          </div>
          <p className="text-xs text-ink-muted mb-3 leading-relaxed">Beli akses ke satu paket soal — tidak ada masa kedaluwarsa. Cocok jika hanya butuh satu paket tertentu.</p>
          <Link href="/paket" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-700 transition-colors">
            Lihat semua paket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-paper-soft rounded-2xl p-6 space-y-3 border border-hairline">
        <p className="font-heading font-bold text-ink text-sm">Pertanyaan Umum</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ink-muted">
          {[
            { q: 'Metode pembayaran apa saja?', a: 'Transfer bank, QRIS, GoPay, OVO, Dana, kartu kredit/debit via Midtrans.' },
            { q: 'Kapan akses aktif?', a: 'Otomatis dalam hitungan detik setelah pembayaran dikonfirmasi.' },
            { q: 'Apakah ada refund?', a: 'Tidak ada refund setelah pembayaran berhasil diproses.' },
            { q: 'Cara perpanjang?', a: 'Beli ulang paket yang sama. Durasi otomatis ditambahkan.' },
          ].map((item) => (
            <div key={item.q}><p className="font-semibold text-ink-soft mb-0.5">{item.q}</p><p>{item.a}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
