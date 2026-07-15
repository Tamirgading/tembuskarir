'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, Briefcase, Zap, Package, ReceiptText, Newspaper, CreditCard,
  User, Settings, Ticket, LogOut, LogIn, UserPlus, ChevronDown, Menu, X, Sparkles,
  ChevronLeft, ChevronRight, BookOpen, Building2, History, Bookmark, BarChart3,
} from 'lucide-react'
import LoginModal from '@/components/ui/LoginModal'

interface AppShellProps {
  isLoggedIn: boolean
  userName: string | null
  userPlan: 'free' | 'premium'
  children: React.ReactNode
}

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; tag?: string; sub?: boolean }
type Group = { section: string | null; items: Item[] }

const NAV: Group[] = [
  { section: null, items: [{ href: '/', label: 'Beranda', icon: Home }] },
  {
    section: 'Latihan',
    items: [
      { href: '/portal/astra', label: 'Psikotes ASTRA', icon: Briefcase, tag: 'Populer' },
      { href: '/portal/pln', label: 'Rekrutmen PLN', icon: Zap },
      { href: '/portal/pln/gat', label: 'Tahap 1 — GAT', icon: Zap, sub: true },
      { href: '/portal/pln/tahap2', label: 'Tahap 2 — Akademik', icon: BookOpen, sub: true },
      { href: '/portal/bumn', label: 'Rekrutmen BUMN', icon: Building2 },
      { href: '/paket', label: 'Semua Paket', icon: Package },
    ],
  },
  {
    section: 'Akun',
    items: [
      { href: '/rapor', label: 'Rapor Belajar', icon: BarChart3 },
      { href: '/riwayat', label: 'Riwayat Tes', icon: History },
      { href: '/soal-tersimpan', label: 'Soal Tersimpan', icon: Bookmark },
      { href: '/?tab=pembelian', label: 'Pembelian', icon: ReceiptText },
      { href: '/info-seleksi', label: 'Info Seleksi', icon: Newspaper },
      { href: '/harga', label: 'Langganan', icon: CreditCard },
    ],
  },
]

const TABS: Item[] = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/paket', label: 'Latihan', icon: Package },
  { href: '/info-seleksi', label: 'Info', icon: Newspaper },
  { href: '/harga', label: 'Langganan', icon: CreditCard },
  { href: '/profil', label: 'Profil', icon: User },
]

export function AppShell({ isLoggedIn, userName, userPlan, children }: AppShellProps) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const [drawer, setDrawer] = useState(false)
  const [menu, setMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  // Pulihkan preferensi sidebar dari localStorage
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

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U'
  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/') return pathname === '/'
    // Hub PLN: hanya aktif di halaman /portal/pln persis (bukan sub-routes)
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

  // ── Konten sidebar (sama untuk desktop dan mobile) ───────────────────────────
  const SidebarBody = (isMobile = false) => (
    <>
      {/* Brand */}
      <div className={`flex items-center gap-2.5 pb-5 ${collapsed && !isMobile ? 'justify-center px-0' : 'px-2'}`}>
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => isMobile && setDrawer(false)}
        >
          <span className="w-8 h-8 rounded-[9px] bg-white grid place-items-center shrink-0 shadow-soft">
            <Image src="/iconlogo.png" alt="TembusKarir" width={22} height={22} className="w-[22px] h-[22px]" priority />
          </span>
          {(!collapsed || isMobile) && (
            <span className="font-heading font-bold text-[17px] text-white whitespace-nowrap">TembusKarir</span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden -mx-1 px-1 space-y-0.5 nice-scroll">
        {NAV.map((group, gi) => (
          <div key={gi}>
            {group.section && (!collapsed || isMobile) && (
              <p className="text-[11px] uppercase tracking-wider text-white/40 px-3 pt-4 pb-1.5 font-semibold">{group.section}</p>
            )}
            {group.section && collapsed && !isMobile && <div className="pt-3" />}
            {group.items.map((it) => {
              const Icon = it.icon
              const active = isActive(it.href)

              // Sub-item (Tahap 1/2 PLN): hidden saat sidebar collapsed (kecuali mobile)
              if (it.sub && collapsed && !isMobile) return null

              if (it.sub) {
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => isMobile && setDrawer(false)}
                    className={`relative flex items-center gap-2 pl-9 pr-3 py-2 rounded-[10px] text-xs transition-colors ${
                      active ? 'bg-white/10 text-white font-semibold' : 'text-white/55 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    {active && <span className="absolute left-0 w-[3px] h-4 rounded-r bg-brand" />}
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                    <span className="flex-1 truncate">{it.label}</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => isMobile && setDrawer(false)}
                  title={collapsed && !isMobile ? it.label : undefined}
                  className={`relative flex items-center rounded-[10px] text-sm transition-colors ${
                    collapsed && !isMobile ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
                  } ${active ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/[0.07] hover:text-white'}`}
                >
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
        ))}
      </nav>

      {/* Upgrade banner (free, expanded only) */}
      {userPlan === 'free' && (!collapsed || isMobile) && (
        <Link
          href="/harga"
          onClick={() => isMobile && setDrawer(false)}
          className="mt-3 block rounded-2xl bg-white/[0.07] border border-white/10 p-3.5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4 text-brand-300" /> Naik ke Premium
          </div>
          <p className="text-white/55 text-xs leading-snug">Buka semua paket & analisis kesiapan lengkap.</p>
        </Link>
      )}

      {/* Upgrade icon-only (free, collapsed) */}
      {userPlan === 'free' && collapsed && !isMobile && (
        <Link href="/harga" title="Naik ke Premium"
          className="mt-3 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 grid place-items-center mx-auto transition-colors">
          <Sparkles className="w-4 h-4 text-brand-300" />
        </Link>
      )}

      {/* User chip — guest: CTA masuk/daftar */}
      {!isLoggedIn ? (
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
      ) : (
      <div className="mt-3 pt-3 border-t border-white/10">
        {(!collapsed || isMobile) ? (
          <>
            <div className="flex items-center gap-2.5 px-1">
              <span className="w-9 h-9 rounded-full bg-brand grid place-items-center text-white font-bold shrink-0">{initial}</span>
              <div className="min-w-0 flex-1">
                <p className="text-white text-[13.5px] font-semibold truncate">{userName ?? 'Pengguna'}</p>
                <p className="text-white/45 text-[11px]">{userPlan === 'premium' ? 'Premium' : 'Paket Gratis'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2.5">
              <Link href="/profil" onClick={() => isMobile && setDrawer(false)}
                className="flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07] rounded-lg py-2 transition-colors">
                <User className="w-3.5 h-3.5" /> Profil
              </Link>
              <Link href="/pengaturan" onClick={() => isMobile && setDrawer(false)}
                className="flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07] rounded-lg py-2 transition-colors">
                <Settings className="w-3.5 h-3.5" /> Pengaturan
              </Link>
              <Link href="/redeem" onClick={() => isMobile && setDrawer(false)}
                className="flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07] rounded-lg py-2 transition-colors">
                <Ticket className="w-3.5 h-3.5" /> Voucher
              </Link>
              <button onClick={signOut} disabled={signingOut}
                className="flex items-center justify-center gap-1.5 text-xs text-red-300/80 hover:text-red-200 hover:bg-red-500/10 rounded-lg py-2 transition-colors disabled:opacity-50">
                <LogOut className="w-3.5 h-3.5" /> {signingOut ? '...' : 'Keluar'}
              </button>
            </div>
          </>
        ) : (
          /* Collapsed: hanya ikon-ikon vertikal */
          <div className="flex flex-col items-center gap-1.5">
            <span title={userName ?? 'Pengguna'}
              className="w-9 h-9 rounded-full bg-brand grid place-items-center text-white font-bold cursor-default">
              {initial}
            </span>
            <Link href="/profil" title="Profil"
              className="w-9 h-9 rounded-xl hover:bg-white/10 grid place-items-center text-white/70 hover:text-white transition-colors">
              <User className="w-4 h-4" />
            </Link>
            <button onClick={signOut} disabled={signingOut} title="Keluar"
              className="w-9 h-9 rounded-xl hover:bg-red-500/10 grid place-items-center text-red-300/80 hover:text-red-200 transition-colors disabled:opacity-50">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-paper flex">
      {/* ===== Desktop sidebar ===== */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar text-white sticky top-0 h-screen shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out ${
          collapsed ? 'w-[68px] px-3 py-4' : 'w-[256px] p-4'
        }`}
      >
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
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-paper/80 backdrop-blur border-b border-hairline">
          <div className="flex items-center gap-2 h-14 px-4 sm:px-6 lg:px-8">

            {/* Mobile hamburger */}
            <button onClick={() => setDrawer(true)}
              className="lg:hidden -ml-1 p-2 rounded-lg text-ink hover:bg-black/5">
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={toggleSidebar}
              title={collapsed ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
              className="hidden lg:flex p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 transition-colors"
            >
              {collapsed
                ? <ChevronRight className="w-5 h-5" />
                : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Logo — mobile only */}
            <Link href="/" className="lg:hidden flex items-center">
              <Image src="/logotk.png" alt="TembusKarir" width={132} height={24} className="h-6 w-auto" priority />
            </Link>

            {/* Right: guest → masuk/daftar; login → premium badge + avatar */}
            {!isLoggedIn ? (
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setShowLogin(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-ink text-xs font-bold rounded-lg border border-hairline bg-white hover:bg-paper-soft transition-colors">
                  <LogIn className="w-3.5 h-3.5" />Masuk
                </button>
                <Link href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" />Daftar
                </Link>
              </div>
            ) : (
            <div className="ml-auto flex items-center gap-2.5">
              {userPlan === 'premium' ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand-700 text-xs font-bold rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />Premium
                </span>
              ) : (
                <Link href="/harga"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />Upgrade
                </Link>
              )}
              <div className="relative">
                <button onClick={() => setMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-black/5 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-ink text-white grid place-items-center text-sm font-bold">{initial}</span>
                  <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${menu ? 'rotate-180' : ''}`} />
                </button>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-soft border border-hairline py-1.5 z-20">
                      <div className="px-4 py-2 border-b border-hairline mb-1">
                        <p className="text-sm font-semibold text-ink truncate">{userName ?? 'Pengguna'}</p>
                        <p className="text-[11px] text-ink-muted">{userPlan === 'premium' ? 'Premium' : 'Paket Gratis'}</p>
                      </div>
                      {[
                        { href: '/profil', label: 'Profil', icon: User },
                        { href: '/pengaturan', label: 'Pengaturan', icon: Settings },
                        { href: '/redeem', label: 'Redeem Voucher', icon: Ticket },
                      ].map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} onClick={() => setMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-soft transition-colors">
                          <Icon className="w-4 h-4" />{label}
                        </Link>
                      ))}
                      <div className="border-t border-hairline my-1" />
                      <button onClick={signOut} disabled={signingOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                        <LogOut className="w-4 h-4" />{signingOut ? 'Keluar...' : 'Keluar'}
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
            <Link href="/syarat-ketentuan" className="hover:text-ink transition-colors">Syarat &amp; Ketentuan</Link>
            <a href="mailto:support@tembuskarir.id" className="hover:text-ink transition-colors">support@tembuskarir.id</a>
          </div>
        </footer>

        {/* Mobile bottom tabs */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-hairline grid grid-cols-5">
          {TABS.map((t) => {
            const Icon = t.icon
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
