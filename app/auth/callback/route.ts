import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setSessionNonce } from '@/lib/session-nonce'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const user = data.user
      const forwardedHost = req.headers.get('x-forwarded-host')
      const baseUrl = forwardedHost ? `https://${forwardedHost}` : origin

      // Deteksi flow reset password: recovery_sent_at ada dan baru (< 10 menit)
      const isRecoveryFlow =
        user?.recovery_sent_at &&
        Date.now() - new Date(user.recovery_sent_at).getTime() < 10 * 60 * 1000

      if (isRecoveryFlow) {
        return NextResponse.redirect(`${baseUrl}/reset-password`)
      }

      // Anti-sharing: tandai perangkat ini sebagai sesi aktif
      if (user) {
        try { await setSessionNonce(user.id) } catch { /* non-kritis */ }
      }

      // Catatan: welcome email TIDAK dikirim di sini — sudah dikirim saat register
      // via POST /api/auth/welcome (hindari email dobel).

      return NextResponse.redirect(`${baseUrl}${next}`)
    }
    console.error('[Auth Callback] exchangeCodeForSession error:', error.message)
  } else {
    console.error('[Auth Callback] Tidak ada code di query param.')
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}
