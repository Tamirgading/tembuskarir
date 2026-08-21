import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Languages, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PackageRow, AttemptRow } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import BumnPackageCard from '@/components/portal/BumnPackageCard'
import { getPremiumSubscriptionStatus } from '@/lib/access'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'

export default async function BumnTahap2Page() {
  let packages: PackageRow[] = []
  let isLoggedIn = false
  let hasPremium = false
  let userEmail: string | null = null
  let recentAttempts: Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user
    userEmail = user?.email ?? null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pkgData } = await (supabase.from('packages') as any)
      .select('*')
      .eq('category', 'BUMN')
      .ilike('slug', 'rbb-bumn-tahap-2%')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
    packages = (pkgData ?? []) as PackageRow[]

    if (user) {
      const premiumStatus = await getPremiumSubscriptionStatus(user.id)
      hasPremium = premiumStatus.active
      const ids = packages.map((p) => p.id)
      if (ids.length > 0) {
        const { data: attData } = await supabase
          .from('attempts')
          .select('id, score, started_at, package_id')
          .eq('user_id', user.id)
          .eq('status', 'finished')
          .in('package_id', ids)
          .order('started_at', { ascending: false })
          .limit(5)
        recentAttempts = (attData ?? []) as Pick<AttemptRow, 'id' | 'score' | 'started_at' | 'package_id'>[]
      }
    }
  } catch { /* Supabase not configured */ }

  const flags = await getEffectiveFeatureFlags(userEmail)
  if (!flags.feature_portal_bumn) redirect('/')

  const packageNameMap = Object.fromEntries(packages.map((p) => [p.id, p.name]))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-7 text-white" style={{ background: 'linear-gradient(135deg,#1e3a8a,#172554)' }}>
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/portal/bumn" className="hover:text-white transition-colors">Rekrutmen BUMN</Link>
            <span>›</span>
            <span className="text-white/80">Tahap 2</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Languages className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">BUMN Tahap 2</p>
              <h1 className="text-2xl font-heading font-extrabold">Tes Bahasa Inggris</h1>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            Simulasi Tes Online Tahap 2 RBB BUMN: Error Recognition, Reading Comprehension, dan Sentence Completion untuk yang lolos Tahap 1.
          </p>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-widest mb-3">Paket Simulasi Tahap 2</p>
        <div className="space-y-3">
          {packages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-hairline text-ink-muted text-sm">
              Paket sedang dipersiapkan. Cek kembali segera!
            </div>
          ) : (
            packages.map((pkg, i) => (
              <BumnPackageCard key={pkg.id} pkg={pkg} isLoggedIn={isLoggedIn} hasPremium={hasPremium} index={i} />
            ))
          )}
        </div>
      </div>

      {recentAttempts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-ink-muted uppercase tracking-widest mb-3">Riwayat Ujian</h2>
          <div className="bg-white rounded-2xl border border-hairline overflow-hidden shadow-soft">
            {recentAttempts.map((att, i) => (
              <Link key={att.id} href={`/hasil/${att.id}`}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-paper-soft transition-colors ${i < recentAttempts.length - 1 ? 'border-b border-hairline' : ''}`}>
                <div>
                  <p className="text-sm font-semibold text-ink">{packageNameMap[att.package_id] ?? 'Paket'}</p>
                  <p className="text-xs text-ink-muted">{formatDate(att.started_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-num font-bold text-blue-600 text-base">{att.score ?? '—'}</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
