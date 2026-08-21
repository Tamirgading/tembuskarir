import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUnlockedPackageIds } from '@/lib/access'
import { BIDANG_BY_SLUG, BI_FULL_SLUG, BI_DEMO_SLUG, akdingSlug } from '@/lib/bidang-config'
import type { PackageRow } from '@/lib/utils'
import {
  ArrowRight, Clock, FileText, Languages, BookOpen,
  CheckCircle2, Lock, Sparkles,
} from 'lucide-react'
import { getEffectiveFeatureFlags } from '@/lib/site-settings'

interface Props { params: Promise<{ slug: string }> }

// ── Horizontal package row ─────────────────────────────────────────────────────
function PackageRow({
  pkg,
  isLoggedIn,
  isUnlocked,
  icon,
  iconCls,
}: {
  pkg: PackageRow | null
  isLoggedIn: boolean
  isUnlocked: boolean
  icon: React.ReactNode
  iconCls: string
}) {
  if (!pkg) return (
    <div className="flex items-center gap-4 bg-paper-soft rounded-2xl border border-hairline px-5 py-4 text-sm text-ink-muted opacity-60">
      {icon} Paket belum tersedia, segera hadir
    </div>
  )

  const canAccess = pkg.is_free || isUnlocked
  const href = `/persiapan/${pkg.id}`
  const isFree = pkg.is_free

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-hairline px-5 py-4 hover:shadow-soft transition-shadow">
      {/* Ikon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
        {icon}
      </div>

      {/* Konten */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="font-heading font-bold text-ink text-sm">{pkg.name}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isFree ? 'bg-brand/10 text-brand-700' :
            isUnlocked ? 'bg-brand/10 text-brand-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {isFree ? 'GRATIS' : isUnlocked ? '✓ DIMILIKI' : '✦ PREMIUM'}
          </span>
        </div>
        {pkg.description && (
          <p className="text-xs text-ink-muted line-clamp-1 mb-1.5">{pkg.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /><span className="font-num">{pkg.total_questions}</span> soal</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /><span className="font-num">{pkg.duration_minutes}</span> menit</span>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 flex items-center gap-2">
        {canAccess ? (
          <Link href={href}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Mulai
          </Link>
        ) : isLoggedIn ? (
          <>
            <Link href={href}
              className="px-3 py-2.5 text-xs font-semibold text-ink-soft bg-paper-soft border border-hairline rounded-xl hover:bg-white transition-colors">
              Coba gratis
            </Link>
            <Link href="/harga"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-ink text-white text-sm font-bold rounded-xl hover:bg-ink-soft transition-colors">
              <Lock className="w-3.5 h-3.5" /> Beli <span className="font-num">10K</span>
            </Link>
          </>
        ) : (
          <Link href="/register"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
            Daftar Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  iconBg,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">{title}</p>
        {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
      </div>
      <div className="flex-1 h-px bg-hairline" />
    </div>
  )
}

export default async function PlnBidangPage({ params }: Props) {
  const { slug } = await params
  const bidang = BIDANG_BY_SLUG[slug]
  if (!bidang) notFound()

  let isLoggedIn = false
  let userEmail: string | null = null
  let unlockedIds: string[] = []
  let biDemo: PackageRow | null = null
  let biFull: PackageRow | null = null
  let akdingDemo: PackageRow | null = null
  let akdingFull: PackageRow | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    isLoggedIn = !!user
    userEmail = user?.email ?? null

    if (user) unlockedIds = await getUnlockedPackageIds(user.id)

    const slugs = [BI_DEMO_SLUG, BI_FULL_SLUG, akdingSlug(slug, 'demo'), akdingSlug(slug, 'full')]
    const { data: pkgs } = await supabase
      .from('packages')
      .select('*')
      .in('slug', slugs)
      .eq('is_published', true)

    const pkgMap = Object.fromEntries(((pkgs ?? []) as PackageRow[]).map((p) => [p.slug, p]))
    biDemo    = pkgMap[BI_DEMO_SLUG] ?? null
    biFull    = pkgMap[BI_FULL_SLUG] ?? null
    akdingDemo = pkgMap[akdingSlug(slug, 'demo')] ?? null
    akdingFull = pkgMap[akdingSlug(slug, 'full')] ?? null
  } catch { /* ignore */ }

  const flags = await getEffectiveFeatureFlags(userEmail)
  if (!flags.feature_portal_pln) redirect('/')

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header bidang */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-soft">
        <div className="px-6 py-6 text-white" style={{ background: 'linear-gradient(135deg,#0F2C44,#0a1f30)' }}>
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/portal/pln" className="hover:text-white transition-colors">Rekrutmen PLN</Link>
            <span>›</span>
            <Link href="/portal/pln/tahap2" className="hover:text-white transition-colors">Tahap 2</Link>
            <span>›</span>
            <span className="text-white/80">{bidang.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${bidang.color}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-semibold uppercase tracking-wider">Akademik · Bidang</p>
              <h1 className="text-xl font-heading font-extrabold text-white">{bidang.name}</h1>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3">
            Pilih paket yang ingin dikerjakan. Kamu bisa mulai dari mana saja.
          </p>
        </div>

        {/* Info strip */}
        <div className="bg-white px-6 py-3.5 flex flex-wrap gap-5 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-brand" />
            Bahasa Inggris: <span className="font-num font-semibold">50</span> soal · <span className="font-num font-semibold">50</span> mnt
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand" />
            Akademik {bidang.short}: <span className="font-num font-semibold">50</span> soal · <span className="font-num font-semibold">50</span> mnt
          </span>
        </div>
      </div>

      {/* ── Section: Bahasa Inggris ── */}
      <div className="space-y-3">
        <SectionHeader
          icon={<Languages className="w-4 h-4 text-brand" />}
          iconBg="bg-brand/10"
          title="Bahasa Inggris PLN"
          subtitle="Sama untuk semua bidang. Cukup beli sekali."
        />

        <PackageRow
          pkg={biDemo}
          isLoggedIn={isLoggedIn}
          isUnlocked={unlockedIds.includes(biDemo?.id ?? '')}
          icon={<Languages className="w-5 h-5 text-brand" />}
          iconCls="bg-brand/10"
        />
        <PackageRow
          pkg={biFull}
          isLoggedIn={isLoggedIn}
          isUnlocked={unlockedIds.includes(biFull?.id ?? '')}
          icon={<Languages className="w-5 h-5 text-white" />}
          iconCls="bg-ink"
        />
      </div>

      {/* Divider antar section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-hairline" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-paper px-4 text-xs text-ink-muted font-semibold">+</span>
        </div>
      </div>

      {/* ── Section: Akademik ── */}
      <div className="space-y-3">
        <SectionHeader
          icon={<BookOpen className={`w-4 h-4 ${bidang.color.split(' ')[1]}`} />}
          iconBg={bidang.color.split(' ')[0]}
          title={`Akademik: ${bidang.name}`}
          subtitle="Materi sesuai keilmuan bidang ini"
        />

        <PackageRow
          pkg={akdingDemo}
          isLoggedIn={isLoggedIn}
          isUnlocked={unlockedIds.includes(akdingDemo?.id ?? '')}
          icon={<BookOpen className={`w-5 h-5 ${bidang.color.split(' ')[1]}`} />}
          iconCls={bidang.color.split(' ')[0]}
        />
        <PackageRow
          pkg={akdingFull}
          isLoggedIn={isLoggedIn}
          isUnlocked={unlockedIds.includes(akdingFull?.id ?? '')}
          icon={<BookOpen className="w-5 h-5 text-white" />}
          iconCls="bg-ink"
        />
      </div>

      {/* CTA langganan */}
      <div className="rounded-2xl border border-hairline p-5 flex items-center justify-between gap-4 bg-white shadow-soft">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-brand" />
            <p className="font-semibold text-ink text-sm">Akses penuh tanpa beli satuan-satuan?</p>
          </div>
          <p className="text-xs text-ink-muted">Langganan PLN Tahap 2: BI + Akademik {bidang.short} mulai <span className="font-num font-semibold">Rp 30.000</span>/bulan</p>
        </div>
        <Link href={`/harga?plnBidang=${slug}`}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors">
          Lihat Harga <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
