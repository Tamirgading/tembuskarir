// lib/admin.ts
// Helper untuk cek apakah user adalah admin

// Email admin bawaan sistem
const DEFAULT_ADMIN_EMAILS = [
  'tembuskarir@gmail.com',
]

/**
 * Cek apakah email terdaftar sebagai admin.
 * Admin emails disimpan di env ADMIN_EMAILS (comma-separated)
 * serta akun admin default tembuskarir@gmail.com.
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  const normalizedEmail = email.trim().toLowerCase()
  const envEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const adminEmails = Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envEmails]))
  return adminEmails.includes(normalizedEmail)
}
