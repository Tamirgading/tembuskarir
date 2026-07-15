'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  // Verifikasi session sudah ada (ditukar di /auth/callback sebelum redirect ke sini)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true)
      } else {
        setError('Link tidak valid atau sudah kedaluwarsa. Minta link reset password baru melalui halaman Lupa Password.')
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Gagal mengubah password. Coba minta link reset baru.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/'), 2500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center fade-up">
          <div className="bg-white rounded-2xl shadow-soft border border-hairline p-8">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-brand" />
            </div>
            <h2 className="font-heading font-bold text-xl text-ink mb-2">Password berhasil diubah!</h2>
            <p className="text-ink-muted text-sm">Kamu akan diarahkan ke beranda...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper bg-grid-slate flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md fade-up">
        <div className="flex flex-col items-center text-center mb-8">
          <Image src="/logotk.png" alt="TembusKarir" width={200} height={36} className="h-9 w-auto mb-3" priority />
          <p className="text-ink-muted text-sm">Buat password baru untuk akunmu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-hairline p-6 sm:p-8">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!sessionReady && !error && (
            <div className="flex items-center justify-center gap-2 py-6 text-ink-muted text-sm">
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Memverifikasi link...
            </div>
          )}

          {sessionReady && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-[13px] font-bold text-ink mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
                    placeholder="Minimal 8 karakter"
                    disabled={loading}
                    className="w-full bg-paper-soft border border-hairline rounded-xl px-4 py-2.5 pr-11 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[13px] font-bold text-ink mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError('') }}
                  placeholder="Ulangi password baru"
                  disabled={loading}
                  className="w-full bg-paper-soft border border-hairline rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full bg-brand text-white font-bold text-sm rounded-xl py-2.5 mt-1 hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                ) : 'Simpan Password Baru'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
