'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Home, Briefcase, Zap, Package, ReceiptText, Newspaper, CreditCard,
  User, Settings, Ticket, LogOut, ChevronDown, Menu, X, Sparkles,
} from 'lucide-react'

interface AppShellProps {
  userName: string | null
  userPlan: 'free' | 'premium'
  children: React.ReactNode
}

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; tag?: string }
type Group = { section: string | null; items: Item[] }

const NAV: Group[] = [
  { section: null, items: [{ href: '/dashboard', label: 'Beranda', icon: Home }] },
  {
    section: 'Latihan',
    items: [
      { href: '/portal/astra', label: 'Psikotes ASTRA', icon: Briefcase, tag: 'Populer' },
      { href: '/portal/pln', label: 'Rekrutmen PLN', icon: Zap },
      { href: '/paket', label: 'Semua Paket', icon: Package },
    ],
  },
  {
    section: 'Akun',
    items: [
      { href: '/dashboard?tab=pembelian', label: 'Riwayat & Pembelian', icon: ReceiptText },
      { href: '/info-seleksi', label: 'Info Seleksi', icon: Newspaper },
      { href: '/harga', label: 'Langganan', icon: CreditCard },
    ],
  },
]

// Tab bar mobile (5 tujuan utama)
const TABS: Item[] = [
  { href: '/dashboard', label: 'Beranda', icon: Home },
  { href: '/paket', label: 'Latihan', icon: Package },
  { href: '/info-seleksi', label: 'Info', icon: Newspaper },
  { href: '/harga', label: 'Langganan', icon: CreditCard },
  { href: '/profil', label: 'Profil', icon: User },
]

export function AppShell({ userName, userPlan, children }: AppShellProps) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const [drawer, setDrawer] = useState(false)
  const [menu, setMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // Halaman ujian aktif → mode fokus penuh (tanpa shell)
  if (pathname.startsWith('/ujian/')) return <>{children}</>

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U'
  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/dashboard') return pathname === '/dashboard'
    return pathname === base || pathname.startsWith(base + '/')
  }

  async function signOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarBody = (
    <>
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 pb-5" onClick={() => setDrawer(false)}>
        <span className="w-8 h-8 rounded-[9px] bg-brand grid place-items-center text-white font-heading font-extrabold text-base">T</span>
        <span className="font-heading font-bold text-[17px] text-white">TembusKarir</span>
      </Link>

      <nav className="flex-1 overflow-y-auto -mx-1 px-1 space-y-0.5">
        {NAV.map((group, gi) => (
          <div key={gi}>
            {group.section && (
              <p className="text-[11px] uppercase tracking-wider text-white/40 px-3 pt-4 pb-1.5 font-semibold">{group.section}</p>
            )}
            {group.items.map((it) => {
              const Icon = it.icon
              const active = isActive(it.href)
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setDrawer(false)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors ${
                    active ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  {active && <span className="absolute left-0 w-[3px] h-5 rounded-r bg-brand" />}
                  <Icon className="w-[18px] h-[18px] shrink-0 opacity-90" />
                  <span className="flex-1">{it.label}</span>
                  {it.tag && <span className="text-[10px] font-bold text-white bg-[#FF6B2C] px-2 py-0.5 rounded-full">{it.tag}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Upgrade banner (free) */}
      {userPlan === 'free' && (
        <Link href="/harga" onClick={() => setDrawer(false)}
          className="mt-3 block rounded-2xl bg-white/[0.07] border border-white/10 p-3.5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4 text-brand-300" /> Naik ke Premium
          </div>
          <p className="text-white/55 text-xs leading-snug">Buka semua paket & analisis kesiapan lengkap.</p>
        </Link>
      )}

      {/* User chip */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-1">
          <span className="w-9 h-9 rounded-full bg-brand grid place-items-center text-white font-bold shrink-0">{initial}</span>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[13.5px] font-semibold truncate">{userName ?? 'Pengguna'}</p>
            <p className="text-white/45 text-[11px]">{userPlan === 'premium' ? 'Premium' : 'Paket Gratis'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <Link href="/profil" onClick={() => setDrawer(false)} className="flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07] rounded-lg py-2 transition-colors"><User className="w-3.5 h-3.5" />Profil</Link>
          <Link href="/pengaturan" onClick={() => setDrawer(false)} className="flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07] rounded-lg py-2 transition-colors"><Settings className="w-3.5 h-3.5" />Pengaturan</Link>
          <Link href="/redeem" onClick={() => setDrawer(false)} className="flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.07] rounded-lg py-2 transition-colors"><Ticket className="w-3.5 h-3.5" />Voucher</Link>
          <button onClick={signOut} disabled={signingOut} className="flex items-center justify-center gap-1.5 text-xs text-red-300/80 hover:text-red-200 hover:bg-red-500/10 rounded-lg py-2 transition-colors disabled:opacity-50"><LogOut className="w-3.5 h-3.5" />{signingOut ? '...' : 'Keluar'}</button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[256px_1fr]">
      {/* ===== Desktop sidebar ===== */}
      <aside className="hidden lg:flex flex-col bg-ink text-white p-4 lg:sticky lg:top-0 lg:h-screen">
        {SidebarBody}
      </aside>

      {/* ===== Mobile drawer ===== */}
      {drawer && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[270px] bg-ink text-white p-4 flex flex-col shadow-2xl">
            <button onClick={() => setDrawer(false)} className="absolute top-4 right-4 text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
            {SidebarBody}
          </aside>
        </>
      )}

      {/* ===== Content column ===== */}
      <div className="flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-paper/80 backdrop-blur border-b border-hairline">
          <div className="flex items-center gap-3 h-14 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setDrawer(true)} className="lg:hidden -ml-1 p-2 rounded-lg text-ink hover:bg-black/5"><Menu className="w-5 h-5" /></button>
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand grid place-items-center text-white font-heading font-extrabold text-sm">T</span>
              <span className="font-heading font-bold text-ink">TembusKarir</span>
            </Link>

            <div className="ml-auto flex items-center gap-2.5">
              {userPlan === 'premium' ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand-700 text-xs font-bold rounded-full"><Sparkles className="w-3.5 h-3.5" />Premium</span>
              ) : (
                <Link href="/harga" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors"><Sparkles className="w-3.5 h-3.5" />Upgrade</Link>
              )}
              <div className="relative">
                <button onClick={() => setMenu((v) => !v)} className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-black/5 transition-colors">
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
                        <Link key={href} href={href} onClick={() => setMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-soft transition-colors"><Icon className="w-4 h-4" />{label}</Link>
                      ))}
                      <div className="border-t border-hairline my-1" />
                      <button onClick={signOut} disabled={signingOut} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"><LogOut className="w-4 h-4" />{signingOut ? 'Keluar...' : 'Keluar'}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">{children}</main>

        {/* Mobile bottom tabs */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-hairline grid grid-cols-5">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = isActive(t.href)
            return (
              <Link key={t.href} href={t.href} className={`flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-semibold transition-colors ${active ? 'text-brand' : 'text-ink-muted'}`}>
                <Icon className="w-5 h-5" />
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
