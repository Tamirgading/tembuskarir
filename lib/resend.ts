// lib/resend.ts
// Email transaksional via Resend — server-side only

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@tembuskarir.id'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tembuskarir.id'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAILS?.split(',')[0]?.trim() ?? ''

// ─── Warna brand TembusKarir ──────────────────────────────────────────────────
const BLUE = '#2563EB'
const BLUE_DARK = '#1E40AF'
const BLUE_LIGHT = '#EFF6FF'
const GREEN = '#16A34A'
const GREEN_LIGHT = '#F0FDF4'
const GRAY = '#6B7280'
const GRAY_LIGHT = '#F9FAFB'
const DARK = '#111827'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!RESEND_API_KEY || RESEND_API_KEY === 'GANTI_INI') {
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
  }
}

// ─── Base layout email ────────────────────────────────────────────────────────
function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TembusKarir</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Logo / Header -->
          <tr>
            <td style="background:${BLUE};border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                TK <span style="font-weight:400;opacity:0.85;">TembusKarir</span>
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#BFDBFE;letter-spacing:0.5px;">
                Platform Simulasi Seleksi Kerja
              </p>
            </td>
          </tr>

          <!-- Konten -->
          <tr>
            <td style="background:#ffffff;padding:32px;border-left:1px solid #E5E7EB;border-right:1px solid #E5E7EB;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${GRAY_LIGHT};border:1px solid #E5E7EB;border-top:none;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:${GRAY};">
                Butuh bantuan? Email kami di
                <a href="mailto:tembuskarir@gmail.com" style="color:${BLUE};text-decoration:none;">tembuskarir@gmail.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">
                © ${new Date().getFullYear()} TembusKarir · Jl. Contoh No. 1, Jakarta
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Helper: baris tabel detail ───────────────────────────────────────────────
function detailRow(label: string, value: string, highlight = false): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:${GRAY};width:40%;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:13px;font-weight:${highlight ? '700' : '600'};color:${highlight ? GREEN : DARK};text-align:right;">${value}</td>
  </tr>`
}

// ─── Format tanggal ───────────────────────────────────────────────────────────
function formatDateID(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }) + ' WIB'
}

function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 1: Selamat datang setelah register
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:${DARK};">Halo, ${name || 'Sobat'}! 👋</h1>
    <p style="margin:0 0 24px;color:${GRAY};font-size:14px;line-height:1.6;">
      Selamat datang di <strong style="color:${DARK};">TembusKarir</strong>! Akun kamu sudah aktif dan siap digunakan.
    </p>
    <div style="background:${BLUE_LIGHT};border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-weight:700;color:${BLUE_DARK};font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Mulai dari sini</p>
      <ul style="margin:0;padding-left:18px;color:#1E40AF;font-size:13px;line-height:2;">
        <li>Coba paket soal gratis — tanpa kartu kredit</li>
        <li>Lihat skor dan pembahasan lengkap setelah ujian</li>
        <li>Pantau progress kamu di dashboard</li>
      </ul>
    </div>
    <a href="${APP_URL}/#jenis-tes"
       style="display:inline-block;padding:13px 28px;background:${BLUE};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">
      Mulai Simulasi Gratis →
    </a>
  `
  await sendEmail({
    to,
    subject: `Halo ${name || 'Sobat'}, akun TembusKarir kamu sudah aktif! 🎉`,
    html: emailLayout(content),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 2: Konfirmasi pembelian PAKET (per-paket, akses permanen)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPackagePaymentEmail(
  to: string,
  name: string,
  packageName: string,
  amount: number,
  packageId: string,
): Promise<void> {
  const now = new Date()
  const content = `
    <!-- Status berhasil -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:${GREEN_LIGHT};border:2px solid #86EFAC;border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;margin-bottom:12px;">✅</div>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:${DARK};">Pembayaran Berhasil!</h1>
      <p style="margin:0;color:${GRAY};font-size:14px;">Paket simulasi berhasil dibeli dan langsung bisa digunakan.</p>
    </div>

    <!-- Greeting -->
    <p style="margin:0 0 20px;font-size:14px;color:${DARK};line-height:1.6;">
      Halo <strong>${name || 'Sobat'}</strong>, terima kasih atas kepercayaanmu. Berikut detail pembelianmu:
    </p>

    <!-- Detail card -->
    <div style="background:${GRAY_LIGHT};border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:${GRAY};text-transform:uppercase;letter-spacing:0.5px;">Detail Pembelian</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Paket', packageName)}
        ${detailRow('Jenis', 'Paket Soal (Akses Permanen)')}
        ${detailRow('Total Bayar', formatRupiah(amount), true)}
        ${detailRow('Waktu Pembelian', formatDateID(now))}
        ${detailRow('Status', '✅ Lunas')}
      </table>
    </div>

    <!-- Info akses -->
    <div style="background:${BLUE_LIGHT};border-left:4px solid ${BLUE};border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:${BLUE_DARK};line-height:1.6;">
        <strong>Akses Permanen</strong> — paket ini tidak memiliki batas waktu.
        Kamu bisa mengerjakan simulasi kapan saja dan berulang kali.
      </p>
    </div>

    <!-- CTA -->
    <a href="${APP_URL}/persiapan/${packageId}"
       style="display:inline-block;padding:13px 28px;background:${BLUE};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">
      Kerjakan Simulasi Sekarang →
    </a>
  `

  await sendEmail({
    to,
    subject: `✅ Pembelian ${packageName} Berhasil — TembusKarir`,
    html: emailLayout(content),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 3: Konfirmasi LANGGANAN premium berhasil
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPaymentSuccessEmail(
  to: string,
  name: string,
  planType: string,
  expiresAt: string,
  amount: number,
): Promise<void> {
  const planLabelMap: Record<string, string> = {
    monthly:           'Premium Bulanan (30 hari)',
    yearly:            'Premium Tahunan (365 hari)',
    premium_monthly:   'Premium Bulanan (30 hari)',
    premium_quarterly: 'Premium 3 Bulan (90 hari)',
  }
  const planLabel = planLabelMap[planType] ?? planType
  const expiryDate = new Date(expiresAt)
  const now = new Date()

  const content = `
    <!-- Status berhasil -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:${GREEN_LIGHT};border:2px solid #86EFAC;border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;margin-bottom:12px;">🎉</div>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:${DARK};">Langganan Premium Aktif!</h1>
      <p style="margin:0;color:${GRAY};font-size:14px;">Akses penuh ke semua paket soal sudah terbuka.</p>
    </div>

    <!-- Greeting -->
    <p style="margin:0 0 20px;font-size:14px;color:${DARK};line-height:1.6;">
      Halo <strong>${name || 'Sobat'}</strong>, terima kasih sudah berlangganan. Berikut detail langgananmu:
    </p>

    <!-- Detail card -->
    <div style="background:${GRAY_LIGHT};border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:${GRAY};text-transform:uppercase;letter-spacing:0.5px;">Detail Langganan</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Paket', planLabel)}
        ${detailRow('Total Bayar', formatRupiah(amount), true)}
        ${detailRow('Tanggal Aktif', formatDateID(now))}
        ${detailRow('Aktif Hingga', formatDateID(expiryDate))}
        ${detailRow('Status', '✅ Aktif')}
      </table>
    </div>

    <!-- Info akses -->
    <div style="background:${BLUE_LIGHT};border-left:4px solid ${BLUE};border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:${BLUE_DARK};line-height:1.6;">
        Dengan Premium, kamu bisa mengakses <strong>seluruh paket soal</strong> PLN, ASTRA, dan semua kategori lainnya
        hingga <strong>${expiryDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
      </p>
    </div>

    <!-- CTA -->
    <a href="${APP_URL}/#jenis-tes"
       style="display:inline-block;padding:13px 28px;background:${BLUE};color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">
      Lihat Semua Paket →
    </a>
  `

  await sendEmail({
    to,
    subject: `🎉 Langganan ${planLabel} Berhasil — TembusKarir`,
    html: emailLayout(content),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 4: Notifikasi ke ADMIN saat ada pembelian berhasil
// ─────────────────────────────────────────────────────────────────────────────
export async function sendAdminNotificationEmail(params: {
  userName: string
  userEmail: string
  purchaseType: 'package' | 'subscription'
  itemName: string       // nama paket atau nama plan
  amount: number
  orderId: string
}): Promise<void> {
  if (!ADMIN_EMAIL) return

  const { userName, userEmail, purchaseType, itemName, amount, orderId } = params
  const now = new Date()
  const typeLabel = purchaseType === 'package' ? 'Pembelian Paket' : 'Langganan Premium'
  const iconEmoji = purchaseType === 'package' ? '📦' : '⭐'

  const content = `
    <h1 style="margin:0 0 4px;font-size:18px;font-weight:800;color:${DARK};">${iconEmoji} Pembayaran Berhasil Masuk</h1>
    <p style="margin:0 0 24px;font-size:13px;color:${GRAY};">${formatDateID(now)}</p>

    <div style="background:${GREEN_LIGHT};border:1px solid #86EFAC;border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:${GREEN};">${formatRupiah(amount)}</p>
      <p style="margin:0;font-size:13px;color:#166534;">${typeLabel} · ${itemName}</p>
    </div>

    <div style="background:${GRAY_LIGHT};border:1px solid #E5E7EB;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:${GRAY};text-transform:uppercase;letter-spacing:0.5px;">Info Pembeli</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Nama', userName)}
        ${detailRow('Email', userEmail)}
        ${detailRow('Item', itemName)}
        ${detailRow('Jenis', typeLabel)}
        ${detailRow('Jumlah', formatRupiah(amount), true)}
        ${detailRow('Order ID', `<span style="font-family:monospace;font-size:11px;">${orderId}</span>`)}
      </table>
    </div>

    <a href="https://dashboard.midtrans.com"
       style="display:inline-block;padding:10px 20px;background:${BLUE};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:13px;">
      Cek Midtrans Dashboard →
    </a>
  `

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `${iconEmoji} [TembusKarir] ${typeLabel}: ${itemName} — ${formatRupiah(amount)}`,
    html: emailLayout(content),
  })
}
