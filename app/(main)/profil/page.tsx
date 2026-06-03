import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Crown, Zap, Shield, User, Mail, Lock, ChevronRight, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { UserRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { getPremiumSubscriptionStatus, getPlnSubscriptionStatus } from '@/lib/access'
import { BIDANG_BY_SLUG } from '@/lib/bidang-config'
import { EditNamaForm, UploadAvatarForm, GantiPasswordForm } from '@/components/ui/ProfilForm'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [profileRes, premiumStatus, plnStatus] = await Promise.all([
    supabase
      .from('users')
      .select('full_name, email, plan, plan_expires_at, avatar_url')
      .eq('id', user.id)
      .single(),
    getPremiumSubscriptionStatus(user.id),
    getPlnSubscriptionStatus(user.id),
  ])

  const profile = profileRes.data as Pick<
    UserRow, 'full_name' | 'email' | 'plan' | 'plan_expires_at' | 'avatar_url'
  > | null

  const name   = profile?.full_name ?? null
  const avatar = profile?.avatar_url ?? null

  const bidangInfo = plnStatus.bidang ? BIDANG_BY_SLUG[plnStatus.bidang] : null

  const planLabelMap: Record<string, string> = {
    pln_gat_monthly:      'PLN Tahap 1 — GAT',
    pln_tahap2_monthly:   'PLN Tahap 2' + (bidangInfo ? ` — ${bidangInfo.name}` : ''),
    pln_complete_monthly: 'PLN Complete' + (bidangInfo ? ` — ${bidangInfo.name}` : ''),
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <h1 className="text-xl font-heading font-bold text-ink">Profil Saya</h1>

      {/* ── Status Langganan ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-hairline shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Status Langganan</h2>
        </div>
        <div className="px-6 py-5 space-y-3">

          {/* Premium generik */}
          {premiumStatus.active ? (
            <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">Premium Aktif</p>
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                    <CalendarDays className="w-3 h-3" />
                    Hingga {premiumStatus.expiresAt ? formatDate(premiumStatus.expiresAt) : '—'}
                  </p>
                </div>
              </div>
              <Link
                href="/harga"
                className="shrink-0 text-xs font-semibold text-amber-700 border border-amber-300 rounded-xl px-3 py-1.5 hover:bg-amber-100 transition-colors"
              >
                Perpanjang
              </Link>
            </div>
          ) : null}

          {/* PLN subscription */}
          {plnStatus.active && plnStatus.planType ? (
            <div className="flex items-center justify-between gap-4 bg-brand/5 border border-brand/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-brand shrink-0" />
                <div>
                  <p className="font-semibold text-ink text-sm">
                    {planLabelMap[plnStatus.planType] ?? plnStatus.planType}
                  </p>
                  <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                    <CalendarDays className="w-3 h-3" />
                    Hingga {plnStatus.expiresAt ? formatDate(plnStatus.expiresAt) : '—'}
                  </p>
                </div>
              </div>
              <Link
                href="/harga"
                className="shrink-0 text-xs font-semibold text-brand border border-brand/30 rounded-xl px-3 py-1.5 hover:bg-brand/10 transition-colors"
              >
                Perpanjang
              </Link>
            </div>
          ) : null}

          {/* Tidak ada langganan aktif */}
          {!premiumStatus.active && !plnStatus.active && (
            <div className="flex items-center justify-between gap-4 bg-paper rounded-2xl border border-hairline px-4 py-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-ink-muted shrink-0" />
                <div>
                  <p className="font-semibold text-ink-soft text-sm">Akun Gratis</p>
                  <p className="text-xs text-ink-muted mt-0.5">Upgrade untuk akses semua paket soal</p>
                </div>
              </div>
              <Link
                href="/harga"
                className="shrink-0 text-xs font-bold text-white bg-brand rounded-xl px-3 py-1.5 hover:bg-brand-700 transition-colors"
              >
                Upgrade →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Informasi Akun ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-hairline shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline flex items-center gap-2">
          <User className="w-4 h-4 text-ink-muted" />
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Informasi Akun</h2>
        </div>
        <div className="px-6 py-5 space-y-5">

          {/* Avatar */}
          <UploadAvatarForm userId={user.id} initialAvatar={avatar} />

          <div className="border-t border-hairline" />

          {/* Edit nama */}
          <EditNamaForm userId={user.id} initialName={name} />

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 border border-hairline rounded-xl bg-paper text-sm text-ink-muted">
              {user.email ?? '—'}
            </div>
            <p className="text-xs text-ink-muted mt-1">Email tidak dapat diubah.</p>
          </div>
        </div>
      </div>

      {/* ── Keamanan ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-hairline shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline flex items-center gap-2">
          <Lock className="w-4 h-4 text-ink-muted" />
          <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Keamanan</h2>
        </div>
        <div className="px-6 py-5">
          <GantiPasswordForm />
        </div>
      </div>

      {/* ── Link cepat ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-hairline shadow-soft overflow-hidden divide-y divide-hairline">
        {[
          { href: '/dashboard', label: 'Kembali ke Dashboard' },
          { href: '/harga', label: 'Lihat Paket Harga' },
          { href: '/portal/pln', label: 'Portal PLN' },
          { href: '/portal/astra', label: 'Portal ASTRA' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between px-6 py-3.5 hover:bg-paper-soft transition-colors text-sm text-ink-soft hover:text-ink"
          >
            {item.label}
            <ChevronRight className="w-4 h-4 text-ink-muted" />
          </Link>
        ))}
      </div>

    </div>
  )
}
