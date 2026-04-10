// lib/resend.ts
// Email transaksional via Resend — server-side only

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@tryoutplatform.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!RESEND_API_KEY || RESEND_API_KEY === 'GANTI_INI') {
    // Skip jika Resend belum dikonfigurasi (development)
    console.log('[Resend] Email skipped (not configured):', params.subject, '→', params.to)
    return
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('[Resend] Send error:', err)
    // Tidak throw — email gagal tidak boleh crash aplikasi
  }
}

/**
 * Email selamat datang setelah register
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Selamat datang di TryOut Platform! 🎉',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111827;">
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Halo, ${name || 'Sobat'}! 👋</h1>
        <p style="color: #6B7280; margin-bottom: 24px;">
          Selamat datang di <strong>TryOut Platform</strong> — platform latihan CPNS/SKD terbaik untuk persiapan ujian kamu.
        </p>
        <div style="background: #EFF6FF; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #1D4ED8;">Yang bisa kamu lakukan sekarang:</p>
          <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
            <li>Pilih paket soal gratis dan mulai latihan</li>
            <li>Lihat skor dan pembahasan setelah ujian</li>
            <li>Pantau perkembangan kamu di dashboard</li>
          </ul>
        </div>
        <a href="${APP_URL}/paket" style="display: inline-block; padding: 12px 24px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Mulai Try Out →
        </a>
        <p style="margin-top: 32px; font-size: 12px; color: #9CA3AF;">
          Email ini dikirim otomatis. Jangan reply email ini.
        </p>
      </div>
    `,
  })
}

/**
 * Email konfirmasi pembayaran premium berhasil
 */
export async function sendPaymentSuccessEmail(
  to: string,
  name: string,
  planType: 'monthly' | 'yearly',
  expiresAt: string
): Promise<void> {
  const planLabel = planType === 'monthly' ? 'Premium Monthly' : 'Premium Yearly'
  const expiryDate = new Date(expiresAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  await sendEmail({
    to,
    subject: '✅ Pembayaran Premium Berhasil!',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111827;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 48px;">🎉</div>
          <h1 style="font-size: 24px; font-weight: 700; margin: 8px 0;">Pembayaran Berhasil!</h1>
          <p style="color: #6B7280;">Akun kamu sudah diupgrade ke Premium</p>
        </div>
        <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #92400E; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Detail Langganan</p>
          <p style="margin: 4px 0; font-size: 20px; font-weight: 700; color: #78350F;">${planLabel}</p>
          <p style="margin: 4px 0; color: #92400E;">Aktif hingga: <strong>${expiryDate}</strong></p>
        </div>
        <p style="color: #374151; margin-bottom: 24px;">
          Halo <strong>${name || 'Sobat'}</strong>! Sekarang kamu bisa mengakses <strong>semua paket soal</strong> tanpa batas.
          Manfaatkan masa premium kamu sebaik mungkin!
        </p>
        <a href="${APP_URL}/paket" style="display: inline-block; padding: 12px 24px; background: #2563EB; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Lihat Semua Paket →
        </a>
        <p style="margin-top: 32px; font-size: 12px; color: #9CA3AF;">
          Butuh bantuan? Hubungi kami di support@tryoutplatform.com
        </p>
      </div>
    `,
  })
}
