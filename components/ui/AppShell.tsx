'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, Briefcase, Zap, Package, ReceiptText, Newspaper, CreditCard,
  User, Settings, Ticket, LogOut, LogIn, UserPlus, ChevronDown, Menu, X, Crown,
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
type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; tag?: string; sub?: boolean; featureKey?: FeatureKey }
type Group = { section: string | null; items: Item[] }

const NAV: Group[] = [
  { section: null, items: [{ href: '/', label: 'Beranda', icon: Home }] },
  {
    section: 'Latihan',
    items: [
      { href: '/portal/astra', label: 'Psikotes ASTRA', icon: Briefcase, tag: 'Populer' },
      { href: '/portal/pln', label: 'Rekrutmen PLN', icon: Zap, featureKey: 'feature_portal_pln' },
      { href: '/portal/pln/gat', label: 'Tahap 1: GAT', icon: Zap, sub: true, featureKey: 'feature_portal_pln' },
      { href: '/portal/pln/tahap2', label: 'Tahap 2: Akademik', icon: BookOpen, sub: true, featureKey: 'feature_portal_pln' },
      { href: '/portal/bumn', label: 'Rekrutmen BUMN', icon: Building2, featureKey: 'feature_portal_bumn' },
      { href: '/portal/antam', label: 'ANTAM IMPACT', icon: Mountain, featureKey: 'feature_portal_antam' },
      { href: '/paket', label: 'Semua Paket', icon: Package, featureKey: 'feature_semua_paket' },
    ],
  },
  {
    section: 'Akun',
    items: [
      { href: '/rapor', label: 'Rapor Belajar', icon: BarChart3 },
      { href: '/riwayat', label: 'Riwayat Tes', icon: History },
      { href: '/soal-tersimpan', label: 'Soal Tersimpan', icon: Bookmark },
      { href: '/?tab=pembelian', label: 'Pembelian', icon: ReceiptText },
      { href: '/info-seleksi', label: 'Info Seleksi', icon: Newspaper, featureKey: 'feature_info_seleksi' },
      { href: '/harga', label: 'Langganan', icon: CreditCard },
    ],
  },
]

const ALL_TABS: Item[] = [
  { href: '/', label: 'Beranda', icon: Home },
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
  { pattern: '/',                      label: 'Ringkasan belajarmu hari ini', Icon: Home                                                                     },
  { pattern: /^\/portal\/astra/,       label: 'Psikotes ASTRA',              Icon: Briefcase, back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/portal\/pln\/gat/,    label: 'PLN: GAT',                    Icon: Zap,       back: { label: 'Rekrutmen PLN', href: '/portal/pln', Icon: Zap       } },
  { pattern: /^\/portal\/pln\/tahap2/, label: 'PLN: Tahap 2',                Icon: BookOpen,  back: { label: 'Rekrutmen PLN', href: '/portal/pln', Icon: Zap       } },
  { pattern: /^\/portal\/pln/,         label: 'Rekrutmen PLN',               Icon: Zap,       back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/portal\/bumn/,        label: 'Rekrutmen BUMN',              Icon: Building2, back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/portal\/antam/,       label: 'ANTAM IMPACT',                Icon: Mountain,  back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/paket/,               label: 'Semua Paket',                 Icon: Package,   back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/rapor/,               label: 'Rapor Belajar',               Icon: BarChart3, back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/riwayat/,             label: 'Riwayat Tes',                 Icon: History,   back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/soal-tersimpan/,      label: 'Soal Tersimpan',              Icon: Bookmark,  back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/harga/,               label: 'Langganan & Harga',           Icon: CreditCard,back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/info-seleksi/,        label: 'Info Seleksi',                Icon: Newspaper, back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/profil/,              label: 'Profil Saya',                 Icon: User,      back: { label: 'Beranda',      href: '/',           Icon: Home      } },
  { pattern: /^\/pengaturan/,          label: 'Pengaturan',                  Icon: Settings,  back: { label: 'Beranda',      href: '/',           Icon: Home      } },
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
      <div className={`pb-5 ${collapsed && !isMobile ? 'px-0' : 'px-2'}`}>
        {/* Expanded: logo + name + PanelLeft toggle */}
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 flex-1 min-w-0" onClick={() => isMobile && setDrawer(false)}>
              <span className="w-8 h-8 rounded-[9px] bg-white grid place-items-center shrink-0 shadow-soft">
                <Image src="/iconlogo.png" alt="TembusKarir" width={22} height={22} className="w-[22px] h-[22px]" priority />
              </span>
              <span className="font-heading font-bold text-[17px] text-white whitespace-nowrap truncate">TembusKarir</span>
            </Link>
            {!isMobile && (
              <button onClick={toggleSidebar} title="Sembunyikan sidebar"
                className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/10 transition-colors shrink-0">
                <PanelLeft className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
        )}

        {/* Collapsed: logo → hover reveals PanelLeft */}
        {collapsed && !isMobile && (
          <div className="relative w-8 h-8 mx-auto group/logo">
            <Link href="/"
              className="absolute inset-0 grid place-items-center bg-white rounded-[9px] shadow-soft group-hover/logo:opacity-0 group-hover/logo:pointer-events-none transition-opacity duration-150">
              <Image src="/iconlogo.png" alt="TembusKarir" width={22} height={22} className="w-[22px] h-[22px]" priority />
            </Link>
            <button onClick={toggleSidebar} title="Tampilkan sidebar"
              className="absolute inset-0 grid place-items-center bg-white/15 rounded-[9px] text-white opacity-0 group-hover/logo:opacity-100 transition-opacity duration-150">
              <PanelLeft className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden -mx-1 px-1 space-y-0.5 nice-scroll">
        {NAV.map((group, gi) => {
          const visibleItems = group.items.filter(it => isFeatureEnabled(it.featureKey))
          if (visibleItems.length === 0) return null
          return (
          <div key={gi}>
            {group.section && (!collapsed || isMobile) && (
              <p className="text-[11px] uppercase tracking-wider text-white/40 px-3 pt-4 pb-1.5 font-semibold">{group.section}</p>
            )}
            {group.section && collapsed && !isMobile && <div className="pt-3" />}
            {visibleItems.map((it) => {
              const Icon   = it.icon
              const active = isActive(it.href)

              if (it.sub && collapsed && !isMobile) return null

              if (it.sub) {
                return (
                  <Link key={it.href} href={it.href} onClick={() => isMobile && setDrawer(false)}
                    className={`relative flex items-center gap-2 pl-9 pr-3 py-2 rounded-[10px] text-xs transition-colors ${
                      active ? 'bg-white/10 text-white font-semibold' : 'text-white/55 hover:bg-white/[0.07] hover:text-white'
                    }`}>
                    {active && <span className="absolute left-0 w-[3px] h-4 rounded-r bg-brand" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                    <span className="flex-1 truncate">{it.label}</span>
                  </Link>
                )
              }

              return (
                <Link key={it.href} href={it.href} onClick={() => isMobile && setDrawer(false)}
                  title={collapsed && !isMobile ? it.label : undefined}
                  className={`relative flex items-center rounded-[10px] text-sm transition-colors ${
                    collapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                  } ${active ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/[0.07] hover:text-white'}`}>
                  {active && <span className="absolute left-0 w-[3px] h-5 rounded-r bg-brand" />}
                  <Icon className="w-[18px] h-[18px] shrink-0 opacity-90" />
                  {(!collapsed || isMobile) && (
                    <>
                      <span className="flex-1 truncate">{it.label}</span>
                      {it.tag && (
                        <span className="text-[10px] font-bold text-white bg-[#FF6B2C] px-2 py-0.5 rounded-full shrink-0">
                          {it.tag}
                        </span>
                      )}
                    </>
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
          className="mt-3 flex items-center gap-3 rounded-2xl bg-white/[0.07] border border-white/10 p-3.5 hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 grid place-items-center shrink-0">
            <Crown className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-none mb-0.5">Naik ke Premium</p>
            <p className="text-white/45 text-[11px] leading-snug">Buka semua paket & analisis kesiapan.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
        </Link>
      )}

      {/* Upgrade icon-only (free, collapsed) */}
      {userPlan === 'free' && isLoggedIn && collapsed && !isMobile && (
        <Link href="/harga" title="Naik ke Premium"
          className="mt-3 w-9 h-9 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 grid place-items-center mx-auto transition-colors">
          <Crown className="w-4 h-4 text-amber-300" />
        </Link>
      )}

      {/* Guest: CTA masuk/daftar */}
      {!isLoggedIn && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
          {(!collapsed || isMobile) ? (
            <>
              <Link href="/register" onClick={() => isMobile && setDrawer(false)}
                className="flex items-center justify-center gap-2 text-sm font-bold text-white bg-brand hover:bg-brand-700 rounded-xl py-2.5 transition-colors">
                <UserPlus className="w-4 h-4" /> Daftar Gratis
              </Link>
              <button onClick={() => { setShowLogin(true); if (isMobile) setDrawer(false) }}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-white/80 hover:text-white hover:bg-white/[0.07] rounded-xl py-2.5 transition-colors">
                <LogIn className="w-4 h-4" /> Masuk
              </button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} title="Masuk"
              className="w-9 h-9 rounded-xl bg-brand hover:bg-brand-700 grid place-items-center mx-auto text-white transition-colors">
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
      <aside className={`hidden lg:flex flex-col bg-sidebar text-white sticky top-0 h-screen shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-[68px] px-3 py-4' : 'w-[256px] p-4'
      }`}>
        {SidebarBody(false)}
      </aside>

      {/* ===== Mobile drawer ===== */}
      {drawer && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[270px] bg-sidebar text-white p-4 flex flex-col shadow-2xl">
            <button onClick={() => setDrawer(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
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

            {/* Mobile hamburger */}
            <button onClick={() => setDrawer(true)}
              className="lg:hidden -ml-1 p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-black/5 transition-colors">
              <Menu className="w-5 h-5" />
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
