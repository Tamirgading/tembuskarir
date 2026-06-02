import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUnlockedPackageIds } from '@/lib/access'
import { BIDANG_BY_SLUG, BI_FULL_SLUG, BI_DEMO_SLUG, akdingSlug } from '@/lib/bidang-config'
import type { PackageRow } from '@/lib/utils'
import { ArrowRight, Clock, FileText, Languages, BookOpen, CheckCircle2, Lock } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

function PackageCard({
  pkg,
  isLoggedIn,
  isUnlocked,
  icon,
  accentCls,
}: {
  pkg: PackageRow | null
  isLoggedIn: boolean
  isUnlocked: boolean
  icon: React.ReactNode
  accentCls: string
}) {
  if (!pkg) return (
    <div className="bg-white rounded-2xl border border-hairline p-5 opacity-60 text-center text-ink-muted text-sm">
      Paket belum tersedia. Segera hadir.
    </div>
  )

  const canAccess = pkg.is_free || isUnlocked
  const href = `/persiapan/${pkg.id}`

  return (
    <div className="bg-white rounded-2xl border border-hairline shadow-soft p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accentCls}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="font-heading font-bold text-ink text-sm">{pkg.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              pkg.is_free ? 'bg-brand/10 text-brand-700' :
              isUnlocked ? 'bg-brand/10 text-brand-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {pkg.is_free ? 'GRATIS' : isUnlocked ? '✓ DIMILIKI' : '✦ PREMIUM'}
            </span>
          </div>
          {pkg.description && (
            <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{pkg.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> <span className="font-num">{pkg.total_questions}</span> soal</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> <span className="font-num">{pkg.duration_minutes}</span> menit</span>
      </div>

      <div className="mt-auto">
        {canAccess ? (
          <Link href={href} className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Mulai Simulasi
          </Link>
        ) : isLoggedIn ? (
          <div className="flex gap-2">
            <Link href={href} className="flex-1 text-center py-2.5 bg-paper-soft border border-hairline text-ink-muted text-xs font-semibold rounded-xl hover:bg-white transition-colors">
              Coba 20 soal
            </Link>
            <Link href="/harga" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors">
              <Lock className="w-3.5 h-3.5" /> Beli Rp 10.000
            </Link>
          </div>
        ) : (
          <Link href="/register" className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
            Daftar Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default async function PlnBidangPage({ params }: Props) {
  const { slug } = await params
  const bidang = BIDANG_BY_SLUG[slug]
  if (!bidang) notFound()

  let isLoggedIn = false
  let unlockedIds: string[] = []
  let biDemoPackage: PackageRow | null = null
  let biFullPackage: PackageRow | null = null
  let akdingDemoPackage: PackageRow | null = null
  let akdingFullPackage: PackageRow | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user

    if (user) unlockedIds = await getUnlockedPackageIds(user.id)

    const slugs = [BI_DEMO_SLUG, BI_FULL_SLUG, akdingSlug(slug, 'demo'), akdingSlug(slug, 'full')]
    const { data: pkgs } = await supabase
      .from('packages')
      .select('*')
      .in('slug', slugs)
      .eq('is_published', true)

    const pkgMap = Object.fromEntries(((pkgs ?? []) as PackageRow[]).map((p) => [p.slug, p]))
    biDemoPackage    = pkgMap[BI_DEMO_SLUG] ?? null
    biFullPackage    = pkgMap[BI_FULL_SLUG] ?? null
    akdingDemoPackage = pkgMap[akdingSlug(slug, 'demo')] ?? null
    akdingFullPackage = pkgMap[akdingSlug(slug, 'full')] ?? null
  } catch { /* ignore */ }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-7 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/portal/pln" className="hover:text-white transition-colors">Portal PLN</Link>
            <span>›</span>
            <Link href="/portal/pln/tahap2" className="hover:text-white transition-colors">Tahap 2</Link>
            <span>›</span>
            <span className="text-white/80">{bidang.name}</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border shrink-0 ${bidang.color}`}>
              {bidang.short.split(' ')[0].substring(0, 3).toUpperCase()}
            </div>
            <div>
              <p className="text-white/55 text-xs uppercase tracking-wider">Akademik</p>
              <h1 className="text-xl font-heading font-extrabold text-white">{bidang.name}</h1>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            Pilih paket yang ingin dikerjakan. Kamu bisa mulai dari mana saja — Bahasa Inggris atau Akademik.
          </p>
        </div>

        {/* Info strip */}
        <div className="bg-white px-6 py-3.5 flex flex-wrap gap-6 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5"><Languages className="w-3.5 h-3.5 text-brand" /> Bahasa Inggris: 50 soal · 50 mnt</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-brand" /> Akademik {bidang.short}: 50 soal · 50 mnt</span>
        </div>
      </div>

      {/* Paket Bahasa Inggris */}
      <div>
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Languages className="w-3.5 h-3.5" /> Bahasa Inggris PLN
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <PackageCard pkg={biDemoPackage} isLoggedIn={isLoggedIn} isUnlocked={unlockedIds.includes(biDemoPackage?.id ?? '')} icon={<Languages className="w-5 h-5" />} accentCls="bg-brand/10 text-brand" />
          <PackageCard pkg={biFullPackage} isLoggedIn={isLoggedIn} isUnlocked={unlockedIds.includes(biFullPackage?.id ?? '')} icon={<Languages className="w-5 h-5" />} accentCls="bg-ink text-white" />
        </div>
        <p className="text-xs text-ink-muted mt-2">
          💡 Paket Bahasa Inggris ini sama untuk semua bidang — cukup beli sekali.
        </p>
      </div>

      {/* Paket Akademik */}
      <div>
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" /> Akademik — {bidang.name}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <PackageCard pkg={akdingDemoPackage} isLoggedIn={isLoggedIn} isUnlocked={unlockedIds.includes(akdingDemoPackage?.id ?? '')} icon={<BookOpen className="w-5 h-5" />} accentCls={`${bidang.color.split(' ').slice(0,2).join(' ')}`} />
          <PackageCard pkg={akdingFullPackage} isLoggedIn={isLoggedIn} isUnlocked={unlockedIds.includes(akdingFullPackage?.id ?? '')} icon={<BookOpen className="w-5 h-5" />} accentCls="bg-ink text-white" />
        </div>
      </div>

      {/* Link ke harga */}
      <div className="bg-paper-soft rounded-2xl border border-hairline p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-ink text-sm">Mau akses semua tanpa beli satu per satu?</p>
          <p className="text-xs text-ink-muted mt-0.5">Langganan PLN Tahap 2 — BI + Akademik {bidang.short} mulai Rp 30.000/bulan</p>
        </div>
        <Link href={`/harga?plnBidang=${slug}`} className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
          Lihat Harga <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
