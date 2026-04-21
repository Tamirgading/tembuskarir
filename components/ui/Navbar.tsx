'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  User, LayoutDashboard, Ticket, Settings, LogOut,
  ChevronDown, X, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react'

interface NavbarProps {
  userName: string | null
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

  // Close on Escape
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[70] px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Redeem Voucher</h2>
              <p className="text-xs text-gray-500">Masukkan kode untuk aktivasi premium</p>
            </div>
          </div>

          {/* Form */}
          {!result?.success ? (
            <form onSubmit={handleRedeem} className="space-y-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: CPNS3BULAN"
                maxLength={32}
                disabled={loading}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition"
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
            /* Success state */
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
                    {result.duration_days && (
                      <span className="text-green-600 ml-1">(+{result.duration_days} hari)</span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function Navbar({ userName }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)
  const [open, setOpen] = useState(false)
  const [voucherOpen, setVoucherOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  async function handleSignOut() {
    setSigningOut(true)
    setOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U'

  const menuItems = [
    { href: '/profil',     label: 'Profil',      icon: User },
    { href: '/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
    { href: '/pengaturan', label: 'Pengaturan',  icon: Settings },
  ]

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">TembusKarir</span>
            </Link>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {initial}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName ?? 'Pengguna'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  {/* Nav links */}
                  {menuItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        pathname === href
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  ))}

                  {/* Redeem Voucher — buka modal */}
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

      {/* Voucher modal — rendered outside nav agar tidak ter-clip */}
      {voucherOpen && <VoucherModal onClose={() => setVoucherOpen(false)} />}
    </>
  )
}
