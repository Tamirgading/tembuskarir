// lib/admin.ts
// Helper untuk cek apakah user adalah admin

/**
 * Cek apakah email terdaftar sebagai admin.
 * Admin emails disimpan di env ADMIN_EMAILS (comma-separated).
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return adminEmails.includes(email.toLowerCase())
}
