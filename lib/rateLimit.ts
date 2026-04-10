// lib/rateLimit.ts
// Simple in-memory rate limiter
// Untuk production besar, ganti dengan Redis (Upstash)

interface RateLimitRecord {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitRecord>()

// Bersihkan record expired setiap 5 menit
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Array.from(store.entries()).forEach(([key, record]) => {
      if (record.resetAt < now) store.delete(key)
    })
  }, 5 * 60 * 1000)
}

interface RateLimitOptions {
  /** Jumlah request maksimum dalam window */
  limit: number
  /** Durasi window dalam detik */
  windowSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const { limit, windowSeconds } = options
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const existing = store.get(key)

  if (!existing || existing.resetAt < now) {
    // Window baru
    const record: RateLimitRecord = { count: 1, resetAt: now + windowMs }
    store.set(key, record)
    return { success: true, remaining: limit - 1, resetAt: record.resetAt }
  }

  existing.count++

  if (existing.count > limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt }
  }

  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

/**
 * Helper: ambil IP dari request header (kompatibel dengan Vercel)
 */
export function getClientIp(req: { headers: { get: (key: string) => string | null } }): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
