'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, Briefcase, Zap, Package, ReceiptText, Newspaper, CreditCard,
  User, Settings, Ticket, LogOut, LogIn, UserPlus, ChevronDown, X, Crown,
  ChevronLeft, ChevronRight, BookOpen, Building2, History, Bookmark, BarChart3, PanelLeft, Mountain,
} from 'lucide-react'
import LoginModal from '@/components/ui/LoginModal'
import { NotificationBell } from '@/components/ui/NotificationBell'
import type { FeatureFlags } from '@/lib/site-settings'

interface AppShellProps {
  isLoggedIn: boolean
  userName: string | null
  userPlan: 'free' | 'premium'
  children: React.ReactNode
  featureFlags?: FeatureFlags
}

type FeatureKey = keyof import('@/lib/site-settings').FeatureFlags
type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; tag?: string; tagColor?: string; sub?: boolean; featureKey?: FeatureKey; iconBg?: string; iconColor?: string }
type Group = { section: string | null; items: Item[] }

const NAV: Group[] = [
  { section: null, items: [{ href: '/dashboard', label: 'Beranda', icon: Home, iconBg: 'bg-[#d4e3ff]', iconColor: 'text-[#00315f]' }] },
  {
    section: 'Simulasi Populer',
    items: [
      { href: '/portal/astra', label: 'Psikotes ASTRA', icon: Briefcase, tag: 'Populer', tagColor: 'bg-[#cce5ff] text-[#004b73]', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
      { href: '/portal/pln', label: 'Rekrutmen PLN', icon: Zap, featureKey: 'feature_portal_pln', iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
      { href: '/portal/pln/gat', label: 'Tahap 1: GAT', icon: Zap, sub: true, featureKey: 'feature_portal_pln' },
      { href: '/portal/pln/tahap2', label: 'Tahap 2: Akademik', icon: BookOpen, sub: true, featureKey: 'feature_portal_pln' },
      { href: '/portal/bumn', label: 'Rekrutmen BUMN', icon: Building2, featureKey: 'feature_portal_bumn', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      { href: '/portal/antam', label: 'ANTAM IMPACT', icon: Mountain, featureKey: 'feature_portal_antam', tag: 'Baru', tagColor: 'bg-[#b9eaff] text-[#001f29]', iconBg: 'bg-teal-100', iconColor: 'text-teal-700' },
      { href: '/paket', label: 'Semua Paket', icon: Package, featureKey: 'feature_semua_paket', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
    ],
  },
  {
    section: 'Akun & Analisis',
    items: [
      { href: '/rapor', label: 'Rapor Belajar', icon: BarChart3, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
      { href: '/riwayat', label: 'Riwayat Tes', icon: History, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
      { href: '/soal-tersimpan', label: 'Soal Tersimpan', icon: Bookmark, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
      { href: '/pembelian', label: 'Pembelian', icon: ReceiptText, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
      { href: '/info-seleksi', label: 'Info Seleksi', icon: Newspaper, featureKey: 'feature_info_seleksi', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
      { href: '/harga', label: 'Langganan & Paket', icon: CreditCard, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
    ],
  },
]

const ALL_TABS: Item[] = [
  { href: '/dashboard', label: 'Beranda', icon: Home },
  { href: '/paket', label: 'Latihan', icon: Package, featureKey: 'feature_semua_paket' },
  { href: '/info-seleksi', label: 'Info', icon: Newspaper, featureKey: 'feature_info_seleksi' },
  { href: '/harga', label: 'Langganan', icon: CreditCard },
  { href: '/profil', label: 'Profil', icon: User },
]

// ── Page title mapping (untuk topbar) ───────────────────────────────────────
type IconType = React.ComponentType<{ className?: string }>
type BackInfo = { label: string; href?: string; Icon?: IconType }
type PageMeta = { pattern: string | RegExp; label: string; Icon: IconType; back?: BackInfo }

const PAGE_META: PageMeta[] = [
  { pattern: '/dashboard',             label: 'Beranda',                     Icon: Home                                                                     },
  { pattern: '/',                      label: 'Beranda',                     Icon: Home                                                                     },
  { pattern: /^\/portal\/astra/,       label: 'Psikotes ASTRA',              Icon: Briefcase, back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/portal\/pln\/gat/,    label: 'PLN: GAT',                    Icon: Zap,       back: { label: 'Rekrutmen PLN', href: '/portal/pln', Icon: Zap       } },
  { pattern: /^\/portal\/pln\/tahap2/, label: 'PLN: Tahap 2',                Icon: BookOpen,  back: { label: 'Rekrutmen PLN', href: '/portal/pln', Icon: Zap       } },
  { pattern: /^\/portal\/pln/,         label: 'Rekrutmen PLN',               Icon: Zap,       back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/portal\/bumn/,        label: 'Rekrutmen BUMN',              Icon: Building2, back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/portal\/antam/,       label: 'ANTAM IMPACT',                Icon: Mountain,  back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/paket/,               label: 'Semua Paket',                 Icon: Package,   back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/rapor/,               label: 'Rapor Belajar',               Icon: BarChart3, back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/riwayat/,             label: 'Riwayat Tes',                 Icon: History,   back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/soal-tersimpan/,      label: 'Soal Tersimpan',              Icon: Bookmark,  back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/pembelian/,           label: 'Paket & Pembelian Saya',      Icon: ReceiptText,back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/harga/,               label: 'Langganan & Harga',           Icon: CreditCard,back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/info-seleksi/,        label: 'Info Seleksi',                Icon: Newspaper, back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/profil/,              label: 'Profil Saya',                 Icon: User,      back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/pengaturan/,          label: 'Pengaturan',                  Icon: Settings,  back: { label: 'Beranda',      href: '/dashboard',  Icon: Home      } },
  { pattern: /^\/persiapan/,           label: 'Persiapan Ujian',             Icon: Package,   back: { label: 'Kembali'                                            } },
  { pattern: /^\/hasil/,               label: 'Hasil Ujian',                 Icon: BarChart3, back: { label: 'Riwayat',     href: '/riwayat',    Icon: History   } },
]

function getPageMeta(pathname: string) {
  for (const { pattern, label, Icon, back } of PAGE_META) {
    const hit = typeof pattern === 'string' ? pathname === pattern : pattern.test(pathname)
    if (hit) return { label, Icon, back }
  }
  return { label: 'TembusKarir', Icon: Home, back: undefined }
}

export function AppShell({ isLoggedIn, userName, userPlan, children, featureFlags }: AppShellProps) {
  const pathname = usePathname() ?? ''
  const router   = useRouter()
  const [drawer,     setDrawer]     = useState(false)
  const [menu,       setMenu]       = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)
  const [showLogin,  setShowLogin]  = useState(false)

  const isFeatureEnabled = (key?: FeatureKey) => !key || featureFlags?.[key] !== false

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
  }, [])

  const toggleSidebar = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar-collapsed', String(next))
  }

  if (pathname.startsWith('/ujian/')) return <>{children}</>

  const initial  = userName ? userName.charAt(0).toUpperCase() : 'U'
  const pageMeta = getPageMeta(pathname)
  const PageIcon = pageMeta.Icon

  // Bangun breadcrumb trail: root → ... → current
  type Crumb = { label: string; href?: string; Icon: IconType; useBack?: boolean }
  const breadcrumbs: Crumb[] = (() => {
    const crumbs: Crumb[] = []
    const parentChain: (BackInfo & { useBack?: boolean })[] = []
    let curr = pageMeta
    while (curr.back) {
      if (curr.back.href) {
        parentChain.unshift({ ...curr.back })
        curr = getPageMeta(curr.back.href)
      } else {
        parentChain.unshift({ ...curr.back, useBack: true })
        break
      }
    }
    for (const p of parentChain) {
      crumbs.push({ label: p.label, href: p.href, Icon: p.Icon ?? Home, useBack: p.useBack })
    }
    crumbs.push({ label: pageMeta.label, Icon: PageIcon })
    return crumbs
  })()

  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/') return pathname === '/'
    if (base === '/dashboard') return pathname === '/dashboard'
    if (base === '/portal/pln') return pathname === '/portal/pln'
    return pathname === base || pathname.startsWith(base + '/')
  }

  async function signOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // ── Konten sidebar (desktop + mobile) ───────────────────────────────────────
  const SidebarBody = (isMobile = false) => (
    <>
      {/* Brand */}
      <div className={`pb-4 ${collapsed && !isMobile ? 'px-0' : 'px-1'}`}>
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center flex-1 min-w-0" onClick={() => isMobile && setDrawer(false)}>
              <span className="bg-white rounded-xl px-3 py-1.5 shadow-sm border border-[#e2e7ff] flex items-center">
                <Image src="/logotk.png" alt="TembusKarir" width={120} height={32} className="h-7 w-auto object-contain" priority />
              </span>
            </Link>
            {!isMobile && (
              <button onClick={toggleSidebar} title="Sembunyikan sidebar"
                className="p-1.5 rounded-lg text-[#00315f]/40 hover:text-[#00315f] hover:bg-[#e2e7ff] transition-colors shrink-0">
                <PanelLeft className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
        )}
        {collapsed && !isMobile && (
          <div className="relative w-8 h-8 mx-auto group/logo">
            <Link href="/dashboard"
              className="absolute inset-0 grid place-items-center bg-white border border-slate-200 rounded-xl shadow-xs group-hover/logo:opacity-0 group-hover/logo:pointer-events-none transition-opacity duration-150">
              <Image src="/iconlogo.png" alt="TembusKarir" width={20} height={20} className="w-5 h-5 object-contain rounded-md" priority />
            </Link>
            <button onClick={toggleSidebar} title="Tampilkan sidebar"
              className="absolute inset-0 grid place-items-center bg-white hover:bg-[#e2e7ff] border border-slate-200 rounded-xl text-[#00315f] opacity-0 group-hover/logo:opacity-100 transition-opacity duration-150 shadow-xs">
              <PanelLeft className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 nice-scroll">
        {NAV.map((group, gi) => {
          const visibleItems = group.items.filter(it => isFeatureEnabled(it.featureKey))
          if (visibleItems.length === 0) return null
          return (
          <div key={gi}>
            {group.section && (!collapsed || isMobile) && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#00315f] opacity-70 px-2 pt-4 pb-1">{group.section}</p>
            )}
            {group.section && collapsed && !isMobile && <div className="pt-3" />}
            {visibleItems.map((it) => {
              const Icon   = it.icon
              const active = isActive(it.href)

              if (it.sub && collapsed && !isMobile) return null

              if (it.sub) {
                return (
                  <Link key={it.href} href={it.href} onClick={() => isMobile && setDrawer(false)}
                    className={`relative flex items-center gap-2 pl-9 pr-3 py-1.5 rounded-xl text-xs transition-colors ${
                      active ? 'bg-gradient-to-r from-[#00315f] to-[#16487e] text-white font-semibold' : 'text-[#42474f] hover:bg-[#e2e7ff]'
                    }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-40" />
                    <span className="flex-1 truncate">{it.label}</span>
                  </Link>
                )
              }

              return (
                <Link key={it.href} href={it.href} onClick={() => isMobile && setDrawer(false)}
                  title={collapsed && !isMobile ? it.label : undefined}
                  className={`relative flex items-center rounded-xl text-sm transition-all ${
                    collapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
                  } ${active
                    ? 'bg-gradient-to-r from-[#00315f] to-[#16487e] text-white font-semibold shadow-[0_4px_16px_rgba(22,72,126,0.22)] border-l-4 border-[#61bbff]'
                    : 'text-[#131b2e] hover:bg-[#e2e7ff]'
                  }`}>
                  <div className={`flex items-center ${collapsed && !isMobile ? '' : 'gap-3'}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                      active ? 'bg-white/15 text-white' : `${it.iconBg ?? 'bg-[#d4e3ff]'} ${it.iconColor ?? 'text-[#00315f]'}`
                    }`}>
                      <Icon className="w-[16px] h-[16px]" />
                    </div>
                    {(!collapsed || isMobile) && (
                      <span className="flex-1 truncate text-[13px] font-semibold tracking-tight">{it.label}</span>
                    )}
                  </div>
                  {(!collapsed || isMobile) && (
                    active
                      ? <span className="w-1.5 h-1.5 rounded-full bg-[#61bbff] shadow-[0_0_8px_rgba(97,187,255,0.8)] shrink-0" />
                      : it.tag
                        ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${it.tagColor ?? 'bg-[#cce5ff] text-[#004b73]'}`}>{it.tag}</span>
                        : <ChevronRight className="w-3.5 h-3.5 text-[#42474f]/30 shrink-0" />
                  )}
                </Link>
              )
            })}
          </div>
          )
        })}
      </nav>

      {/* Upgrade banner (free, expanded) */}
      {userPlan === 'free' && isLoggedIn && (!collapsed || isMobile) && (
        <Link href="/harga" onClick={() => isMobile && setDrawer(false)}
          className="mt-3 rounded-2xl p-4 bg-gradient-to-br from-[#00315f] via-[#16487e] to-[#1d5999] border border-white/15 hover:brightness-110 transition-all shadow-[0_8px_24px_rgba(22,72,126,0.28)] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#61bbff]/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-[#00315f] grid place-items-center shadow-md">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Naik ke Premium</p>
              <p className="text-[10px] text-[#cce5ff] font-semibold">Akses Tanpa Batas</p>
            </div>
          </div>
          <p className="text-[12px] text-[#dae2fd]/90 leading-relaxed mb-3 relative z-10">
            Akses seluruh simulasi BUMN & Swasta serta pembahasan lengkap.
          </p>
          <span className="relative z-10 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#61bbff] to-[#006397] text-white font-bold text-[13px] shadow-sm">
            <Crown className="w-3.5 h-3.5" /> Upgrade Sekarang
          </span>
        </Link>
      )}

      {/* Upgrade icon-only (free, collapsed) */}
      {userPlan === 'free' && isLoggedIn && collapsed && !isMobile && (
        <Link href="/harga" title="Naik ke Premium"
          className="mt-3 w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 hover:brightness-110 grid place-items-center mx-auto transition-all shadow-sm">
          <Crown className="w-4 h-4 text-[#00315f]" />
        </Link>
      )}

      {/* Guest: CTA masuk/daftar */}
      {!isLoggedIn && (
        <div className="mt-3 pt-3 border-t border-[#e2e7ff] space-y-1.5">
          {(!collapsed || isMobile) ? (
            <>
              <Link href="/register" onClick={() => isMobile && setDrawer(false)}
                className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#16487e] hover:bg-[#00315f] rounded-xl py-2.5 transition-colors">
                <UserPlus className="w-4 h-4" /> Daftar Gratis
              </Link>
              <button onClick={() => { setShowLogin(true); if (isMobile) setDrawer(false) }}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-[#16487e] hover:bg-[#e2e7ff] rounded-xl py-2.5 transition-colors">
                <LogIn className="w-4 h-4" /> Masuk
              </button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} title="Masuk"
              className="w-9 h-9 rounded-xl bg-[#16487e] hover:bg-[#00315f] grid place-items-center mx-auto text-white transition-colors">
              <LogIn className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-paper flex">
      {/* ===== Desktop sidebar ===== */}
      <aside className={`hidden lg:flex flex-col ${
        collapsed ? 'bg-white' : 'bg-gradient-to-b from-[#f4f7fc] to-[#ebf1f9]'
      } border-r border-[#e2e7ff] sticky top-0 h-screen shrink-0 overflow-hidden transition-all duration-200 ease-in-out ${
        collapsed ? 'w-[68px] px-3 py-4' : 'w-[256px] p-4'
      }`}>
        {SidebarBody(false)}
      </aside>

      {/* ===== Mobile drawer ===== */}
      {drawer && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[270px] bg-gradient-to-b from-[#f4f7fc] to-[#ebf1f9] border-r border-[#e2e7ff] p-4 flex flex-col shadow-2xl overflow-y-auto">
            <button onClick={() => setDrawer(false)} className="absolute top-4 right-4 text-[#42474f]/60 hover:text-[#00315f]">
              <X className="w-5 h-5" />
            </button>
            {SidebarBody(true)}
          </aside>
        </>
      )}

      {/* ===== Content column ===== */}
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">

        {/* ── Topbar ── */}
        <header className="sticky top-3 z-30 mx-3 lg:mx-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-hairline">
          <div className="flex items-center gap-2 h-12 px-3 sm:px-4">

            {/* Mobile menu trigger: iconlogo.png with white background */}
            <button
              onClick={() => setDrawer(true)}
              title="Buka Menu"
              className="lg:hidden -ml-1 w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-[#389add] hover:shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Image src="/iconlogo.png" alt="TembusKarir" width={18} height={18} className="w-[18px] h-[18px] object-contain" priority />
            </button>

            {/* Breadcrumb trail */}
            <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-hidden">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1
                const CrumbIcon = crumb.Icon
                if (isLast) {
                  return (
                    <Fragment key={i}>
                      {breadcrumbs.length > 1 && (
                        <ChevronRight className="w-3 h-3 text-ink-muted/30 shrink-0 mx-0.5 hidden sm:block" />
                      )}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-paper-soft border border-hairline flex items-center justify-center shrink-0">
                          <CrumbIcon className="w-3 h-3 text-ink-muted" />
                        </div>
                        <span className="text-sm text-ink-soft font-medium truncate">{crumb.label}</span>
                      </div>
                    </Fragment>
                  )
                }
                return (
                  <Fragment key={i}>
                    {i > 0 && (
                      <ChevronRight className="w-3 h-3 text-ink-muted/30 shrink-0 mx-0.5 hidden sm:block" />
                    )}
                    {crumb.useBack ? (
                      <button onClick={() => router.back()}
                        className="hidden sm:flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors rounded-lg px-1.5 py-1 hover:bg-black/5 shrink-0">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        {crumb.label}
                      </button>
                    ) : (
                      <Link href={crumb.href!}
                        className="hidden sm:flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors rounded-lg px-1.5 py-1 hover:bg-black/5 shrink-0">
                        <CrumbIcon className="w-3.5 h-3.5" />
                        {crumb.href !== '/' && crumb.label}
                      </Link>
                    )}
                  </Fragment>
                )
              })}
            </div>

            {/* Right actions */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowLogin(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-ink text-xs font-bold rounded-xl border border-hairline bg-white hover:bg-paper-soft transition-colors">
                  <LogIn className="w-3.5 h-3.5" /> Masuk
                </button>
                <Link href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Daftar
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Upgrade Premium (free only) */}
                {userPlan !== 'premium' && (
                  <Link href="/harga"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors">
                    <Crown className="w-3.5 h-3.5" /> Upgrade Premium
                  </Link>
                )}

                {/* Notification bell */}
                <NotificationBell />

                {/* Avatar + dropdown */}
                <div className="relative">
                  <button onClick={() => setMenu((v) => !v)}
                    className="flex items-center gap-1.5 rounded-full hover:bg-black/5 pl-1 pr-2 py-1 transition-colors">
                    <span className="w-8 h-8 rounded-full bg-ink text-white grid place-items-center text-sm font-bold shrink-0">
                      {initial}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform duration-150 ${menu ? 'rotate-180' : ''}`} />
                  </button>

                  {menu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft border border-hairline py-1.5 z-20">
                        {/* User info */}
                        <div className="px-4 py-2.5 border-b border-hairline mb-1">
                          <p className="text-sm font-semibold text-ink truncate">{userName ?? 'Pengguna'}</p>
                          <p className="text-[11px] text-ink-muted">{userPlan === 'premium' ? 'Premium' : 'Paket Gratis'}</p>
                        </div>
                        {/* Menu items */}
                        {[
                          { href: '/profil',   label: 'Profil',          Icon: User     },
                          { href: '/pengaturan', label: 'Pengaturan',    Icon: Settings },
                          { href: '/redeem',   label: 'Redeem Voucher',  Icon: Ticket   },
                        ].map(({ href, label, Icon }) => (
                          <Link key={href} href={href} onClick={() => setMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-soft transition-colors">
                            <Icon className="w-4 h-4" /> {label}
                          </Link>
                        ))}
                        <div className="border-t border-hairline my-1" />
                        <button onClick={signOut} disabled={signingOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                          <LogOut className="w-4 h-4" /> {signingOut ? 'Keluar...' : 'Keluar'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-4 lg:pb-6">{children}</main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-6">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11.5px] text-ink-muted border-t border-hairline pt-4">
            <span>© 2026 TembusKarir</span>
            <Link href="/kebijakan-privasi" className="hover:text-ink transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat-ketentuan"  className="hover:text-ink transition-colors">Syarat &amp; Ketentuan</Link>
            <a href="mailto:support@tembuskarir.id" className="hover:text-ink transition-colors">support@tembuskarir.id</a>
          </div>
        </footer>

        {/* Mobile bottom tabs */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-hairline grid"
          style={{ gridTemplateColumns: `repeat(${ALL_TABS.filter(t => isFeatureEnabled(t.featureKey)).length}, minmax(0, 1fr))` }}>
          {ALL_TABS.filter(t => isFeatureEnabled(t.featureKey)).map((t) => {
            const Icon   = t.icon
            const active = isActive(t.href)
            return (
              <Link key={t.href} href={t.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-semibold transition-colors ${
                  active ? 'text-brand' : 'text-ink-muted'
                }`}>
                <Icon className="w-5 h-5" />
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Modal login (guest) */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}
