import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CheckCircle2, Clock, Zap, Star, Infinity as InfinityIcon, Check, Sparkles, ArrowRight,
  BookOpen, Target,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BuyButton } from '@/components/ui/BuyButton'
import { PlnBuyButton } from '@/components/ui/PlnBuyButton'
import { getPremiumSubscriptionStatus, getPlnSubscriptionStatus } from '@/lib/access'
import { BIDANG_BY_SLUG } from '@/lib/bidang-config'

export const metadata: Metadata = {
  title: 'Langganan & Harga · TembusKarir',
  description: 'Akses semua paket simulasi seleksi kerja. Beli per-paket atau berlangganan mulai Rp 30.000/bulan.',
}

const PREMIUM_PLANS = [
  {
    id: 'premium_monthly' as const,
    price: 39000,
    priceLabel: 'Rp 39.000',
    period: '/ bulan',
    highlight: true,
    badge: 'Populer',
    description: 'Akses semua paket ASTRA, BI, OJK, dan kategori lainnya selama 30 hari',
    features: ['Psikotes ASTRA (7 sub-tes)', 'Paket OJK & BI', 'Pembahasan lengkap', 'Analisis skor per sub-tes'],
    icon: Zap,
  },
  {
    id: 'premium_quarterly' as const,
    price: 89000,
    priceLabel: 'Rp 89.000',
    period: '/ 3 bulan',
    highlight: false,
    badge: 'Hemat 24%',
    description: 'Akses semua paket non-PLN selama 90 hari',
    features: ['Semua fitur Bulanan', 'Hemat vs beli 3× bulanan', 'Akses fitur baru selama periode'],
    icon: Star,
  },
]

const PLN_PLANS = [
  {
    id: 'pln_gat_monthly' as const,
    price: 30000,
    priceLabel: 'Rp 30.000',
    period: '/ bulan',
    badge: null,
    title: 'Tahap 1: GAT',
    description: 'Akses semua paket GAT PLN selama 30 hari. 8 sub-tes kognitif, AKHLAK & LA.',
    features: ['Semua paket GAT PLN', '8 sub-tes berurutan', 'AKHLAK & LA (sistem poin)', 'Riwayat & analisis skor'],
    requiresBidang: false,
    icon: Zap,
  },
  {
    id: 'pln_tahap2_monthly' as const,
    price: 30000,
    priceLabel: 'Rp 30.000',
    period: '/ bulan',
    badge: null,
    title: 'Tahap 2: Akademik',
    description: 'BI + AKDING 1 bidang pilihanmu selama 30 hari. Pilih bidang sebelum bayar.',
    features: ['Bahasa Inggris PLN (full)', 'AKDING 1 bidang (full)', 'Pilih bidang saat checkout', '1 bidang per subscription'],
    requiresBidang: true,
    icon: BookOpen,
  },
  {
    id: 'pln_complete_monthly' as const,
    price: 44000,
    priceLabel: 'Rp 44.000',
    period: '/ bulan',
    badge: 'Best Value',
    title: 'PLN Complete',
    description: 'GAT + BI + AKDING 1 bidang. Persiapan PLN paling lengkap dalam 1 plan.',
    features: ['Semua paket GAT PLN', 'Bahasa Inggris PLN (full)', 'AKDING 1 bidang (full)', 'Hemat vs beli terpisah'],
    requiresBidang: true,
    icon: Target,
  },
]

export default async function HargaPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; plnBidang?: string }>
}) {
  const { payment, plnBidang } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let premiumSub = { active: false, expiresAt: null as string | null, planType: null as string | null }
  let plnSub = { active: false, planType: null as string | null, bidang: null as string | null, expiresAt: null as string | null }
  if (user) {
    premiumSub = await getPremiumSubscriptionStatus(user.id)
    plnSub = await getPlnSubscriptionStatus(user.id)
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const premiumTypeLabel: Record<string, string> = { premium_monthly: '1 Bulan', premium_quarterly: '3 Bulan' }
  const plnTypeLabel: Record<string, string> = {
    pln_gat_monthly: 'GAT Bulanan',
    pln_tahap2_monthly: 'Tahap 2 Bulanan',
    pln_complete_monthly: 'Complete Bulanan',
  }

  // Bidang dari URL (ketika link dari halaman per-bidang)
  const urlBidang = plnBidang && BIDANG_BY_SLUG[plnBidang] ? plnBidang : undefined

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-extrabold text-ink">Langganan &amp; Harga</h1>
        <p className="text-ink-muted text-sm mt-1.5">Pilih paket sesuai persiapan seleksi kerjamu</p>
      </div>

      {/* Payment banners */}
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

      {/* Status Premium aktif */}
      {premiumSub.active && premiumSub.expiresAt && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800 text-sm">Premium {premiumTypeLabel[premiumSub.planType ?? ''] ?? ''} Aktif</p>
            <p className="text-xs text-amber-600 mt-0.5">Berlaku hingga <strong>{fmt(premiumSub.expiresAt)}</strong></p>
          </div>
        </div>
      )}

      {/* Status PLN aktif */}
      {plnSub.active && plnSub.expiresAt && (
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-brand-700 text-sm">
              PLN {plnTypeLabel[plnSub.planType ?? ''] ?? ''} Aktif
              {plnSub.bidang && BIDANG_BY_SLUG[plnSub.bidang] && (
                <span className="ml-1 font-normal">· Bidang: {BIDANG_BY_SLUG[plnSub.bidang].name}</span>
              )}
            </p>
            <p className="text-xs text-brand-700 mt-0.5">Berlaku hingga <strong>{fmt(plnSub.expiresAt)}</strong></p>
          </div>
        </div>
      )}

      {/* Info bidang dari URL */}
      {urlBidang && (
        <div className="bg-paper-soft border border-hairline rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
          <BookOpen className="w-4 h-4 text-brand shrink-0" />
          <span className="text-ink-soft">Bidang dipilih: <strong className="text-ink">{BIDANG_BY_SLUG[urlBidang].name}</strong>; akan otomatis terisi saat checkout Tahap 2 / Complete.</span>
        </div>
      )}

      {/* ── SECTION: PREMIUM (non-PLN) ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Langganan Premium</p>
          <div className="flex-1 h-px bg-hairline" />
          <p className="text-[11px] text-ink-muted">ASTRA · OJK · BI · Lainnya</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PREMIUM_PLANS.map((plan) => {
            const Icon = plan.icon
            const hl = plan.highlight
            return (
              <div key={plan.id}
                className={`relative rounded-2xl border p-6 space-y-4 ${hl ? 'border-transparent shadow-soft' : 'bg-white border-hairline'}`}
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
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${hl ? 'text-white/85' : 'text-ink-soft'}`}>
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${hl ? 'text-brand-300' : 'text-brand'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                {user
                  ? <BuyButton planType={plan.id} planLabel={plan.id === 'premium_monthly' ? 'Mulai 1 Bulan' : 'Mulai 3 Bulan'} amount={plan.price} highlight={hl} />
                  : <Link href="/register" className="block w-full text-center py-2.5 text-sm font-bold rounded-xl bg-brand text-white hover:bg-brand-700 transition-colors">Daftar &amp; Mulai</Link>
                }
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SECTION: PLN ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Khusus PLN</p>
          <div className="flex-1 h-px bg-hairline" />
          <p className="text-[11px] text-ink-muted">PT PLN (Persero) · GAT + Akademik</p>
        </div>

        {/* Info anti-sharing */}
        <div className="bg-paper-soft border border-hairline rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5 text-xs text-ink-muted">
          <Zap className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
          <span>Plan PLN Tahap 2 & Complete terikat 1 bidang akademik per subscription, sesuai format ujian asli (1 orang = 1 bidang).</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLN_PLANS.map((plan) => {
            const Icon = plan.icon
            const isComplete = plan.id === 'pln_complete_monthly'
            return (
              <div key={plan.id} className={`relative bg-white rounded-2xl border p-5 space-y-4 ${isComplete ? 'border-brand/30 shadow-soft ring-1 ring-brand/20' : 'border-hairline'}`}>
                {plan.badge && (
                  <span className="absolute -top-3 right-4 text-[11px] font-bold px-3 py-1 rounded-full bg-brand text-white">{plan.badge}</span>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <div>
                    <p className="font-num text-xl font-extrabold text-ink leading-none">{plan.priceLabel}</p>
                    <p className="text-[11px] text-ink-muted mt-0.5">{plan.period}</p>
                  </div>
                </div>
                <div>
                  <p className="font-heading font-bold text-ink text-sm mb-1">{plan.title}</p>
                  <p className="text-xs text-ink-muted leading-relaxed">{plan.description}</p>
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink-soft">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                {user ? (
                  <PlnBuyButton
                    planType={plan.id}
                    planLabel={plan.requiresBidang ? 'Pilih Bidang & Berlangganan' : 'Berlangganan'}
                    highlight={isComplete}
                    preselectedBidang={plan.requiresBidang ? urlBidang : undefined}
                  />
                ) : (
                  <Link href="/register" className="block w-full text-center py-2.5 text-sm font-bold rounded-xl bg-brand text-white hover:bg-brand-700 transition-colors">
                    Daftar &amp; Mulai
                  </Link>
                )}
              </div>
            )
          })}
        </div>
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
          <p className="text-xs text-ink-muted mb-3 leading-relaxed">Beli akses ke satu paket soal tanpa masa kedaluwarsa. Cocok jika hanya butuh satu paket tertentu.</p>
          <Link href="/paket" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-700 transition-colors">
            Lihat semua paket <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-paper-soft rounded-2xl p-5 space-y-3 border border-hairline">
        <p className="font-heading font-bold text-ink text-sm">Pertanyaan Umum</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ink-muted">
          {[
            { q: 'Metode pembayaran apa saja?', a: 'Transfer bank, QRIS, GoPay, OVO, Dana, kartu kredit/debit via Midtrans.' },
            { q: 'Apakah bidang PLN bisa diubah?', a: 'Tidak bisa diubah setelah bayar. Pastikan pilih bidang yang sesuai rekrutmen PLN kamu.' },
            { q: 'Kapan akses aktif?', a: 'Otomatis dalam hitungan detik setelah pembayaran dikonfirmasi.' },
            { q: 'Cara perpanjang?', a: 'Beli ulang plan yang sama. Durasi otomatis ditambahkan.' },
          ].map((item) => (
            <div key={item.q}><p className="font-semibold text-ink-soft mb-0.5">{item.q}</p><p>{item.a}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
