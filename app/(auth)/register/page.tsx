'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.')
      return
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        setError('Email ini sudah terdaftar. Silakan masuk.')
      } else {
        setError(authError.message || 'Gagal mendaftar. Coba lagi beberapa saat.')
      }
      setLoading(false)
      return
    }

    // Kirim welcome email (fire and forget)
    fetch('/api/auth/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: fullName }),
    }).catch(() => {/* ignore */})

    // Anti-sharing
    try { await fetch('/api/auth/session-nonce', { method: 'POST' }) } catch { /* non-kritis */ }

    setSuccess(true)
    setLoading(false)
  }

  const handleGoogleRegister = async () => {
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
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#faf8ff] text-slate-800 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(155, 225, 253, 0.42) 0%, rgba(250, 248, 255, 0) 55%),
            radial-gradient(circle at 15% 45%, rgba(56, 154, 221, 0.16) 0%, rgba(250, 248, 255, 0) 45%),
            radial-gradient(circle at 85% 65%, rgba(22, 72, 126, 0.14) 0%, rgba(250, 248, 255, 0) 50%)
          `
        }}
      >
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#9be1fd]/60 shadow-2xl shadow-[#16487e]/10 p-8 text-center relative z-10">
          <div className="w-16 h-16 bg-[#e0f2fe] text-[#16487e] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#9be1fd]/50 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-[#16487e]" />
          </div>
          <h2 className="text-2xl font-black text-[#16487e] mb-2">Cek Email Kamu!</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Kami sudah mengirimkan link verifikasi ke <strong className="text-slate-900">{email}</strong>.
            Klik link tersebut untuk mengaktifkan akun TembusKarir kamu.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-2xl bg-[#16487e] hover:bg-[#389add] text-white font-extrabold text-sm shadow-lg shadow-[#16487e]/25 transition-all duration-200"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-[#389add] selection:text-white relative overflow-x-hidden"
      style={{
        backgroundColor: '#faf8ff',
        backgroundImage: `
          radial-gradient(circle at 50% 15%, rgba(155, 225, 253, 0.42) 0%, rgba(250, 248, 255, 0) 55%),
          radial-gradient(circle at 15% 45%, rgba(56, 154, 221, 0.16) 0%, rgba(250, 248, 255, 0) 45%),
          radial-gradient(circle at 85% 65%, rgba(22, 72, 126, 0.14) 0%, rgba(250, 248, 255, 0) 50%)
        `
      }}
    >
      <header className="w-full border-b border-slate-100/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2 group" href="/">
            <img alt="TembusKarir Logo" className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfvFccj0ls3XZSeP2rVHeGvD20behMlru3Wc5iZo5s-ahETznu0B3JQw7O_KXXoaCXMpBOsU-hHzqDQhsRBF-z25QyOdh9VysLL5kmxUmGyX2VchjfWOQMYZ1hmuc-h_4T7Ir9H7Wr2JUFHpmjBs1ugWniq1Ehv_bebsXFwIUGtH4IMomLaWXZu1FIFT4Z1oD2Bw_0BvIJcRg-cYuq9FqOINi6hZEnBogNmXT9CEJHcSNb2U26ghpFvLsTtkqlrtAIA" />
          </Link>
          <Link href="/" className="text-xs sm:text-sm font-bold text-[#16487e] hover:text-[#389add] transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 relative">
        {/* Ambient Grid Texture */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-80"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `
              linear-gradient(to right, rgba(56, 154, 221, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 154, 221, 0.05) 1px, transparent 1px)
            `
          }}
        ></div>

        {/* Ambient Glowing Spheres */}
        <div className="absolute top-1/4 -left-28 w-[420px] h-[420px] bg-[#9be1fd]/35 rounded-full blur-[90px] pointer-events-none z-0 animate-orb-1"></div>
        <div className="absolute bottom-8 -right-28 w-[460px] h-[460px] bg-[#389add]/25 rounded-full blur-[100px] pointer-events-none z-0 animate-orb-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-gradient-to-tr from-[#9be1fd]/20 via-[#389add]/10 to-transparent rounded-full blur-[110px] pointer-events-none z-0 animate-orb-3"></div>

        {/* Centered Registration Card */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-[#9be1fd]/60 shadow-2xl shadow-[#16487e]/10 p-6 sm:p-8 relative z-20 transition-all duration-300">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e0f2fe] to-[#9be1fd]/30 p-2 mb-3 shadow-inner border border-[#9be1fd]/50">
              <img alt="TembusKarir Icon" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVfvFccj0ls3XZSeP2rVHeGvD20behMlru3Wc5iZo5s-ahETznu0B3JQw7O_KXXoaCXMpBOsU-hHzqDQhsRBF-z25QyOdh9VysLL5kmxUmGyX2VchjfWOQMYZ1hmuc-h_4T7Ir9H7Wr2JUFHpmjBs1ugWniq1Ehv_bebsXFwIUGtH4IMomLaWXZu1FIFT4Z1oD2Bw_0BvIJcRg-cYuq9FqOINi6hZEnBogNmXT9CEJHcSNb2U26ghpFvLsTtkqlrtAIA"/>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16487e] tracking-tight">Daftar Akun Tembuskarir</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Buat akun gratis untuk mulai latihan sekarang</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl px-4 py-3 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="regFullName">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input
                  id="regFullName"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all disabled:opacity-60"
                  placeholder="Contoh: Budi Santoso"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); if (error) setError(''); }}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="regEmail">Alamat Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input
                  id="regEmail"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all disabled:opacity-60"
                  placeholder="nama@email.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="regPassword">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input
                  id="regPassword"
                  className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all disabled:opacity-60"
                  placeholder="Minimal 8 karakter"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="regConfirmPassword">Konfirmasi Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </span>
                <input
                  id="regConfirmPassword"
                  className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-[#f8fafc] border border-slate-200 rounded-xl focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#389add] focus:ring-4 focus:ring-[#9be1fd]/35 transition-all disabled:opacity-60"
                  placeholder="Ulangi password"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(''); }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium uppercase tracking-wider">atau daftar lebih cepat</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 hover:border-[#389add] rounded-xl bg-white hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm shadow-xs cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"></path>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"></path>
                </svg>
                <span>{loading ? 'Menghubungkan...' : 'Daftar dengan Google'}</span>
              </button>
            </div>
            
            <div className="pt-1 text-[11px] text-slate-500 leading-relaxed">
              Dengan mendaftar, Anda menyetujui <Link className="text-[#389add] hover:underline font-semibold" href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link> serta <Link className="text-[#389add] hover:underline font-semibold" href="/kebijakan-privasi">Kebijakan Privasi</Link> TembusKarir.
            </div>
            
            <button
              className="w-full mt-2 py-3.5 px-4 bg-[#16487e] hover:bg-[#389add] active:scale-[0.99] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-[#16487e]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Sudah punya akun? <Link className="font-extrabold text-[#16487e] hover:text-[#389add] transition-colors ml-1" href="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-100/80 py-5 text-center text-xs text-slate-400 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 TembusKarir. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <Link className="hover:text-[#389add] transition-colors" href="#">Bantuan</Link>
            <Link className="hover:text-[#389add] transition-colors" href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link className="hover:text-[#389add] transition-colors" href="/syarat-ketentuan">Syarat &amp; Ketentuan</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
