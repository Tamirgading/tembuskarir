'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, Loader2 } from 'lucide-react'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message === 'Invalid login credentials' 
        ? 'Email atau password salah' 
        : 'Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
      return
    }

    onClose()
    router.refresh()
  }

  const handleGoogleLogin = async () => {
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
  }

  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => !loading && onClose()} />

      {/* Modal Card Shell */}
      <div
        className={`relative w-full max-w-[480px] bg-white rounded-3xl p-6 sm:p-8 shadow-modal border border-slate-100 transition-all duration-300 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Top Subtle Color Accent Line */}
        <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-r from-brand via-brand-accent to-brand-light rounded-b-full"></div>
        
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6 pt-1">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-tint border border-blue-100 flex items-center justify-center p-2.5 shadow-sm">
              <img alt="Logo TembusKarir" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfvFccj0ls3XZSeP2rVHeGvD20behMlru3Wc5iZo5s-ahETznu0B3JQw7O_KXXoaCXMpBOsU-hHzqDQhsRBF-z25QyOdh9VysLL5kmxUmGyX2VchjfWOQMYZ1hmuc-h_4T7Ir9H7Wr2JUFHpmjBs1ugWniq1Ehv_bebsXFwIUGtH4IMomLaWXZu1FIFT4Z1oD2Bw_0BvIJcRg-cYuq9FqOINi6hZEnBogNmXT9CEJHcSNb2U26ghpFvLsTtkqlrtAIA"/>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight" id="modal-title">Masuk</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">ke akun TembusKarir kamu</p>
            </div>
          </div>
          <button
            onClick={() => !loading && onClose()}
            aria-label="Tutup jendela masuk"
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" x2="6" y1="6" y2="18"></line>
              <line x1="6" x2="18" y1="6" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5" htmlFor="loginEmail">Email</label>
            <input
              ref={emailRef}
              id="loginEmail"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              disabled={loading}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/15 transition duration-150 disabled:opacity-60"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700" htmlFor="loginPassword">Password</label>
              <Link href="/lupa-password" onClick={onClose} className="text-xs font-semibold text-brand-accent hover:text-brand hover:underline transition-colors">
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                disabled={loading}
                placeholder="••••••••"
                className="w-full pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/15 transition duration-150 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label="Tampilkan atau sembunyikan password"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors disabled:opacity-40"
              >
                {!showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-brand-glow transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" onClick={onClose} className="text-brand font-bold hover:text-brand-accent hover:underline inline-flex items-center gap-1 transition-colors">
              <span>Daftar gratis</span>
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>

        <div className="relative my-5 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">atau lanjutkan dengan</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-sm transition-all duration-150 flex items-center justify-center gap-3 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
          </svg>
          <span>{loading ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
        </button>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Dengan masuk, kamu menyetujui <Link href="/syarat-ketentuan" className="underline hover:text-slate-600">Ketentuan Layanan</Link> dan <Link href="/kebijakan-privasi" className="underline hover:text-slate-600">Kebijakan Privasi</Link> TembusKarir.
          </p>
        </div>
      </div>
    </div>
  )
}
