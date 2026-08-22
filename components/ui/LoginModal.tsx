'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  // Auto-focus email saat modal terbuka, reset form saat ditutup
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => emailRef.current?.focus(), 80)
      return () => clearTimeout(timer)
    } else {
      setEmail('')
      setPassword('')
      setError('')
      setShowPassword(false)
      setLoading(false)
    }
  }, [isOpen])

  // Tutup dengan Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onClose()
    }
    if (isOpen) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, loading, onClose])

  // Cegah scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email atau password salah. Silakan coba lagi.')
      setLoading(false)
      return
    }

    // Anti-sharing: tandai perangkat ini sebagai sesi aktif
    try { await fetch('/api/auth/session-nonce', { method: 'POST' }) } catch { /* non-kritis */ }

    onClose()
    router.refresh()
  }

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError) {
      setError('Gagal menghubungkan ke Google. Coba lagi beberapa saat.')
      setLoading(false)
      return
    }
    // Browser akan diarahkan ke Google; modal tidak perlu ditutup manual
  }

  return (
    /* Wrapper selalu ada di DOM — animasi dikontrol lewat opacity & scale */
    <div
      aria-modal="true"
      role="dialog"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />

      {/* Card modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
      >
        {/* Garis dekorasi atas */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-700 via-brand to-brand-300" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-paper-soft border border-hairline grid place-items-center shrink-0">
              <Image src="/iconlogo.png" alt="TembusKarir" width={26} height={26} className="w-[26px] h-[26px]" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">Masuk</h2>
              <p className="text-sm text-gray-400 mt-0.5">ke akun TembusKarir kamu</p>
            </div>
          </div>
          <button
            onClick={() => !loading && onClose()}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 pt-4 space-y-4">

          <form onSubmit={handleSubmit} className="space-y-4">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="modal-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              ref={emailRef}
              id="modal-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
              placeholder="nama@email.com"
              disabled={loading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="modal-password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link
                href="/lupa-password"
                onClick={onClose}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-2.5 mt-1 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>

          <p className="text-center text-sm text-gray-400 pt-1">
            Belum punya akun?{' '}
            <Link
              href="/register"
              onClick={onClose}
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
            >
              Daftar gratis →
            </Link>
          </p>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />
            atau lanjutkan dengan
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
            </svg>
            {loading ? 'Menghubungkan...' : 'Masuk dengan Google'}
          </button>
        </div>
      </div>
    </div>
  )
}
