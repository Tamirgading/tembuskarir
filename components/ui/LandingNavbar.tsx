'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronDown, LayoutDashboard, User, Ticket, Settings, LogOut, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import LoginModal from '@/components/ui/LoginModal'

interface LandingNavbarProps {
  isLoggedIn: boolean
  firstName: string | null
}

function formatDateID(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function VoucherModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    expires_at?: string
    duration_days?: number
  } | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/voucher/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, message: data.message, expires_at: data.expires_at, duration_days: data.duration_days })
        setCode('')
      } else {
        setResult({ success: false, message: data.error ?? 'Gagal memproses voucher.' })
      }
    } catch {
      setResult({ success: false, message: 'Terjadi kesalahan. Coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[70] px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Redeem Voucher</h2>
              <p className="text-xs text-gray-500">Masukkan kode untuk aktivasi premium</p>
            </div>
          </div>
          {!result?.success ? (
            <form onSubmit={handleRedeem} className="space-y-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: PREMIUM3BULAN"
                maxLength={32}
                disabled={loading}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 transition"
              />
              {result && !result.success && (
                <div className="flex gap-2 items-start bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{result.message}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                {loading ? 'Memproses...' : 'Gunakan Voucher'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{result.message}</p>
                {result.expires_at && (
                  <p className="text-sm text-gray-500 mt-1">
                    Akses premium aktif hingga{' '}
                    <span className="font-semibold text-gray-700">{formatDateID(result.expires_at)}</span>
                    {result.duration_days && <span className="text-green-600 ml-1">(+{result.duration_days} hari)</span>}
                  </p>
                )}
              </div>
              <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition">
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function LandingNavbar({ isLoggedIn, firstName }: LandingNavbarProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [voucherOpen, setVoucherOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  async function handleSignOut() {
    setSigningOut(true)
    setOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = firstName ? firstName.charAt(0).toUpperCase() : 'U'

  const menuItems = [
    { href: '/profil',     label: 'Profil',     icon: User },
    { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
    { href: '/pengaturan', label: 'Pengaturan', icon: Settings },
  ]

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
              <Image src="/logotk.png" alt="Tembuskarir" width={140} height={40} className="h-10 w-auto object-contain" priority />
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="#fitur" className="hover:text-blue-600 transition-colors py-2 relative group">
                Fitur
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="#jenis-tes" className="hover:text-blue-600 transition-colors py-2 relative group">
                Jenis Tes
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>

              {isLoggedIn ? (
                <div className="relative ml-4" ref={dropdownRef}>
                  {/* Profile pill button */}
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-3 px-2 py-1 pr-4 bg-slate-50 rounded-full border border-slate-200 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all"
                  >
                    <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 text-sm font-bold">
                      {initial}
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Halo,</p>
                      <span className="font-bold text-slate-700 text-sm leading-none">{firstName}</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-slate-400 ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                      {menuItems.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { setOpen(false); setVoucherOpen(true) }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Ticket className="w-4 h-4 shrink-0" />
                        Redeem Voucher
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {signingOut ? 'Keluar...' : 'Log out'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-5 py-2.5 font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Masuk
                  </button>
                  <Link href="/register"
                    className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95">
                    Daftar Gratis
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              {isLoggedIn ? (
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                >
                  {initial}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Masuk
                  </button>
                  <Link href="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">
                    Daftar
                  </Link>
                </div>
              )}

              {/* Mobile dropdown */}
              {isLoggedIn && open && (
                <div className="absolute right-4 top-20 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  {menuItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setOpen(false); setVoucherOpen(true) }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Ticket className="w-4 h-4 shrink-0" />
                    Redeem Voucher
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {signingOut ? 'Keluar...' : 'Log out'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      {voucherOpen && <VoucherModal onClose={() => setVoucherOpen(false)} />}
    </>
  )
}
